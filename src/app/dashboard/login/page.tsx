"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Contraseña incorrecta");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"var(--font-body), system-ui, sans-serif",
      backgroundImage: "radial-gradient(circle at 20% 0%, rgba(0,224,64,0.08), transparent 45%), radial-gradient(circle at 85% 100%, rgba(212,168,67,0.06), transparent 45%)",
    }}>
      <div style={{
        background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"20px",
        padding:"44px 40px", width:"100%", maxWidth:"400px",
        boxShadow:"0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          fontFamily:"var(--font-head), sans-serif", fontSize:"11px", fontWeight:700,
          letterSpacing:"0.25em", textTransform:"uppercase", color:"#00e040", marginBottom:"12px",
        }}>
          Synergy · Bootcamp 2026
        </div>
        <h1 style={{
          fontFamily:"var(--font-head), sans-serif", color:"#fff", fontWeight:800,
          fontSize:"1.9rem", marginBottom:"10px", letterSpacing:"-0.02em",
        }}>
          Dashboard
        </h1>
        <p style={{ color:"#999", fontSize:"14px", marginBottom:"28px", lineHeight:1.5 }}>
          Introduce la contraseña para ver las métricas del funnel.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width:"100%", background:"#111", border:"1px solid #1a1a1a", color:"#fff",
              borderRadius:"12px", padding:"15px 16px", fontSize:"16px", boxSizing:"border-box",
              outline:"none", transition:"border-color 0.15s",
              fontFamily:"var(--font-body), sans-serif",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#00e040"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#1a1a1a"; }}
          />
          {error && (
            <p style={{ color:"#ef4444", fontSize:"13px", marginTop:"10px", fontWeight:500 }}>{error}</p>
          )}
          <button type="submit" disabled={loading}
            style={{
              marginTop:"18px", width:"100%",
              background: loading ? "#00b530" : "#00e040", color:"#000",
              border:"none", borderRadius:"12px", padding:"15px",
              fontSize:"15px", fontWeight:800, cursor: loading ? "wait" : "pointer",
              fontFamily:"var(--font-head), sans-serif",
              letterSpacing:"0.02em", textTransform:"uppercase",
              transition:"transform 0.12s, background 0.12s",
            }}
            onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
