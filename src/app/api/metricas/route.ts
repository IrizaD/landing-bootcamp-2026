import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { parseUA, groupCount } from "@/lib/parseUA";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug        = searchParams.get("slug");
  const desde       = searchParams.get("desde");
  const hasta       = searchParams.get("hasta");
  const pais        = searchParams.get("pais");
  const dispositivo = searchParams.get("dispositivo");
  const fuente      = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  // ── Eventos ─────────────────────────────────────────────────────────────────
  const evCond = ["funnel_slug = $1"];
  const evVals: unknown[] = [slug];
  let ei = 2;

  if (desde)  { evCond.push(`created_at >= $${ei++}`); evVals.push(desde); }
  if (hasta)  { evCond.push(`created_at <= $${ei++}`); evVals.push(hasta + "T23:59:59Z"); }
  if (pais)   { evCond.push(`ip_country = $${ei++}`);  evVals.push(pais); }
  if (fuente) { evCond.push(`utm_source = $${ei++}`);  evVals.push(fuente); }

  const eventosRaw = await sql(
    `SELECT session_id, user_agent, ip_country, ip_city, utm_source, created_at FROM eventos WHERE ${evCond.join(" AND ")}`,
    evVals
  ) as { session_id: string; user_agent: string; ip_country: string; ip_city: string; utm_source: string; created_at: string }[];

  const sesionesMap = new Map<string, typeof eventosRaw[number]>();
  eventosRaw.forEach((e) => { if (!sesionesMap.has(e.session_id)) sesionesMap.set(e.session_id, e); });
  let sesiones = Array.from(sesionesMap.values());

  if (dispositivo) {
    sesiones = sesiones.filter((s) => parseUA(s.user_agent).tipo === dispositivo);
  }

  const visitantesTipo    = groupCount(sesiones, (s) => parseUA(s.user_agent).tipo);
  const visitantesOS      = groupCount(sesiones, (s) => parseUA(s.user_agent).os);
  const visitantesBrowser = groupCount(sesiones, (s) => parseUA(s.user_agent).browser);
  const visitantesPais    = groupCount(sesiones, (s) => s.ip_country || "Desconocido");
  const visitantesCiudad  = groupCount(sesiones, (s) => s.ip_city    || "Desconocido");
  const utmSources        = groupCount(
    sesiones.filter((s) => s.utm_source),
    (s) => s.utm_source
  );

  // ── Registros ───────────────────────────────────────────────────────────────
  const regCond = ["funnel_slug = $1"];
  const regVals: unknown[] = [slug];
  let ri = 2;

  if (desde)  { regCond.push(`created_at >= $${ri++}`); regVals.push(desde); }
  if (hasta)  { regCond.push(`created_at <= $${ri++}`); regVals.push(hasta + "T23:59:59Z"); }
  if (pais)   { regCond.push(`ip_country = $${ri++}`);  regVals.push(pais); }
  if (fuente) { regCond.push(`utm_source = $${ri++}`);  regVals.push(fuente); }

  let registros = await sql(
    `SELECT id, user_agent, ip_country, ip_city, utm_source, created_at FROM registros WHERE ${regCond.join(" AND ")} ORDER BY created_at DESC LIMIT 1000`,
    regVals
  ) as { id: string; user_agent: string; ip_country: string; ip_city: string; utm_source: string; created_at: string }[];

  if (dispositivo) {
    registros = registros.filter((r) => parseUA(r.user_agent).tipo === dispositivo);
  }

  const registradosTipo    = groupCount(registros, (r) => parseUA(r.user_agent).tipo);
  const registradosOS      = groupCount(registros, (r) => parseUA(r.user_agent).os);
  const registradosBrowser = groupCount(registros, (r) => parseUA(r.user_agent).browser);
  const registradosPais    = groupCount(registros, (r) => r.ip_country || "Desconocido");
  const registradosCiudad  = groupCount(registros, (r) => r.ip_city    || "Desconocido");

  return NextResponse.json({
    totalSesiones:  sesiones.length,
    totalRegistros: registros.length,
    tasaConversion: sesiones.length > 0
      ? ((registros.length / sesiones.length) * 100).toFixed(1)
      : "0",
    utmSources,
    visitantes: {
      tipo:    visitantesTipo,
      os:      visitantesOS,
      browser: visitantesBrowser,
      pais:    visitantesPais,
      ciudad:  visitantesCiudad,
    },
    registrados: {
      tipo:    registradosTipo,
      os:      registradosOS,
      browser: registradosBrowser,
      pais:    registradosPais,
      ciudad:  registradosCiudad,
    },
  });
}
