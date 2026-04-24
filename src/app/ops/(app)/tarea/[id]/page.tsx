import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAreas, fetchMembers, fetchMilestones, fetchTaskById, fetchTaskComments } from "@/lib/ops/queries";
import {
  OPS,
  OPS_FONT_HEAD,
  OPS_FONT_BODY,
  EASE,
  ESTADO_COLORS,
  ESTADO_LABELS,
  PRIORIDAD_COLORS,
  PRIORIDAD_LABELS,
} from "@/lib/ops/theme";
import PageHeader from "../../PageHeader";
import TaskEditor from "./TaskEditor";
import CommentsPanel from "./CommentsPanel";

export const dynamic = "force-dynamic";

function fmt(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [task, areas, members, milestones, comments] = await Promise.all([
    fetchTaskById(id),
    fetchAreas(),
    fetchMembers(),
    fetchMilestones(),
    fetchTaskComments(id),
  ]);

  if (!task) notFound();

  const estadoColor = ESTADO_COLORS[task.estado] ?? OPS.accent;
  const priColor = PRIORIDAD_COLORS[task.prioridad];

  return (
    <>
      <PageHeader
        eyebrow={`Tarea #${task.id}`}
        title={task.titulo}
        subtitle={task.descripcion ?? undefined}
        right={
          <Link
            href="/ops/tablero"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "transparent",
              border: `1px solid ${OPS.border}`,
              color: OPS.textMuted,
              fontFamily: OPS_FONT_HEAD,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← Volver al tablero
          </Link>
        }
      />

      <section
        style={{
          padding: "28px 40px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "22px",
        }}
        className="ops-task-grid"
      >
        {/* Editor principal */}
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
              padding: "28px",
              borderRadius: "17px",
              background: OPS.bgElevated,
              border: `1px solid ${OPS.border}`,
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
            }}
          >
            <TaskEditor
              task={task}
              areas={areas}
              members={members}
              milestones={milestones}
            />
          </div>
        </div>

        {/* Sidebar meta */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <MetaCard label="Estado" color={estadoColor}>
            {ESTADO_LABELS[task.estado]}
          </MetaCard>
          <MetaCard label="Prioridad" color={priColor}>
            {PRIORIDAD_LABELS[task.prioridad]}
          </MetaCard>
          <MetaCard
            label="Área"
            color={task.area?.color ?? OPS.textMuted}
          >
            {task.area?.nombre ?? "—"}
          </MetaCard>
          <MetaCard label="Fecha límite">{fmt(task.fecha_limite)}</MetaCard>
          <MetaCard label="Milestone">
            {task.milestone?.nombre ?? "—"}
          </MetaCard>
          <MetaCard label="Asignados">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {task.assignees.length === 0 && (
                <span style={{ color: OPS.textMuted, fontSize: "13px" }}>Sin asignar</span>
              )}
              {task.assignees.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: OPS_FONT_BODY,
                    fontSize: "13.5px",
                    color: OPS.text,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${OPS.border}`,
                      fontSize: 10,
                      fontFamily: OPS_FONT_HEAD,
                      fontWeight: 800,
                      color: OPS.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.nombre}</div>
                    <div style={{ color: OPS.textDim, fontSize: "11px" }}>{m.rol}</div>
                  </div>
                </div>
              ))}
            </div>
          </MetaCard>
        </aside>

        {/* Comments */}
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "5px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.025)",
            border: `1px solid ${OPS.border}`,
          }}
        >
          <div
            style={{
              padding: "24px 28px",
              borderRadius: "17px",
              background: OPS.bgElevated,
              border: `1px solid ${OPS.border}`,
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
            }}
          >
            <CommentsPanel taskId={task.id} initial={comments} members={members} />
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .ops-task-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}

function MetaCard({
  label,
  color,
  children,
}: {
  label: string;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${OPS.border}`,
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderRadius: "13px",
          background: OPS.bgElevated,
          border: `1px solid ${OPS.border}`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "9.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: OPS.textDim,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {color && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: color,
              }}
            />
          )}
          {label}
        </div>
        <div
          style={{
            color: OPS.text,
            fontFamily: OPS_FONT_BODY,
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
