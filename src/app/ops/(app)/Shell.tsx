"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import {
  GaugeIcon,
  KanbanIcon,
  CalendarIcon,
  UsersThreeIcon,
  ChartLineIcon,
  SignOutIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, MESH_BG, EASE } from "@/lib/ops/theme";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  description: string;
}

const NAV: NavItem[] = [
  { href: "/ops",           label: "Overview",  icon: <GaugeIcon      weight="light" size={18} />, description: "Radar general" },
  { href: "/ops/tablero",   label: "Tablero",   icon: <KanbanIcon     weight="light" size={18} />, description: "Kanban por área" },
  { href: "/ops/timeline",  label: "Timeline",  icon: <CalendarIcon   weight="light" size={18} />, description: "Milestones al evento" },
  { href: "/ops/equipo",    label: "Equipo",    icon: <UsersThreeIcon weight="light" size={18} />, description: "Carga por persona" },
  { href: "/ops/kpis",      label: "KPIs",      icon: <ChartLineIcon  weight="light" size={18} />, description: "Registros y boletos" },
];

function daysUntilEvent(): { days: number; label: string } {
  const target = new Date("2026-06-05T09:30:00-06:00").getTime();
  const now    = Date.now();
  const diff   = target - now;
  if (diff <= 0) return { days: 0, label: "Hoy" };
  const days   = Math.ceil(diff / 86_400_000);
  return { days, label: days === 1 ? "1 día" : `${days} días` };
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cd = daysUntilEvent();

  async function logout() {
    await fetch("/api/ops/auth", { method: "DELETE" });
    router.push("/ops/login");
    router.refresh();
  }

  const shellBg: CSSProperties = {
    minHeight: "100dvh",
    background: OPS.bg,
    backgroundImage: MESH_BG,
    color: OPS.text,
    fontFamily: OPS_FONT_BODY,
    display: "grid",
    gridTemplateColumns: "260px 1fr",
  };

  return (
    <div style={shellBg} className="ops-shell">
      {/* Noise layer */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "overlay",
          zIndex: 1,
        }}
      />

      {/* Mobile topbar */}
      <div
        className="ops-mobile-topbar"
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid ${OPS.border}`,
          background: "rgba(5,6,8,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 8,
        }}
      >
        <Link
          href="/ops"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: OPS.text,
          }}
        >
          <span
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "10px",
              background: OPS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontFamily: OPS_FONT_HEAD,
              fontWeight: 900,
              fontSize: "12px",
              letterSpacing: "-0.04em",
              boxShadow: `0 0 16px ${OPS.accentGlow}`,
            }}
          >
            SY
          </span>
          <span
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Synergy Ops
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${OPS.border}`,
            color: OPS.text,
            cursor: "pointer",
          }}
          aria-label="Abrir menú"
        >
          <ListIcon size={18} weight="bold" />
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 9,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          borderRight: `1px solid ${OPS.border}`,
          background: "rgba(5,6,8,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          zIndex: 10,
        }}
        className={`ops-sidebar${mobileOpen ? " ops-sidebar--open" : ""}`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ops-sidebar-close"
          style={{
            display: "none",
            position: "absolute",
            top: "16px",
            right: "16px",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${OPS.border}`,
            color: OPS.textMuted,
            cursor: "pointer",
          }}
          aria-label="Cerrar menú"
        >
          <XIcon size={16} weight="bold" />
        </button>
        {/* Brand */}
        <Link
          href="/ops"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: OPS.text,
          }}
        >
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: OPS.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontFamily: OPS_FONT_HEAD,
              fontWeight: 900,
              fontSize: "14px",
              letterSpacing: "-0.04em",
              boxShadow: `0 0 24px ${OPS.accentGlow}, inset 0 1px 2px rgba(255,255,255,0.45)`,
            }}
          >
            SY
          </span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              Synergy Ops
            </span>
            <span
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "10px",
                color: OPS.textDim,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginTop: "3px",
              }}
            >
              Bootcamp · Unlimited
            </span>
          </span>
        </Link>

        {/* Countdown */}
        <div
          style={{
            padding: "4px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${OPS.border}`,
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "16px",
              background: OPS.bgInset,
              border: `1px solid ${OPS.border}`,
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: OPS.textDim,
                marginBottom: "8px",
              }}
            >
              Faltan
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: OPS.accent,
                  letterSpacing: "-0.04em",
                  textShadow: `0 0 24px ${OPS.accentGlow}`,
                }}
              >
                {cd.days}
              </span>
              <span
                style={{
                  color: OPS.textMuted,
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {cd.days === 1 ? "día" : "días"}
              </span>
            </div>
            <div style={{ color: OPS.textDim, fontSize: "12px", marginTop: "4px" }}>
              Bootcamp · 5-7 junio 2026
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: OPS.textDim,
              padding: "0 10px",
              marginBottom: "6px",
            }}
          >
            Vistas
          </div>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 12px",
                  borderRadius: "12px",
                  background: active ? OPS.accentSoft : "transparent",
                  border: `1px solid ${active ? OPS.borderHi : "transparent"}`,
                  color: active ? OPS.accent : OPS.textMuted,
                  textDecoration: "none",
                  fontFamily: OPS_FONT_BODY,
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: `background 220ms ${EASE}, color 220ms ${EASE}, border-color 220ms ${EASE}`,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = OPS.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = OPS.textMuted;
                  }
                }}
              >
                <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Footer / Logout */}
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 12px",
            borderRadius: "12px",
            background: "transparent",
            border: `1px solid ${OPS.border}`,
            color: OPS.textMuted,
            cursor: "pointer",
            fontFamily: OPS_FONT_HEAD,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            transition: `color 220ms ${EASE}, border-color 220ms ${EASE}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = OPS.p1;
            e.currentTarget.style.borderColor = "rgba(255,77,109,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = OPS.textMuted;
            e.currentTarget.style.borderColor = OPS.border;
          }}
        >
          <SignOutIcon weight="light" size={16} />
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main style={{ minWidth: 0, padding: "0", position: "relative", zIndex: 2 }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 900px) {
          .ops-shell {
            grid-template-columns: 1fr !important;
          }
          .ops-mobile-topbar {
            display: flex !important;
          }
          .ops-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 280px !important;
            height: 100dvh !important;
            padding: 24px 20px !important;
            transform: translateX(-100%) !important;
            transition: transform 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            z-index: 20 !important;
          }
          .ops-sidebar--open {
            transform: translateX(0) !important;
          }
          .ops-sidebar-close {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
