import Link from "next/link";
import { fetchAreas, fetchMembers, fetchTasks } from "@/lib/ops/queries";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_COLORS } from "@/lib/ops/theme";
import type { OpsMember, OpsTaskWithRelations } from "@/lib/ops/types";
import PageHeader from "../PageHeader";

export const dynamic = "force-dynamic";

function MemberCard({ m, tasks }: { m: OpsMember; tasks: OpsTaskWithRelations[] }) {
  const abiertas = tasks.filter((t) => t.estado !== "hecho");
  const enProgreso = tasks.filter((t) => t.estado === "en_progreso").length;
  const bloqueadas = tasks.filter((t) => t.estado === "bloqueado").length;
  const criticas = tasks.filter((t) => t.prioridad === 1 && t.estado !== "hecho").length;
  const pct = tasks.length > 0 ? Math.round((tasks.filter((t) => t.estado === "hecho").length / tasks.length) * 100) : 0;

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
          padding: "24px",
          borderRadius: "17px",
          background: OPS.bgElevated,
          border: `1px solid ${OPS.border}`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${OPS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: OPS_FONT_HEAD,
              fontSize: "18px",
              fontWeight: 800,
              color: OPS.text,
              letterSpacing: "-0.03em",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
            }}
          >
            {m.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "1.05rem",
                fontWeight: 800,
                letterSpacing: "-0.015em",
              }}
            >
              {m.nombre}
            </div>
            <div style={{ color: OPS.textMuted, fontSize: "12px", marginTop: "2px" }}>{m.rol}</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <Stat label="Abiertas" value={abiertas.length} color={OPS.text} />
          <Stat label="En curso" value={enProgreso} color={OPS.accent} />
          <Stat label="Bloqueo" value={bloqueadas} color={bloqueadas > 0 ? OPS.p1 : OPS.textDim} />
          <Stat label="Críticas" value={criticas} color={criticas > 0 ? OPS.p1 : OPS.textDim} />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: OPS.textDim,
              marginBottom: "6px",
            }}
          >
            <span>Progreso</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: OPS.accent,
                borderRadius: "2px",
                transition: `width 500ms ${EASE}`,
              }}
            />
          </div>
        </div>

        {abiertas.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {abiertas.slice(0, 3).map((t) => (
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
                  fontSize: "12.5px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "999px",
                    background: ESTADO_COLORS[t.estado] ?? OPS.accent,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.titulo}
                </span>
              </Link>
            ))}
            {abiertas.length > 3 && (
              <div style={{ color: OPS.textDim, fontSize: "11px", paddingLeft: "10px" }}>
                + {abiertas.length - 3} más
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              color: OPS.textDim,
              fontSize: "12.5px",
              padding: "10px 0 0",
            }}
          >
            Sin tareas abiertas.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        padding: "10px 8px",
        borderRadius: "12px",
        background: OPS.bgInset,
        border: `1px solid ${OPS.border}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: OPS_FONT_HEAD,
          fontSize: "1.35rem",
          fontWeight: 800,
          color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: OPS_FONT_HEAD,
          fontSize: "8.5px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: OPS.textDim,
          marginTop: "5px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default async function EquipoPage() {
  const [members, tasks, areas] = await Promise.all([
    fetchMembers(),
    fetchTasks(),
    fetchAreas(),
  ]);

  // Agrupa tasks por miembro
  const tasksByMember = new Map<number, OpsTaskWithRelations[]>();
  for (const t of tasks) {
    for (const a of t.assignees) {
      const arr = tasksByMember.get(a.id) ?? [];
      arr.push(t);
      tasksByMember.set(a.id, arr);
    }
  }

  const totalOpen = tasks.filter((t) => t.estado !== "hecho").length;

  return (
    <>
      <PageHeader
        eyebrow="Equipo · Carga"
        title="Carga por persona"
        subtitle={`${members.length} personas en el equipo · ${totalOpen} tareas abiertas en total.`}
      />
      <section style={{ padding: "32px 40px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {members.map((m) => (
            <MemberCard key={m.id} m={m} tasks={tasksByMember.get(m.id) ?? []} />
          ))}
        </div>
        <div style={{ marginTop: "40px", color: OPS.textDim, fontSize: "12px" }}>
          {areas.length} áreas · {tasks.length} tareas totales
        </div>
      </section>
    </>
  );
}
