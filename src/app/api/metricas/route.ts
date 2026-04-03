import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseUA, groupCount } from "@/lib/parseUA";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug       = searchParams.get("slug");
  const desde      = searchParams.get("desde");   // ISO date string
  const hasta      = searchParams.get("hasta");
  const pais       = searchParams.get("pais");
  const dispositivo = searchParams.get("dispositivo");
  const fuente     = searchParams.get("fuente");

  if (!slug) return NextResponse.json({ error: "slug requerido" }, { status: 400 });

  // ── Eventos (visitantes) ────────────────────────────────────────────────────
  let qEventos = supabaseAdmin
    .from("eventos")
    .select("session_id, user_agent, ip_country, ip_city, utm_source, created_at")
    .eq("funnel_slug", slug);

  if (desde) qEventos = qEventos.gte("created_at", desde);
  if (hasta) qEventos = qEventos.lte("created_at", hasta + "T23:59:59Z");
  if (pais)  qEventos = qEventos.eq("ip_country", pais);
  if (fuente) qEventos = qEventos.eq("utm_source", fuente);

  const { data: eventosRaw } = await qEventos;
  const eventos = eventosRaw ?? [];

  // Sesiones únicas
  const sesionesMap = new Map<string, typeof eventos[number]>();
  eventos.forEach((e) => { if (!sesionesMap.has(e.session_id)) sesionesMap.set(e.session_id, e); });
  let sesiones = Array.from(sesionesMap.values());

  // Filtro por dispositivo (post-processing)
  if (dispositivo) {
    sesiones = sesiones.filter((s) => parseUA(s.user_agent).tipo === dispositivo);
  }

  const visitantesTipo    = groupCount(sesiones, (s) => parseUA(s.user_agent).tipo);
  const visitantesOS      = groupCount(sesiones, (s) => parseUA(s.user_agent).os);
  const visitantesBrowser = groupCount(sesiones, (s) => parseUA(s.user_agent).browser);
  const visitantesPais    = groupCount(sesiones, (s) => s.ip_country || "Desconocido");
  const visitantesCiudad  = groupCount(sesiones, (s) => s.ip_city    || "Desconocido");

  const utmSources = groupCount(
    sesiones.filter((s) => s.utm_source),
    (s) => s.utm_source
  );

  // ── Registros ───────────────────────────────────────────────────────────────
  let qRegistros = supabaseAdmin
    .from("registros")
    .select("id, user_agent, ip_country, ip_city, utm_source, created_at")
    .eq("funnel_slug", slug)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (desde) qRegistros = qRegistros.gte("created_at", desde);
  if (hasta) qRegistros = qRegistros.lte("created_at", hasta + "T23:59:59Z");
  if (pais)  qRegistros = qRegistros.eq("ip_country", pais);
  if (fuente) qRegistros = qRegistros.eq("utm_source", fuente);

  const { data: registrosRaw } = await qRegistros;
  let registros = registrosRaw ?? [];

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
