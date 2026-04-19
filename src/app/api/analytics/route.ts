import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

/**
 * Endpoint agregado para el dashboard.
 * Retorna: embudo, engagement por sección, CTR por botón, top fuentes, geo.
 *
 * Query:
 *   ?desde=2026-04-01&hasta=2026-04-18
 *   &pais=MX&device=mobile&source=facebook&excludeBots=1
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const desde       = searchParams.get("desde");
  const hasta       = searchParams.get("hasta");
  const pais        = searchParams.get("pais");
  const device      = searchParams.get("device");
  const source      = searchParams.get("source");
  const excludeBots = searchParams.get("excludeBots") !== "0";

  let q = supabase.from("sessions").select("*").eq("funnel_slug", "bootcamp-2026");
  if (desde)       q = q.gte("first_seen_at", desde);
  if (hasta)       q = q.lte("first_seen_at", hasta + "T23:59:59Z");
  if (pais)        q = q.eq("ip_country", pais);
  if (device)      q = q.eq("device_type", device);
  if (source)      q = q.eq("utm_source", source);
  if (excludeBots) q = q.eq("is_bot", false);

  const { data: sessionsRaw, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  type SessionRow = {
    session_id: string;
    total_time_ms: number;
    max_scroll_pct: number;
    converted: boolean;
    click_count: number;
    device_type: string;
    browser: string;
    os: string;
    ip_country: string;
    ip_city: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    referrer_host: string;
  };
  const sessions = (sessionsRaw ?? []) as SessionRow[];
  const sessionIds = sessions.map((s) => s.session_id);

  const { data: dwellRaw } = sessionIds.length
    ? await supabase.from("section_dwell").select("*").in("session_id", sessionIds)
    : { data: [] as unknown as { section_id: string; total_ms: number; view_count: number; session_id: string }[] };

  const { data: eventsRaw } = sessionIds.length
    ? await supabase.from("track_events").select("event_type, event_target, section_id, session_id").in("session_id", sessionIds)
    : { data: [] as unknown as { event_type: string; event_target: string; section_id: string; session_id: string }[] };

  type DwellRow  = { session_id: string; section_id: string; total_ms: number; view_count: number };
  type EventRow  = { event_type: string; event_target: string; section_id: string; session_id: string };
  const dwell  = (dwellRaw ?? []) as DwellRow[];
  const events = (eventsRaw ?? []) as EventRow[];

  // Embudo
  const total        = sessions.length;
  const converted    = sessions.filter((s) => s.converted).length;
  const formFocused  = new Set(events.filter((e) => e.event_type === "form_focus").map((e) => e.session_id)).size;
  const scroll50     = sessions.filter((s) => s.max_scroll_pct >= 50).length;
  const timeOver60s  = sessions.filter((s) => s.total_time_ms >= 60_000).length;

  // Engagement por sección
  const sectionAgg: Record<string, { total_ms: number; sessions: Set<string>; views: number }> = {};
  for (const d of dwell) {
    const k = d.section_id || "unknown";
    if (!sectionAgg[k]) sectionAgg[k] = { total_ms: 0, sessions: new Set(), views: 0 };
    sectionAgg[k].total_ms += d.total_ms;
    sectionAgg[k].sessions.add(d.session_id);
    sectionAgg[k].views += d.view_count;
  }
  const sectionEngagement = Object.entries(sectionAgg)
    .map(([section, v]) => ({
      section,
      sessions_viewed: v.sessions.size,
      total_ms:        v.total_ms,
      avg_dwell_s:     v.sessions.size ? Math.round(v.total_ms / v.sessions.size) / 1000 : 0,
      views:           v.views,
    }))
    .sort((a, b) => b.total_ms - a.total_ms);

  // Clicks por target
  const clickAgg: Record<string, { clicks: number; sessions: Set<string> }> = {};
  for (const e of events) {
    if (e.event_type !== "click") continue;
    const k = e.event_target || "(unknown)";
    if (!clickAgg[k]) clickAgg[k] = { clicks: 0, sessions: new Set() };
    clickAgg[k].clicks++;
    clickAgg[k].sessions.add(e.session_id);
  }
  const topClicks = Object.entries(clickAgg)
    .map(([target, v]) => ({ target, clicks: v.clicks, unique_sessions: v.sessions.size }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 25);

  // Segmentación
  const by = <T extends keyof SessionRow>(key: T) => {
    const m: Record<string, number> = {};
    for (const s of sessions) {
      const v = (s[key] as string | number | null | undefined) || "Desconocido";
      m[String(v)] = (m[String(v)] ?? 0) + 1;
    }
    return Object.entries(m).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  };

  // Tiempo promedio & scroll promedio
  const avgTimeMs   = total ? sessions.reduce((a, s) => a + (s.total_time_ms ?? 0), 0) / total : 0;
  const avgScroll   = total ? sessions.reduce((a, s) => a + (s.max_scroll_pct ?? 0), 0) / total : 0;
  const avgClicks   = total ? sessions.reduce((a, s) => a + (s.click_count ?? 0), 0) / total : 0;

  return NextResponse.json({
    totals: {
      sessions:          total,
      conversions:       converted,
      conversion_rate:   total ? +(100 * converted / total).toFixed(2) : 0,
      form_focus_rate:   total ? +(100 * formFocused / total).toFixed(2) : 0,
      scroll50_rate:     total ? +(100 * scroll50 / total).toFixed(2) : 0,
      time60s_rate:      total ? +(100 * timeOver60s / total).toFixed(2) : 0,
      avg_time_s:        +(avgTimeMs / 1000).toFixed(1),
      avg_scroll_pct:    +avgScroll.toFixed(1),
      avg_clicks:        +avgClicks.toFixed(2),
    },
    funnel: [
      { step: "Visita",        count: total },
      { step: "Scroll 50%",    count: scroll50 },
      { step: "Tiempo > 60s",  count: timeOver60s },
      { step: "Form enfocado", count: formFocused },
      { step: "Conversión",    count: converted },
    ],
    sectionEngagement,
    topClicks,
    segments: {
      device:        by("device_type"),
      browser:       by("browser"),
      os:            by("os"),
      country:       by("ip_country"),
      city:          by("ip_city"),
      utm_source:    by("utm_source"),
      utm_medium:    by("utm_medium"),
      utm_campaign:  by("utm_campaign"),
      referrer:      by("referrer_host"),
    },
  });
}
