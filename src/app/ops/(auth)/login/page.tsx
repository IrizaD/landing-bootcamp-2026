"use client";
import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { OPS, OPS_FONT_BODY, OPS_FONT_HEAD, MESH_BG, EASE } from "@/lib/ops/theme";

export default function OpsLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/ops/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/ops");
      router.refresh();
    } else {
      setError("Contraseña incorrecta");
    }
  }

  const shellStyle: CSSProperties = {
    minHeight: "100dvh",
    background: OPS.bg,
    backgroundImage: MESH_BG,
    color: OPS.text,
    fontFamily: OPS_FONT_BODY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
  };

  return (
    <div style={shellStyle}>
      {/* Noise overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "overlay",
        }}
      />
      {/* Double-bezel card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "6px",
          borderRadius: "32px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${OPS.border}`,
          boxShadow: `0 40px 120px -30px ${OPS.accentGlow}`,
        }}
      >
        <div
          style={{
            background: OPS.bgElevated,
            borderRadius: "26px",
            padding: "48px 40px",
            border: `1px solid ${OPS.border}`,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "999px",
              background: OPS.accentSoft,
              border: `1px solid ${OPS.borderHi}`,
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: OPS.accent,
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: OPS.accent,
                boxShadow: `0 0 10px ${OPS.accent}`,
              }}
            />
            Synergy Ops
          </div>
          <h1
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontWeight: 800,
              fontSize: "2rem",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "10px",
            }}
          >
            Tablero de operaciones
          </h1>
          <p
            style={{
              color: OPS.textMuted,
              fontSize: "14px",
              lineHeight: 1.55,
              marginBottom: "30px",
            }}
          >
            Control center del Bootcamp de Aceleración de Emprendimientos y Synergy Unlimited 2026.
          </p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "block" }}>
              <span
                style={{
                  display: "block",
                  color: OPS.textDim,
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Contraseña
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: "14px",
                  background: OPS.bgInset,
                  border: `1px solid ${focused ? OPS.borderHi : OPS.border}`,
                  color: OPS.text,
                  fontSize: "16px",
                  fontFamily: OPS_FONT_BODY,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: `border-color 280ms ${EASE}, box-shadow 280ms ${EASE}`,
                  boxShadow: focused ? `0 0 0 4px ${OPS.accentSoft}` : "none",
                }}
              />
            </label>
            {error && (
              <p style={{ color: OPS.p1, fontSize: "13px", fontWeight: 500 }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "6px",
                padding: "6px",
                borderRadius: "999px",
                background: "rgba(0,224,64,0.15)",
                border: `1px solid ${OPS.borderHi}`,
                cursor: loading ? "wait" : "pointer",
                transition: `transform 200ms ${EASE}`,
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.transform = "scale(0.985)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  borderRadius: "999px",
                  background: loading ? OPS.accentDim : OPS.accent,
                  color: "#000",
                  fontFamily: OPS_FONT_HEAD,
                  fontWeight: 800,
                  fontSize: "14px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {loading ? "Verificando…" : "Entrar al tablero"}
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    background: "rgba(0,0,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  →
                </span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
