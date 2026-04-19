import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

interface EventPayload {
  type:        string;
  target?:     string;
  value?:      string;
  section_id?: string;
  scroll_pct?: number;
  dwell_ms?:   number;
  meta?:       Record<string, unknown>;
  t?:          number;
}

interface SessionContext {
  session_id:    string;
  visitor_id:    string;
  device_type?:  string;
  os?:           string;
  browser?:      string;
  screen_w?:     number;
  screen_h?:     number;
  viewport_w?:   number;
  viewport_h?:   number;
  language?:     string;
  timezone?:     string;
  referrer?:     string;
  referrer_host?: string;
  landing_path?: string;
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_content?:  string;
  utm_term?:     string;
  fbclid?:       string;
  gclid?:        string;
  ttclid?:       string;
}

interface TrackPayload {
  ctx:    SessionContext;
  events: EventPayload[];
}

const BOT_UA = /bot|crawler|spider|crawling|vercel-screenshot|headless|lighthouse|pagespeed|bingpreview|pingdom|uptimerobot|wget|curl/i;

function ipFromHeaders(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

function truncate(s: string | undefined, max: number): string {
  return (s ?? "").toString().slice(0, max);
}

export async function POST(req: NextRequest) {
  let payload: TrackPayload;
  try {
    payload = (await req.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { ctx, events } = payload;
  if (!ctx?.session_id || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent") ?? "";
  const is_bot    = BOT_UA.test(userAgent);

  const sessionRow = {
    session_id:    ctx.session_id,
    visitor_id:    truncate(ctx.visitor_id, 128),
    funnel_slug:   "bootcamp-2026",
    ip:            truncate(ipFromHeaders(req), 64),
    ip_country:    decodeURIComponent(req.headers.get("x-vercel-ip-country")        ?? ""),
    ip_region:     decodeURIComponent(req.headers.get("x-vercel-ip-country-region") ?? ""),
    ip_city:       decodeURIComponent(req.headers.get("x-vercel-ip-city")           ?? ""),
    ip_latitude:   decodeURIComponent(req.headers.get("x-vercel-ip-latitude")       ?? ""),
    ip_longitude:  decodeURIComponent(req.headers.get("x-vercel-ip-longitude")      ?? ""),
    ip_timezone:   decodeURIComponent(req.headers.get("x-vercel-ip-timezone")       ?? ""),
    user_agent:    truncate(userAgent, 512),
    device_type:   truncate(ctx.device_type,   32),
    os:            truncate(ctx.os,            64),
    browser:       truncate(ctx.browser,       64),
    screen_w:      ctx.screen_w   ?? 0,
    screen_h:      ctx.screen_h   ?? 0,
    viewport_w:    ctx.viewport_w ?? 0,
    viewport_h:    ctx.viewport_h ?? 0,
    language:      truncate(ctx.language, 32),
    timezone:      truncate(ctx.timezone, 64),
    referrer:      truncate(ctx.referrer, 512),
    referrer_host: truncate(ctx.referrer_host, 256),
    landing_path:  truncate(ctx.landing_path, 512),
    utm_source:    truncate(ctx.utm_source,   128),
    utm_medium:    truncate(ctx.utm_medium,   128),
    utm_campaign:  truncate(ctx.utm_campaign, 256),
    utm_content:   truncate(ctx.utm_content,  256),
    utm_term:      truncate(ctx.utm_term,     256),
    fbclid:        truncate(ctx.fbclid,       256),
    gclid:         truncate(ctx.gclid,        256),
    ttclid:        truncate(ctx.ttclid,       256),
    is_bot,
  };

  // Upsert sesión (crea o mantiene)
  const { error: sessErr } = await supabase
    .from("sessions")
    .upsert(sessionRow, { onConflict: "session_id", ignoreDuplicates: false });

  if (sessErr) {
    return NextResponse.json({ ok: false, error: sessErr.message, stage: "session_upsert" }, { status: 500 });
  }

  // Acumuladores
  let totalDwell = 0;
  let maxScroll  = 0;
  let clickCount = 0;
  let converted  = false;
  let convertedAt: string | null = null;

  const eventRows = events.map((ev) => {
    if (ev.type === "heartbeat" && typeof ev.dwell_ms === "number") totalDwell += ev.dwell_ms;
    if (typeof ev.scroll_pct === "number" && ev.scroll_pct > maxScroll) maxScroll = ev.scroll_pct;
    if (ev.type === "click") clickCount++;
    if (ev.type === "conversion") {
      converted = true;
      convertedAt = new Date().toISOString();
    }
    return {
      session_id:   ctx.session_id,
      funnel_slug:  "bootcamp-2026",
      event_type:   truncate(ev.type, 32),
      event_target: truncate(ev.target, 256),
      event_value:  truncate(ev.value,  512),
      section_id:   truncate(ev.section_id, 64),
      scroll_pct:   ev.scroll_pct ?? null,
      dwell_ms:     ev.dwell_ms   ?? null,
      meta:         ev.meta       ?? {},
      created_at:   ev.t ? new Date(ev.t).toISOString() : new Date().toISOString(),
    };
  });

  const { error: evErr } = await supabase.from("track_events").insert(eventRows);
  if (evErr) {
    return NextResponse.json({ ok: false, error: evErr.message, stage: "events_insert" }, { status: 500 });
  }

  // Update aggregates en sessions (suma dwell acumulado, max scroll, clicks, conversión)
  const { data: curr } = await supabase
    .from("sessions")
    .select("total_time_ms, max_scroll_pct, click_count, event_count, converted, converted_at")
    .eq("session_id", ctx.session_id)
    .maybeSingle();

  type SessionSnapshot = {
    total_time_ms?: number;
    max_scroll_pct?: number;
    click_count?:   number;
    event_count?:   number;
    converted?:     boolean;
    converted_at?:  string | null;
  };
  const c = (curr ?? {}) as SessionSnapshot;
  const updates = {
    total_time_ms:  (c.total_time_ms  ?? 0) + totalDwell,
    max_scroll_pct: Math.max(c.max_scroll_pct ?? 0, maxScroll),
    click_count:    (c.click_count    ?? 0) + clickCount,
    event_count:    (c.event_count    ?? 0) + eventRows.length,
    last_seen_at:   new Date().toISOString(),
    converted:      c.converted || converted,
    converted_at:   c.converted_at ?? convertedAt,
  };

  await supabase.from("sessions").update(updates).eq("session_id", ctx.session_id);

  // Dwell por sección
  const dwellBySection: Record<string, number> = {};
  for (const ev of events) {
    if (ev.type === "section_leave" && ev.section_id && typeof ev.dwell_ms === "number") {
      dwellBySection[ev.section_id] = (dwellBySection[ev.section_id] ?? 0) + ev.dwell_ms;
    }
  }
  for (const [sectionId, ms] of Object.entries(dwellBySection)) {
    await supabase.rpc("upsert_section_dwell", {
      p_session_id: ctx.session_id,
      p_section_id: sectionId,
      p_ms:         ms,
    });
  }

  return NextResponse.json({ ok: true, count: eventRows.length });
}
