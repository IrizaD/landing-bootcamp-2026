"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { content, type Speaker } from "./content";
import { HeroBg } from "./HeroBg";
import { initTracker, getTracker } from "@/lib/tracker";

// ─── DATA ──────────────────────────────────────────────────
const countries = [
  "México","Colombia","Argentina","Chile","Perú","Venezuela","Ecuador",
  "Guatemala","Bolivia","República Dominicana","Honduras","El Salvador",
  "Costa Rica","Panamá","Uruguay","Paraguay","Nicaragua","Estados Unidos",
  "España","Canadá","Otro",
];

// ─── ICONS ─────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const CheckCircle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IgIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── DETAIL ICONS ───────────────────────────────────────────
const detailIcons = [
  <svg key="cal" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  <svg key="ppl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="aw"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  <svg key="vid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
];

// ─── TRACKER HOOK ──────────────────────────────────────────
function useTracker() {
  useEffect(() => {
    initTracker();
  }, []);
}

// ─── SCROLL REVEAL HOOK ────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── WHAT IS A BOOTCAMP SECTION ────────────────────────────
function WhatIsBootcamp() {
  return (
    <section className="whatis section" data-section="whatis">
      <div className="container">
        <div className="whatis-header">
          <span className="section-label reveal">{content.whatIs.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.whatIs.title_1} <span className="text-red">{content.whatIs.title_em}</span> {content.whatIs.title_2}
          </h2>
          <p className="whatis-intro reveal reveal-delay-2">{content.whatIs.intro}</p>
        </div>

        <div className="whatis-grid">
          <div className="whatis-col reveal">
            <div className="whatis-col-tag whatis-no">✕ · Lo que NO es</div>
            <ul className="whatis-list">
              {content.whatIs.notItems.map((it) => (
                <li key={it.t} className="whatis-item whatis-item-no">
                  <span className="whatis-item-dot"></span>
                  <div>
                    <div className="whatis-item-title">{it.t}</div>
                    <div className="whatis-item-body">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="whatis-col reveal reveal-delay-2">
            <div className="whatis-col-tag whatis-yes">✓ · Lo que SÍ es</div>
            <ul className="whatis-list">
              {content.whatIs.isItems.map((it) => (
                <li key={it.t} className="whatis-item whatis-item-yes">
                  <span className="whatis-item-dot"></span>
                  <div>
                    <div className="whatis-item-title">{it.t}</div>
                    <div className="whatis-item-body">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="whatis-closing reveal reveal-delay-3">{content.whatIs.closing}</p>
      </div>
    </section>
  );
}

// ─── 3D PILLARS ANIMATION ──────────────────────────────────
function PillarsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1 (scroll-linked)
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let rafId = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // p = 0 cuando la sección recién entra desde abajo, 1 cuando se va por arriba
        const start = vh;
        const end = -rect.height + vh * 0.4;
        const raw = (start - rect.top) / (start - end);
        const p = Math.min(1, Math.max(0, raw));
        setProgress(p);
        const idx = p < 0.18 ? -1 : p < 0.45 ? 0 : p < 0.72 ? 1 : 2;
        setActiveIdx(idx);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const pillars = content.pillars.items;

  return (
    <section className="pillars section" ref={containerRef} data-section="pillars">
      <div className="pillars-bg" aria-hidden="true">
        <div className="pillars-bg-glow" style={{ opacity: 0.3 + progress * 0.7 }} />
        <div className="pillars-bg-grid" />
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="pillars-particle" style={{ left: `${(i * 43) % 100}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className="container pillars-inner">
        <div className="pillars-header">
          <span className="section-label reveal">{content.pillars.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.pillars.title_1} <span className="text-red">{content.pillars.title_em}</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 auto" }}>
            {content.pillars.subtitle}
          </p>
        </div>

        <div className="pillars-stage">
          {/* 3D scene — 3 cards apiladas en perspectiva */}
          <div className="pillars-scene" style={{ transform: `perspective(1400px) rotateX(${10 - progress * 6}deg) rotateY(${-6 + progress * 6}deg)` }}>
            {pillars.map((p, i) => {
              const isActive = activeIdx === i;
              const isPast = activeIdx > i;
              const offset = (i - 1) * 24; // -24, 0, 24
              const localReveal = activeIdx >= i ? 1 : 0;
              return (
                <div
                  key={p.n}
                  className={`pillar-card ${isActive ? "active" : ""} ${isPast ? "past" : ""}`}
                  style={{
                    "--pillar-color":  p.color,
                    "--pillar-offset": `${offset}px`,
                    "--pillar-depth":  `${(i - 1) * -60}px`,
                    opacity:           isActive ? 1 : isPast ? 0.85 : 0.5 + localReveal * 0.5,
                    transform: `translateX(${offset}px) translateZ(${(i - 1) * -60}px) rotateY(${(i - 1) * -8 + (isActive ? 0 : 0)}deg) ${isActive ? "scale(1.05)" : "scale(1)"}`,
                  } as React.CSSProperties}
                >
                  <div className="pillar-card-glow" />
                  <div className="pillar-num">{p.n}</div>
                  <div className="pillar-tag">{p.tag}</div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-headline">{p.headline}</p>
                  <p className="pillar-body">{p.body}</p>
                  <ul className="pillar-bullets">
                    {p.bullets.map((b) => (
                      <li key={b}><span className="pillar-check"><CheckCircle /></span>{b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Línea conectora */}
          <div className="pillars-connector" aria-hidden="true">
            <div className="pillars-connector-track" />
            <div className="pillars-connector-fill" style={{ width: `${Math.min(100, progress * 110)}%` }} />
            {pillars.map((p, i) => (
              <span
                key={i}
                className={`pillars-connector-dot ${activeIdx >= i ? "on" : ""}`}
                style={{ left: `${(i / (pillars.length - 1)) * 100}%`, ["--pillar-color" as string]: p.color }}
              >
                <span className="pillars-connector-pulse" />
              </span>
            ))}
          </div>

          {/* Caption progresiva */}
          <div className="pillars-caption">
            {activeIdx < 0 && <span>Desliza para ver cómo se apilan →</span>}
            {activeIdx === 0 && <span className="pillars-caption-active" style={{ color: pillars[0].color }}>Capa 1/3 — {pillars[0].tag}</span>}
            {activeIdx === 1 && <span className="pillars-caption-active" style={{ color: pillars[1].color }}>Capa 2/3 — {pillars[1].tag}</span>}
            {activeIdx === 2 && <span className="pillars-caption-active" style={{ color: pillars[2].color }}>Capa 3/3 — {pillars[2].tag}</span>}
          </div>
        </div>

        {/* Síntesis final */}
        <div className={`pillars-synthesis ${progress > 0.9 ? "visible" : ""}`}>
          <div className="pillars-synthesis-bar">
            {pillars.map((p) => (
              <span key={p.n} className="pillars-synthesis-chip" style={{ background: p.color }}>{p.tag}</span>
            ))}
          </div>
          <div className="pillars-synthesis-equation">
            <span>{content.pillars.synthesis.title}</span>
            <strong className="pillars-synthesis-result">{content.pillars.synthesis.result}</strong>
          </div>
          <p className="pillars-synthesis-caption">{content.pillars.synthesis.caption}</p>
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF POPUP ────────────────────────────────────
function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const initial = window.setTimeout(() => setVisible(true), 8000);
    return () => window.clearTimeout(initial);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    const cycle = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % content.popup.people.length);
        setVisible(true);
      }, 600);
    }, 9000);
    return () => window.clearInterval(cycle);
  }, [visible, dismissed]);

  if (dismissed) return null;
  const person = content.popup.people[idx];

  return (
    <div className={`popup-proof ${visible ? "visible" : ""}`} role="status" aria-live="polite">
      <button className="popup-close" onClick={() => setDismissed(true)} aria-label="Cerrar notificación">
        <CloseIcon />
      </button>
      <div className="popup-avatar">{person.name.slice(0,1)}</div>
      <div className="popup-body">
        <div className="popup-name"><strong>{person.name}</strong> · <span className="popup-city">{person.city}</span></div>
        <div className="popup-action">{content.popup.title_prefix}</div>
        <div className="popup-time">hace {person.minutes} min · <span className="popup-urgency">{content.popup.urgency}</span></div>
      </div>
    </div>
  );
}

// ─── ROI CALCULATOR ────────────────────────────────────────
function RoiCalculator() {
  const [ticket, setTicket]         = useState(500);
  const [clients, setClients]       = useState(10);
  const [priceLever, setPriceLever] = useState(30);   // +%
  const [volumeLever, setVolumeLever] = useState(50); // +%
  const [recurrence, setRecurrence] = useState(1.5);  // x veces/año

  const currentMonth    = ticket * clients;
  const newTicket       = ticket * (1 + priceLever / 100);
  const newClients      = clients * (1 + volumeLever / 100);
  const projectedMonth  = newTicket * newClients;
  const projectedYear   = projectedMonth * 12 * recurrence;
  const currentYear     = currentMonth * 12;
  const deltaYear       = projectedYear - currentYear;

  const fmt = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.max(0, n));

  function scrollToRegistro() {
    document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
    try { getTracker()?.track({ type: "click", target: "calculator_cta" }); } catch { /* noop */ }
  }

  return (
    <section className="calculator section" data-section="calculator">
      <div className="container">
        <div className="calculator-header">
          <span className="section-label reveal">{content.calculator.label}</span>
          <h2 className="section-title reveal reveal-delay-1">
            {content.calculator.title_1} <span className="text-red">{content.calculator.title_em}</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 700, margin: "0 auto" }}>
            {content.calculator.subtitle}
          </p>
        </div>

        <div className="calc-card reveal reveal-delay-2">
          <div className="calc-grid">
            {/* Inputs */}
            <div className="calc-inputs">
              <div className="calc-field">
                <label className="calc-label">{content.calculator.inputs.ticket_label}</label>
                <div className="calc-input-wrap">
                  <span className="calc-currency">$</span>
                  <input
                    type="number"
                    className="calc-input"
                    value={ticket}
                    min={10}
                    step={10}
                    onChange={(e) => setTicket(Math.max(0, Number(e.target.value)))}
                    data-track="calc_ticket"
                  />
                  <span className="calc-suffix">USD</span>
                </div>
                <span className="calc-hint">{content.calculator.inputs.ticket_hint}</span>
              </div>

              <div className="calc-field">
                <label className="calc-label">{content.calculator.inputs.clients_label}</label>
                <div className="calc-input-wrap">
                  <input
                    type="number"
                    className="calc-input"
                    value={clients}
                    min={1}
                    step={1}
                    onChange={(e) => setClients(Math.max(0, Number(e.target.value)))}
                    data-track="calc_clients"
                  />
                  <span className="calc-suffix">clientes/mes</span>
                </div>
                <span className="calc-hint">{content.calculator.inputs.clients_hint}</span>
              </div>

              <div className="calc-lever">
                <div className="calc-lever-head">
                  <span className="calc-lever-num">01</span>
                  <div>
                    <div className="calc-lever-label">{content.calculator.levers.price_label}</div>
                    <div className="calc-lever-value">+{priceLever}%</div>
                  </div>
                </div>
                <input type="range" min={0} max={150} step={5} value={priceLever} onChange={(e) => setPriceLever(Number(e.target.value))} data-track="calc_price_lever" />
                <span className="calc-hint">{content.calculator.levers.price_hint}</span>
              </div>

              <div className="calc-lever">
                <div className="calc-lever-head">
                  <span className="calc-lever-num">02</span>
                  <div>
                    <div className="calc-lever-label">{content.calculator.levers.volume_label}</div>
                    <div className="calc-lever-value">+{volumeLever}%</div>
                  </div>
                </div>
                <input type="range" min={0} max={300} step={10} value={volumeLever} onChange={(e) => setVolumeLever(Number(e.target.value))} data-track="calc_volume_lever" />
                <span className="calc-hint">{content.calculator.levers.volume_hint}</span>
              </div>

              <div className="calc-lever">
                <div className="calc-lever-head">
                  <span className="calc-lever-num">03</span>
                  <div>
                    <div className="calc-lever-label">{content.calculator.levers.recurrence_label}</div>
                    <div className="calc-lever-value">{recurrence.toFixed(1)}x</div>
                  </div>
                </div>
                <input type="range" min={1} max={6} step={0.1} value={recurrence} onChange={(e) => setRecurrence(Number(e.target.value))} data-track="calc_recurrence_lever" />
                <span className="calc-hint">{content.calculator.levers.recurrence_hint}</span>
              </div>
            </div>

            {/* Outputs */}
            <div className="calc-outputs">
              <div className="calc-output-row">
                <span className="calc-output-label">{content.calculator.outputs.current_month}</span>
                <span className="calc-output-value">{fmt(currentMonth)}</span>
              </div>
              <div className="calc-output-row">
                <span className="calc-output-label">{content.calculator.outputs.projected_month}</span>
                <span className="calc-output-value text-green">{fmt(projectedMonth)}</span>
              </div>
              <div className="calc-output-row">
                <span className="calc-output-label">{content.calculator.outputs.projected_year}</span>
                <span className="calc-output-value text-green big">{fmt(projectedYear)}</span>
              </div>
              <div className="calc-delta">
                <span className="calc-delta-label">{content.calculator.outputs.delta_year}</span>
                <span className="calc-delta-value">+ {fmt(deltaYear)}</span>
              </div>
              <button type="button" className="btn-primary calc-cta" onClick={scrollToRegistro}>
                {content.calculator.outputs.cta} <ArrowRight />
              </button>
              <p className="calc-foot">{content.calculator.footnote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SPEAKER CARD ──────────────────────────────────────────
function SpeakerCard({ s }: { s: Speaker }) {
  return (
    <div className={`speaker-card${s.featured ? " featured" : ""}`}>
      {s.role && <span className="speaker-role-tag">{s.role}</span>}
      <div className="speaker-avatar" style={{ background: s.bg ?? "linear-gradient(135deg,#1a1a1a,#333)" }}>
        {s.initial ?? s.name.slice(0,1)}
      </div>
      <div className="speaker-name">{s.name}</div>
      <div className="speaker-title">{s.title}</div>
      {s.ig && (
        <a
          className="speaker-ig"
          href={`https://instagram.com/${s.ig}`}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`speaker_ig_${s.ig}`}
          aria-label={`Instagram de ${s.name}`}
        >
          <IgIcon /> @{s.ig}
        </a>
      )}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────
export default function Page() {
  useReveal();
  useTracker();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current!;
    const params = new URLSearchParams(window.location.search);

    const payload = {
      nombre:       (form.elements.namedItem("name")     as HTMLInputElement).value,
      email:        (form.elements.namedItem("email")    as HTMLInputElement).value,
      telefono:     (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
      pais:         (form.elements.namedItem("country")  as HTMLSelectElement).value,
      utm_source:   params.get("utm_source")   ?? "",
      utm_medium:   params.get("utm_medium")   ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content:  params.get("utm_content")  ?? "",
      utm_term:     params.get("utm_term")     ?? "",
    };

    try {
      await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // silent
    }

    try {
      getTracker()?.conversion({ email: payload.email, country: payload.pais });
    } catch { /* noop */ }

    setSubmitted(true);
    setLoading(false);
  }

  const speakers = useMemo(() => content.speakers.list, []);

  return (
    <>
      {/* ─── TOP BAR ─────────────────────────────────────── */}
      <div className="topbar">
        <div className="container">
          <div className="topbar-inner">
            <p className="topbar-text">
              <strong>{content.topbar.date}</strong> · {content.topbar.online} ·{" "}
              <span className="accent">{content.topbar.free}</span>
            </p>
            <a href="#registro" className="btn-topbar" data-track="topbar_cta">{content.topbar.cta}</a>
          </div>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="hero" data-section="hero">
        <HeroBg />
        <div className="container" style={{ width: "100%" }}>
          <div className="hero-content">
            <div className="hero-logo-wrap">
              <img src="/nuevoboot.png" alt="Bootcamp de Aceleración de Emprendimiento Synergy Education 2026" className="hero-logo" />
            </div>
            <h1>{content.hero.h1_part1}<br /><em>{content.hero.h1_em}</em></h1>
            <p className="hero-sub">{content.hero.subhead}</p>
            <div className="hero-price">
              <span className="hero-price-strike">{content.hero.price_strike}</span>
              <span className="hero-price-now">{content.hero.price_now}</span>
            </div>
            <div className="hero-date">
              <span className="hero-date-nums">{content.hero.date_nums}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-month">{content.hero.date_month}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-tag">{content.hero.date_tag}</span>
            </div>
            <div className="hero-cta-group">
              <a href="#registro" className="btn-primary" data-track="hero_cta">
                {content.hero.cta} <ArrowRight />
              </a>
            </div>
          </div>

          <div className="hero-stats">
            {content.stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className={`stat-number${i === 2 ? " text-red" : ""}`}>{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─────────────────────────────────────── */}
      <section className="problem section" data-section="problem">
        <div className="container">
          <div className="problem-grid">
            <div>
              <span className="section-label reveal">{content.problem.label}</span>
              <h2 className="section-title reveal reveal-delay-1">
                {content.problem.title_1} <span className="text-red">{content.problem.title_em}</span>
              </h2>
              <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 0 }}>
                {content.problem.body}
              </p>
              <ul className="problem-bullets">
                {content.problem.bullets.map((text, i) => (
                  <li key={i} className={`reveal reveal-delay-${i + 1}`}>
                    <span className="bullet-icon"><CheckCircle /></span>{text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="problem-quote">{content.problem.quote}</div>
              <div className="problem-callout">
                <p className="problem-callout-title">{content.problem.callout_title}</p>
                <p className="problem-callout-text">{content.problem.callout_body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS A BOOTCAMP ─────────────────────────── */}
      <WhatIsBootcamp />

      {/* ─── 3 PILLARS ANIMATION ────────────────────────── */}
      <PillarsSection />

      {/* ─── CALCULATOR ──────────────────────────────────── */}
      <RoiCalculator />

      {/* ─── DETAILS ─────────────────────────────────────── */}
      <section className="details section" data-section="details">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <span className="section-label reveal">{content.details.label}</span>
            <h2 className="section-title reveal reveal-delay-1">{content.details.title}</h2>
          </div>
          <div className="details-grid">
            {content.details.items.map((item, i) => (
              <div key={i} className={`detail-item reveal reveal-delay-${i + 1}`}>
                <div className="detail-icon">{detailIcons[i]}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRIZES ──────────────────────────────────────── */}
      <section className="prizes section" data-section="prizes">
        <div className="container">
          <div className="prizes-header">
            <span className="section-label reveal">{content.prizes.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.prizes.title_1} <span className="text-gold">{content.prizes.title_em}</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 auto" }}>
              {content.prizes.subtitle}
            </p>
          </div>
          <div className="prizes-grid">
            {content.prizes.items.map((p, i) => (
              <div key={i} className={`prize-card reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="prize-icon" aria-hidden="true">{p.icon}</div>
                <div className="prize-title">{p.title}</div>
                <div className="prize-body">{p.body}</div>
              </div>
            ))}
          </div>
          <p className="prizes-foot reveal">{content.prizes.footnote}</p>
        </div>
      </section>

      {/* ─── SPEAKERS ────────────────────────────────────── */}
      <section className="speakers section" data-section="speakers">
        <div className="container">
          <div className="speakers-header">
            <span className="section-label reveal">{content.speakers.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.speakers.title_1} <span className="text-red">{content.speakers.title_em}</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 560, margin: "0 auto" }}>
              {content.speakers.subtitle}
            </p>
          </div>
          <div className="speakers-grid">
            {speakers.map((s, i) => (
              <div key={s.name} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                <SpeakerCard s={s} />
              </div>
            ))}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`mystery-${i}`} className={`speaker-card reveal reveal-delay-${(i % 4) + 1}`} style={{ opacity: 0.5 }}>
                <div className="speaker-avatar" style={{ background: "linear-gradient(135deg,#1a1a1a,#333)", fontSize: 24 }}>?</div>
                <div className="speaker-name" style={{ color: "var(--gray-400)" }}>{content.speakers.mystery_name}</div>
                <div className="speaker-title">{content.speakers.mystery_title}</div>
              </div>
            ))}
          </div>
          <p className="speakers-note reveal">{content.speakers.note}</p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section className="testimonials section" data-section="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <span className="section-label reveal">{content.testimonials.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.testimonials.title_1} <span className="text-red">{content.testimonials.title_em}</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 500, margin: "0 auto" }}>
              {content.testimonials.subtitle}
            </p>
          </div>
          <div className="testimonials-grid">
            {content.testimonials.items.map((t, i) => (
              <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
                <div className="testimonial-mark">&ldquo;</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-result">{t.result}</div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
          <div className="featured-quote-block reveal">
            <div className="featured-quote-text">&ldquo;{content.testimonials.featured_quote}&rdquo;</div>
            <div className="featured-quote-author">
              — <span>{content.testimonials.featured_author}</span>, {content.testimonials.featured_role}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CREDENTIALS ─────────────────────────────────── */}
      <section className="credentials section" data-section="credentials">
        <div className="credentials-inner container">
          <div className="credentials-layout">
            <div className="credentials-text reveal">
              <div className="host-badge">{content.credentials.host_badge}</div>
              <h2>{content.credentials.name_1} <span className="text-red">{content.credentials.name_em}</span></h2>
              <p>{content.credentials.bio}</p>
            </div>
            <div className="credentials-stats">
              {content.credentials.stats.map((s, i) => (
                <div key={i} className={`cred-stat reveal reveal-delay-${i + 1}`}>
                  <div className="cred-stat-number">{s.number}</div>
                  <div className="cred-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BONUS ───────────────────────────────────────── */}
      <section className="bonus section-sm" data-section="bonus">
        <div className="container">
          <div className="bonus-card reveal">
            <div className="bonus-card-inner">
              <div className="bonus-icon">🎙️</div>
              <div className="bonus-tag">{content.bonus.tag}</div>
              <h2>{content.bonus.title_1} <span className="text-gold">{content.bonus.title_em}</span></h2>
              <p>
                {content.bonus.body_intro}{" "}
                <strong style={{ color: "var(--white)" }}>{content.bonus.body_product}</strong>{" "}
                {content.bonus.body_mid}{" "}
                <span className="bonus-highlight">{content.bonus.body_rank}</span> — con más de{" "}
                <span className="bonus-highlight">{content.bonus.body_reach}</span> {content.bonus.body_end}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION ────────────────────────────────── */}
      <section className="registration section" id="registro" data-section="registration">
        <div className="registration-inner container">
          <span className="section-label reveal">{content.registration.label}</span>
          <h2 className="reveal reveal-delay-1">
            {content.registration.title_1} <span className="text-red">{content.registration.title_em}</span>
          </h2>
          <p className="registration-sub reveal reveal-delay-2">
            {content.registration.subtitle.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>

          <div className="form-card reveal reveal-delay-2">
            {submitted ? (
              <div className="form-success-state">
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="success-title">{content.registration.success.title}</h3>
                <p className="success-sub">
                  {content.registration.success.message.split("\n").map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">{content.registration.form.name_label}</label>
                  <input className="form-input" type="text" id="name" name="name" placeholder={content.registration.form.name_placeholder} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">{content.registration.form.email_label}</label>
                  <input className="form-input" type="email" id="email" name="email" placeholder={content.registration.form.email_placeholder} required />
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="whatsapp">{content.registration.form.whatsapp_label}</label>
                    <input className="form-input" type="tel" id="whatsapp" name="whatsapp" placeholder={content.registration.form.whatsapp_placeholder} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="country">{content.registration.form.country_label}</label>
                    <select className="form-input" id="country" name="country" required style={{ appearance: "none", cursor: "pointer" }}>
                      <option value="" disabled>{content.registration.form.country_placeholder}</option>
                      {countries.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-submit" disabled={loading} data-track="registration_submit">
                  {loading ? content.registration.form.cta_loading : (
                    <>{content.registration.form.cta} <ArrowRight /></>
                  )}
                </button>
                <p className="form-disclaimer">
                  <Lock />
                  {content.registration.form.disclaimer}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="footer" data-section="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">{content.footer.logo_1}<span>{content.footer.logo_em}</span></div>
              <p className="footer-copy">{content.footer.copy}</p>
              <a href={`https://${content.footer.url}`} className="footer-url">{content.footer.url}</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                {content.footer.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} data-track={`footer_link_${l.href}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Contacto</div>
              <p className="footer-contact">{content.footer.contact.company}</p>
              <a href={`mailto:${content.footer.contact.email}`} className="footer-contact-link">{content.footer.contact.email}</a>
            </div>
          </div>

          <div className="footer-disclaimers">
            {content.footer.disclaimers.map((d, i) => (
              <p key={i} className="footer-disclaimer-text">{d}</p>
            ))}
          </div>
        </div>
      </footer>

      {/* ─── SOCIAL PROOF POPUP ──────────────────────────── */}
      <SocialProofPopup />
    </>
  );
}
