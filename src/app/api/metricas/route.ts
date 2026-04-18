import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
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
  let evQuery = supabase
    .from("eventos")
    .select("session_id, user_agent, ip_country, ip_city, utm_source, created_at")
    .eq("funnel_slug", slug);

  if (desde)  evQuery = evQuery.gte("created_at", desde);
  if (hasta)  evQuery = evQuery.lte("created_at", hasta + "T23:59:59Z");
  if (pais)   evQuery = evQuery.eq("ip_country", pais);
  if (fuente) evQuery = evQuery.eq("utm_source", fuente);

  const { data: eventosRaw } = await evQuery;
  const eventosData = (eventosRaw ?? []) as { session_id: string; user_agent: string; ip_country: string; ip_city: string; utm_source: string; created_at: string }[];

  const sesionesMap = new Map<string, typeof eventosData[number]>();
  eventosData.forEach((e) => { if (!sesionesMap.has(e.session_id)) sesionesMap.set(e.session_id, e); });
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
  let regQuery = supabase
    .from("registros")
    .select("id, user_agent, ip_country, ip_city, utm_source, created_at")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (desde)  regQuery = regQuery.gte("created_at", desde);
  if (hasta)  regQuery = regQuery.lte("created_at", hasta + "T23:59:59Z");
  if (pais)   regQuery = regQuery.eq("ip_country", pais);
  if (fuente) regQuery = regQuery.eq("utm_source", fuente);

  const { data: registrosRaw } = await regQuery;
  let registros = (registrosRaw ?? []) as { id: string; user_agent: string; ip_country: string; ip_city: string; utm_source: string; created_at: string }[];

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
