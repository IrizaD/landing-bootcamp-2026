import Link from "next/link";
import { fetchMilestones, fetchTasks } from "@/lib/ops/queries";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_COLORS, ESTADO_LABELS } from "@/lib/ops/theme";
import type { OpsMilestone, OpsTaskWithRelations } from "@/lib/ops/types";
import PageHeader from "../PageHeader";

export const dynamic = "force-dynamic";

const TIPO_COLOR: Record<string, string> = {
  calentamiento: "#60a5fa",
  pre_evento:    "#fbbf24",
  evento:        "#00e040",
  pitch:         "#ff4d6d",
};

const TIPO_LABEL: Record<string, string> = {
  calentamiento: "Calentamiento",
  pre_evento:    "Pre-evento",
  evento:        "Evento",
  pitch:         "Pitch",
};

function fmtFull(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function MilestoneCard({
  m,
  tasks,
  isPast,
  isNext,
}: {
  m: OpsMilestone;
  tasks: OpsTaskWithRelations[];
  isPast: boolean;
  isNext: boolean;
}) {
  const color = TIPO_COLOR[m.tipo] ?? OPS.accent;
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "120px 36px 1fr",
        gap: "18px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          textAlign: "right",
          paddingTop: "8px",
          color: isPast ? OPS.textDim : OPS.text,
        }}
      >
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textTransform: "capitalize",
          }}
        >
          {fmtFull(m.fecha).replace(".", "")}
        </div>
        <div style={{ color: OPS.textDim, fontSize: "11px", marginTop: "3px" }}>
          {fmtTime(m.fecha)}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12px" }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "999px",
            background: isPast ? OPS.bgElevated : color,
            border: `2px solid ${isPast ? OPS.border : color}`,
            boxShadow: isNext ? `0 0 18px ${color}` : "none",
            flexShrink: 0,
          }}
        />
      </div>
      <div
        style={{
          padding: "5px",
          borderRadius: "18px",
          background: isNext ? `rgba(0,224,64,0.06)` : "rgba(255,255,255,0.025)",
          border: `1px solid ${isNext ? OPS.borderHi : OPS.border}`,
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderRadius: "13px",
            background: OPS.bgElevated,
            border: `1px solid ${OPS.border}`,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${OPS.border}`,
                color,
                fontFamily: OPS_FONT_HEAD,
                fontSize: "9.5px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {TIPO_LABEL[m.tipo]}
            </span>
            {isNext && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: OPS.accentSoft,
                  border: `1px solid ${OPS.borderHi}`,
                  color: OPS.accent,
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "9.5px",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Siguiente
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "1.15rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: isPast ? OPS.textMuted : OPS.text,
              marginBottom: "4px",
            }}
          >
            {m.nombre}
          </div>
          {m.descripcion && (
            <div style={{ color: OPS.textDim, fontSize: "13px", lineHeight: 1.5, marginBottom: "12px" }}>
              {m.descripcion}
            </div>
          )}
          {tasks.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
              <div
                style={{
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "9.5px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: OPS.textDim,
                }}
              >
                {tasks.length} tarea{tasks.length !== 1 ? "s" : ""} ligada{tasks.length !== 1 ? "s" : ""}
              </div>
              {tasks.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  href={`/ops/tarea/${t.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${OPS.border}`,
                    color: OPS.text,
                    textDecoration: "none",
                    fontSize: "13px",
                    transition: `background 220ms ${EASE}`,
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: ESTADO_COLORS[t.estado] ?? OPS.accent,
                    }}
                  />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.titulo}
                  </span>
                  <span style={{ color: OPS.textDim, fontSize: "11px" }}>
                    {ESTADO_LABELS[t.estado]}
                  </span>
                </Link>
              ))}
              {tasks.length > 4 && (
                <div style={{ color: OPS.textDim, fontSize: "11px", paddingLeft: "10px" }}>
                  + {tasks.length - 4} más
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function TimelinePage() {
  const [milestones, tasks] = await Promise.all([fetchMilestones(), fetchTasks()]);
  const now = Date.now();
  const nextIdx = milestones.findIndex((m) => new Date(m.fecha).getTime() > now);
  const nextSlug = milestones[nextIdx]?.slug;

  const tasksByMilestone = new Map<number, OpsTaskWithRelations[]>();
  for (const t of tasks) {
    if (t.milestone_id != null) {
      const arr = tasksByMilestone.get(t.milestone_id) ?? [];
      arr.push(t);
      tasksByMilestone.set(t.milestone_id, arr);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Timeline · Plan"
        title="Línea del tiempo"
        subtitle="Desde calentamiento de audiencia hasta el Day 3 de Synergy Unlimited."
      />
      <section style={{ padding: "32px 40px 80px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
          {/* Línea vertical */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "calc(120px + 18px + 8px)",
              top: "24px",
              bottom: "24px",
              width: "1px",
              background: `linear-gradient(180deg, ${OPS.border}, transparent)`,
              pointerEvents: "none",
            }}
          />
          {milestones.map((m) => {
            const isPast = new Date(m.fecha).getTime() < now;
            const isNext = m.slug === nextSlug;
            return (
              <MilestoneCard
                key={m.id}
                m={m}
                tasks={tasksByMilestone.get(m.id) ?? []}
                isPast={isPast}
                isNext={isNext}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
