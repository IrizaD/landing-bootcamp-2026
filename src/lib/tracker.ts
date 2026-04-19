/**
 * Tracker cliente para analytics granular.
 * Eventos soportados: session_init, heartbeat, section_view, click, scroll,
 * form_focus, form_submit, conversion.
 *
 * El tracker NO persiste en localStorage datos sensibles — solo session_id.
 */

export type TrackerEventType =
  | "session_init"
  | "heartbeat"
  | "section_view"
  | "section_leave"
  | "click"
  | "scroll"
  | "form_focus"
  | "form_submit"
  | "conversion"
  | "exit";

export interface TrackerEvent {
  type:        TrackerEventType;
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
  device_type:   string;
  os:            string;
  browser:       string;
  screen_w:      number;
  screen_h:      number;
  viewport_w:    number;
  viewport_h:    number;
  language:      string;
  timezone:      string;
  referrer:      string;
  referrer_host: string;
  landing_path:  string;
  utm_source:    string;
  utm_medium:    string;
  utm_campaign:  string;
  utm_content:   string;
  utm_term:      string;
  fbclid:        string;
  gclid:         string;
  ttclid:        string;
}

// ─── UUID (crypto.randomUUID fallback) ──────────────────────
function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Device / UA sniff cliente (lightweight) ────────────────
function clientUA(): { device_type: string; os: string; browser: string } {
  const ua = navigator.userAgent;
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobile|Android|iPhone|iPod|Windows Phone|BlackBerry|IEMobile/i.test(ua);
  const device_type = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let os = "Otro";
  if (/iPhone|iPod/.test(ua))      os = "iOS";
  else if (/iPad/.test(ua))        os = "iPadOS";
  else if (/Android/.test(ua))     os = "Android";
  else if (/Windows/.test(ua))     os = "Windows";
  else if (/Mac OS X/.test(ua))    os = "macOS";
  else if (/CrOS/.test(ua))        os = "ChromeOS";
  else if (/Linux/.test(ua))       os = "Linux";

  let browser = "Otro";
  if (/Edg\//.test(ua))                browser = "Edge";
  else if (/OPR\/|Opera/.test(ua))     browser = "Opera";
  else if (/SamsungBrowser/.test(ua))  browser = "Samsung";
  else if (/Firefox\//.test(ua))       browser = "Firefox";
  else if (/Chrome\//.test(ua))        browser = "Chrome";
  else if (/Safari\//.test(ua))        browser = "Safari";

  return { device_type, os, browser };
}

function extractParam(name: string, search: URLSearchParams): string {
  return search.get(name) ?? "";
}

function buildContext(): SessionContext {
  const search = new URLSearchParams(window.location.search);
  const { device_type, os, browser } = clientUA();

  let referrer_host = "";
  try {
    referrer_host = document.referrer ? new URL(document.referrer).host : "";
  } catch {
    referrer_host = "";
  }

  let session_id = sessionStorage.getItem("_sid") ?? "";
  if (!session_id) {
    session_id = uuid();
    sessionStorage.setItem("_sid", session_id);
  }
  let visitor_id = localStorage.getItem("_vid") ?? "";
  if (!visitor_id) {
    visitor_id = uuid();
    try { localStorage.setItem("_vid", visitor_id); } catch { /* ignore */ }
  }

  return {
    session_id,
    visitor_id,
    device_type,
    os,
    browser,
    screen_w:     window.screen?.width  ?? 0,
    screen_h:     window.screen?.height ?? 0,
    viewport_w:   window.innerWidth  ?? 0,
    viewport_h:   window.innerHeight ?? 0,
    language:     navigator.language ?? "",
    timezone:     Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    referrer:     document.referrer ?? "",
    referrer_host,
    landing_path: window.location.pathname + window.location.search,
    utm_source:   extractParam("utm_source",   search),
    utm_medium:   extractParam("utm_medium",   search),
    utm_campaign: extractParam("utm_campaign", search),
    utm_content:  extractParam("utm_content",  search),
    utm_term:     extractParam("utm_term",     search),
    fbclid:       extractParam("fbclid",       search),
    gclid:        extractParam("gclid",        search),
    ttclid:       extractParam("ttclid",       search),
  };
}

// ─── Batching queue ─────────────────────────────────────────
class Tracker {
  private ctx: SessionContext;
  private queue: TrackerEvent[] = [];
  private flushTimer: number | null = null;
  private sectionEnter: Record<string, number> = {};
  private maxScroll = 0;
  private lastHeartbeat = Date.now();
  private accumulatedTime = 0;
  private pageVisible = true;
  private started = false;

  constructor() {
    this.ctx = buildContext();
  }

  start() {
    if (this.started) return;
    this.started = true;

    // Session init
    this.send("session_init", { meta: { ctx: this.ctx } });

    // Heartbeat cada 10s (acumula tiempo si la pestaña está visible)
    window.setInterval(() => this.heartbeat(), 10_000);

    // Visibility
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.heartbeat();
        this.pageVisible = false;
      } else {
        this.pageVisible = true;
        this.lastHeartbeat = Date.now();
      }
    });

    // Scroll tracking
    let scrollTick = false;
    window.addEventListener("scroll", () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        const pct = this.scrollPct();
        if (pct > this.maxScroll) {
          this.maxScroll = pct;
          if ([25, 50, 75, 90, 100].includes(pct)) {
            this.track({ type: "scroll", scroll_pct: pct });
          }
        }
        scrollTick = false;
      });
    }, { passive: true });

    // Section dwell
    this.observeSections();

    // Click tracking — cualquier [data-track], botón, link primario
    document.addEventListener("click", (ev) => {
      const el = (ev.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-track], a, button"
      );
      if (!el) return;
      const target = el.getAttribute("data-track") ?? this.labelOf(el);
      this.track({
        type: "click",
        target,
        value: (el as HTMLAnchorElement).href ?? "",
        section_id: this.findSectionId(el),
      });
    }, { capture: true });

    // Form focus — primera interacción
    let formFocused = false;
    document.addEventListener("focusin", (ev) => {
      const el = ev.target as HTMLElement;
      if (formFocused) return;
      if (el.matches("input, textarea, select")) {
        formFocused = true;
        this.track({
          type: "form_focus",
          target: el.getAttribute("name") ?? el.id ?? "unknown_field",
          section_id: this.findSectionId(el),
        });
      }
    });

    // Exit
    window.addEventListener("pagehide", () => this.flushBeacon("exit"));
    window.addEventListener("beforeunload", () => this.flushBeacon("exit"));
  }

  // Marcar conversión (se llama tras submit exitoso del form)
  conversion(meta: Record<string, unknown> = {}) {
    this.track({ type: "conversion", meta });
    this.flush();
  }

  // Emitir evento custom desde fuera
  track(ev: TrackerEvent) {
    this.queue.push({ ...ev, t: Date.now() });
    if (this.queue.length >= 10) this.flush();
    else this.scheduleFlush();
  }

  // ─── Internals ───────────────────────────────────────────
  private heartbeat() {
    if (!this.pageVisible) return;
    const now = Date.now();
    const delta = now - this.lastHeartbeat;
    this.lastHeartbeat = now;
    this.accumulatedTime += delta;
    this.track({
      type: "heartbeat",
      dwell_ms: delta,
      scroll_pct: this.maxScroll,
      meta: { total_ms: this.accumulatedTime },
    });
  }

  private scrollPct(): number {
    const h = document.documentElement;
    const total = (h.scrollHeight - h.clientHeight) || 1;
    return Math.min(100, Math.max(0, Math.round((h.scrollTop / total) * 100)));
  }

  private observeSections() {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.section ?? "";
          if (!id) continue;
          if (e.isIntersecting) {
            this.sectionEnter[id] = Date.now();
            this.track({ type: "section_view", section_id: id });
          } else if (this.sectionEnter[id]) {
            const dwell = Date.now() - this.sectionEnter[id];
            delete this.sectionEnter[id];
            this.track({ type: "section_leave", section_id: id, dwell_ms: dwell });
          }
        }
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => obs.observe(s));
  }

  private findSectionId(el: HTMLElement): string {
    const host = el.closest<HTMLElement>("[data-section]");
    return host?.dataset.section ?? "";
  }

  private labelOf(el: HTMLElement): string {
    const id = el.getAttribute("id");
    const ariaLabel = el.getAttribute("aria-label");
    const text = (el.textContent ?? "").trim().slice(0, 60);
    return ariaLabel ?? id ?? text ?? el.tagName.toLowerCase();
  }

  private send(type: TrackerEventType, extra: Partial<TrackerEvent> = {}) {
    this.track({ type, ...extra });
  }

  private scheduleFlush() {
    if (this.flushTimer != null) return;
    this.flushTimer = window.setTimeout(() => this.flush(), 3_000);
  }

  private flush() {
    if (this.flushTimer != null) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0, this.queue.length);
    const payload = { ctx: this.ctx, events: batch };
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Si falla, re-encolar al frente para próxima oportunidad
        this.queue.unshift(...batch);
      });
    } catch {
      this.queue.unshift(...batch);
    }
  }

  // Enviar usando sendBeacon en páginas que se cierran
  private flushBeacon(finalType: TrackerEventType) {
    this.heartbeat();
    this.queue.push({ type: finalType, scroll_pct: this.maxScroll, dwell_ms: this.accumulatedTime, t: Date.now() });
    const payload = JSON.stringify({ ctx: this.ctx, events: this.queue });
    this.queue = [];
    if ("sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  getSessionId(): string {
    return this.ctx.session_id;
  }
}

let singleton: Tracker | null = null;

export function getTracker(): Tracker {
  if (!singleton && typeof window !== "undefined") singleton = new Tracker();
  return singleton as Tracker;
}

export function initTracker(): void {
  if (typeof window === "undefined") return;
  getTracker().start();
}
