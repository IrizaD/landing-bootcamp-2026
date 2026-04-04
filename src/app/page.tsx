"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "./content";
import { HeroBg } from "./HeroBg";

// ─── DATA ──────────────────────────────────────────────────
const speakers = [
  { name: "Jorge Serratos", initial: "J", role: "Host",    title: "Fundador Sinergéticos · Autor Best Seller · Podcast #1 Negocios México", bg: "linear-gradient(135deg,#eb2b1a,#8a1009)", featured: true  },
  { name: "Manuel de León", initial: "M", role: "Co-host", title: "COO Sinergéticos · Experto en IA, tráfico y contenido digital",           bg: "linear-gradient(135deg,#188bf6,#0a5fa8)", featured: true  },
  { name: "Paola Padilla",  initial: "P", role: null,      title: "Directora del equipo Sinergético · Gestión emocional y logística",         bg: "linear-gradient(135deg,#9333ea,#4c1d95)", featured: false },
];

const countries = [
  "México","Colombia","Argentina","Chile","Perú","Venezuela","Ecuador",
  "Guatemala","Bolivia","República Dominicana","Honduras","El Salvador",
  "Costa Rica","Panamá","Uruguay","Paraguay","Nicaragua","Estados Unidos",
  "España","Otro",
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

// ─── DETAIL ICONS ───────────────────────────────────────────
const detailIcons = [
  <svg key="cal" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  <svg key="ppl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="aw"  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  <svg key="vid" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
];

// ─── VISIT TRACKING ────────────────────────────────────────
function useTrackVisit() {
  useEffect(() => {
    // Genera o recupera session_id para esta visita
    let sid = sessionStorage.getItem("_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("_sid", sid);
    }
    const params = new URLSearchParams(window.location.search);
    fetch("/api/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id:   sid,
        tipo:         "page_view",
        utm_source:   params.get("utm_source")   ?? "",
        utm_medium:   params.get("utm_medium")   ?? "",
        utm_campaign: params.get("utm_campaign") ?? "",
      }),
    }).catch(() => {});
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

// ─── PAGE ──────────────────────────────────────────────────
export default function Page() {
  useReveal();
  useTrackVisit();
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
    } catch (_) {
      // Si falla la API, igual mostramos el éxito al usuario
    }

    setSubmitted(true);
    setLoading(false);
  }

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
            <a href="#registro" className="btn-topbar">{content.topbar.cta}</a>
          </div>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="hero">
        <HeroBg />
        <div className="container" style={{ width: "100%" }}>
          <div className="hero-content">
            <div className="hero-logo-wrap">
              <img src="/logo-bootcamp.webp" alt="Bootcamp de Aceleración de Emprendimiento" className="hero-logo" />
            </div>
            <h1>
              {content.hero.h1_part1}<br /><em>{content.hero.h1_em}</em>
            </h1>
            <p className="hero-sub">{content.hero.subhead}</p>
            <div className="hero-date">
              <span className="hero-date-nums">{content.hero.date_nums}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-month">{content.hero.date_month}</span>
              <span className="hero-date-sep" />
              <span className="hero-date-tag">{content.hero.date_tag}</span>
            </div>
            <div className="hero-cta-group">
              <a href="#registro" className="btn-primary">
                {content.hero.cta} <ArrowRight />
              </a>
            </div>
          </div>

          {/* Floating stats */}
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
      <section className="problem section">
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
                    <span className="bullet-icon"><CheckCircle /></span>
                    {text}
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

      {/* ─── PROMISES ────────────────────────────────────── */}
      <section className="promises section">
        <div className="container">
          <div className="promises-header">
            <span className="section-label reveal">{content.promises.label}</span>
            <h2 className="section-title reveal reveal-delay-1">
              {content.promises.title_1} <span className="text-red">{content.promises.title_em}</span>
            </h2>
          </div>
          <div className="promises-grid">
            {content.promises.items.map((p, i) => (
              <div key={i} className={`promise-card reveal reveal-delay-${i + 1}`}>
                <div className="promise-number">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETAILS ─────────────────────────────────────── */}
      <section className="details section">
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

      {/* ─── SPEAKERS ────────────────────────────────────── */}
      <section className="speakers section">
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
              <div key={i} className={`speaker-card${s.featured ? " featured" : ""} reveal reveal-delay-${(i % 4) + 1}`}>
                {s.role && <span className="speaker-role-tag">{s.role}</span>}
                <div className="speaker-avatar" style={{ background: s.bg }}>{s.initial}</div>
                <div className="speaker-name">{s.name}</div>
                <div className="speaker-title">{s.title}</div>
              </div>
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
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
      <section className="testimonials section">
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
            <div className="featured-quote-text">
              &ldquo;{content.testimonials.featured_quote}&rdquo;
            </div>
            <div className="featured-quote-author">
              — <span>{content.testimonials.featured_author}</span>, {content.testimonials.featured_role}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CREDENTIALS ─────────────────────────────────── */}
      <section className="credentials section">
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
      <section className="bonus section-sm">
        <div className="container">
          <div className="bonus-card reveal">
            <div className="bonus-card-inner">
              <div className="bonus-icon">🎙️</div>
              <div className="bonus-tag">{content.bonus.tag}</div>
              <h2>
                {content.bonus.title_1} <span className="text-gold">{content.bonus.title_em}</span>
              </h2>
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
      <section className="registration section" id="registro">
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
                <button type="submit" className="btn-submit" disabled={loading}>
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
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">{content.footer.logo_1}<span>{content.footer.logo_em}</span></div>
            <div className="footer-divider" />
            <p className="footer-copy">{content.footer.copy}</p>
            <a href={`https://${content.footer.url}`} className="footer-url">{content.footer.url}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
