import { fetchAreas, fetchTasks } from "@/lib/ops/queries";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_COLORS, ESTADO_LABELS, ESTADO_ORDER, PRIORIDAD_COLORS, PRIORIDAD_LABELS } from "@/lib/ops/theme";
import PageHeader from "../PageHeader";

export const dynamic = "force-dynamic";

// Placeholder KPIs que luego se leerán de ops_kpi_snapshots cuando conecten GHL.
const BUSINESS_KPIS = [
  { label: "Registros totales",     value: "—", hint: "conectar GHL México", accent: OPS.accent },
  { label: "Registros hoy",         value: "—", hint: "últimas 24h",         accent: OPS.p3 },
  { label: "Boletos Black vendidos",value: "—", hint: "Stripe MX + Kyari",   accent: "#fbbf24" },
  { label: "Ingresos (MXN)",        value: "—", hint: "actualiza cada 15m",  accent: OPS.accent },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </div>
        {subtitle && <div style={{ color: OPS.textMuted, fontSize: "13px", marginTop: "3px" }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function KpiBig({ label, value, hint, accent }: { label: string; value: string | number; hint?: string; accent: string }) {
  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "22px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${OPS.border}`,
      }}
    >
      <div
        style={{
          padding: "24px 26px",
          borderRadius: "17px",
          background: OPS.bgElevated,
          border: `1px solid ${OPS.border}`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "60%",
            height: "100%",
            background: `radial-gradient(ellipse at top left, ${accent}14, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "10.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: OPS.textDim,
            marginBottom: "16px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "3.2rem",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: OPS.text,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {hint && <div style={{ color: OPS.textMuted, fontSize: "12.5px", marginTop: "12px" }}>{hint}</div>}
      </div>
    </div>
  );
}

function Bar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "5px",
        }}
      >
        <span style={{ color: OPS.text, fontSize: "13px", fontWeight: 600 }}>{label}</span>
        <span style={{ color: OPS.textMuted, fontSize: "12px" }}>
          <span style={{ color, fontWeight: 700 }}>{count}</span>
          <span style={{ marginLeft: "8px", color: OPS.textDim }}>{pct}%</span>
        </span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: "3px",
            transition: `width 500ms ${EASE}`,
          }}
        />
      </div>
    </div>
  );
}

export default async function KpisPage() {
  const [tasks, areas] = await Promise.all([fetchTasks(), fetchAreas()]);

  const total = tasks.length;
  const byEstado = ESTADO_ORDER.map((e) => ({
    key: e,
    label: ESTADO_LABELS[e],
    count: tasks.filter((t) => t.estado === e).length,
    color: ESTADO_COLORS[e],
  }));
  const byPrioridad = [1, 2, 3, 4].map((p) => ({
    key: p,
    label: PRIORIDAD_LABELS[p],
    count: tasks.filter((t) => t.prioridad === p).length,
    color: PRIORIDAD_COLORS[p],
  }));
  const byArea = areas.map((a) => ({
    label: a.nombre,
    count: tasks.filter((t) => t.area_id === a.id).length,
    color: a.color,
  }));

  return (
    <>
      <PageHeader
        eyebrow="KPIs · Métricas"
        title="KPIs del lanzamiento"
        subtitle="Estado interno del tablero. Las métricas de negocio (registros, boletos) se llenarán al conectar GHL y Stripe."
      />
      <section style={{ padding: "32px 40px 80px" }}>
        <Section title="Métricas de negocio" subtitle="Live · pulling de GHL y Stripe. Pendiente de conectar.">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {BUSINESS_KPIS.map((k) => (
              <KpiBig key={k.label} label={k.label} value={k.value} hint={k.hint} accent={k.accent} />
            ))}
          </div>
        </Section>

        <Section title="Distribución del tablero" subtitle={`${total} tareas totales · actualizadas al vuelo`}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
            className="ops-dist-grid"
          >
            <div
              style={{
                padding: "5px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${OPS.border}`,
              }}
            >
              <div
                style={{
                  padding: "22px 26px",
                  borderRadius: "15px",
                  background: OPS.bgElevated,
                  border: `1px solid ${OPS.border}`,
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: OPS_FONT_HEAD,
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: OPS.textDim,
                    marginBottom: "18px",
                  }}
                >
                  Por estado
                </div>
                {byEstado.map((b) => (
                  <Bar key={b.key} label={b.label} count={b.count} total={total} color={b.color} />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "5px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${OPS.border}`,
              }}
            >
              <div
                style={{
                  padding: "22px 26px",
                  borderRadius: "15px",
                  background: OPS.bgElevated,
                  border: `1px solid ${OPS.border}`,
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: OPS_FONT_HEAD,
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: OPS.textDim,
                    marginBottom: "18px",
                  }}
                >
                  Por prioridad
                </div>
                {byPrioridad.map((b) => (
                  <Bar key={b.key} label={b.label} count={b.count} total={total} color={b.color} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Por área">
          <div
            style={{
              padding: "5px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${OPS.border}`,
            }}
          >
            <div
              style={{
                padding: "22px 26px",
                borderRadius: "15px",
                background: OPS.bgElevated,
                border: `1px solid ${OPS.border}`,
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
              }}
            >
              {byArea.map((b) => (
                <Bar key={b.label} label={b.label} count={b.count} total={total} color={b.color} />
              ))}
            </div>
          </div>
        </Section>

        <style>{`
          @media (max-width: 900px) {
            .ops-dist-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
