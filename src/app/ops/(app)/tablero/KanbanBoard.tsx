"use client";
import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  OPS,
  OPS_FONT_HEAD,
  OPS_FONT_BODY,
  EASE,
  ESTADO_LABELS,
  ESTADO_COLORS,
  ESTADO_ORDER,
  PRIORIDAD_COLORS,
  PRIORIDAD_LABELS,
} from "@/lib/ops/theme";
import type {
  OpsArea,
  OpsMember,
  OpsTaskWithRelations,
  OpsEstado,
} from "@/lib/ops/types";

interface Props {
  initialTasks: OpsTaskWithRelations[];
  areas: OpsArea[];
  members: OpsMember[];
}

function fmtDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function Avatar({ m, size = 22 }: { m: OpsMember; size?: number }) {
  return (
    <div
      title={m.nombre}
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        background: "rgba(255,255,255,0.08)",
        border: `1px solid ${OPS.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: OPS_FONT_HEAD,
        fontSize: size * 0.4,
        fontWeight: 800,
        color: OPS.text,
        letterSpacing: "-0.03em",
        flexShrink: 0,
      }}
    >
      {m.initials}
    </div>
  );
}

function TaskCard({
  task,
  isDragging,
}: {
  task: OpsTaskWithRelations;
  isDragging?: boolean;
}) {
  const due = fmtDate(task.fecha_limite);
  const areaColor = task.area?.color ?? OPS.accent;
  const priColor = PRIORIDAD_COLORS[task.prioridad];
  const overdue =
    task.fecha_limite &&
    new Date(task.fecha_limite).getTime() < Date.now() &&
    task.estado !== "hecho";

  return (
    <div
      style={{
        padding: "3px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${isDragging ? OPS.borderHi : OPS.border}`,
        cursor: "grab",
        boxShadow: isDragging ? `0 18px 40px -10px ${OPS.accentGlow}` : "none",
        transform: isDragging ? "rotate(-1.5deg)" : "none",
        transition: `border-color 220ms ${EASE}, box-shadow 220ms ${EASE}`,
      }}
    >
      <div
        style={{
          padding: "14px 14px 12px",
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
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${OPS.border}`,
              fontFamily: OPS_FONT_HEAD,
              fontSize: "9.5px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: OPS.textMuted,
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "999px",
                background: areaColor,
              }}
            />
            {task.area?.nombre?.split(" ")[0] ?? "—"}
          </span>
          <span style={{ flex: 1 }} />
          {task.prioridad <= 2 && (
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: priColor,
                boxShadow: `0 0 8px ${priColor}`,
              }}
              title={PRIORIDAD_LABELS[task.prioridad]}
            />
          )}
        </div>
        <div
          style={{
            fontFamily: OPS_FONT_BODY,
            fontWeight: 600,
            fontSize: "13.5px",
            lineHeight: 1.4,
            color: OPS.text,
            marginBottom: "12px",
          }}
        >
          {task.titulo}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", gap: "-4px", alignItems: "center" }}>
            {task.assignees.slice(0, 3).map((m, i) => (
              <div
                key={m.id}
                style={{ marginLeft: i === 0 ? 0 : "-6px", zIndex: 3 - i }}
              >
                <Avatar m={m} size={22} />
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div
                style={{
                  marginLeft: "-6px",
                  width: 22,
                  height: 22,
                  borderRadius: "999px",
                  background: OPS.bgInset,
                  border: `1px solid ${OPS.border}`,
                  fontSize: 10,
                  fontFamily: OPS_FONT_HEAD,
                  fontWeight: 700,
                  color: OPS.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
          {due && (
            <span
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: overdue ? OPS.p1 : OPS.textMuted,
              }}
            >
              {overdue && "· "}
              {due}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DraggableTask({ task }: { task: OpsTaskWithRelations }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(task.id),
    data: { task },
  });
  return (
    <Link
      href={`/ops/tarea/${task.id}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        display: "block",
        opacity: isDragging ? 0.35 : 1,
        textDecoration: "none",
        touchAction: "none",
      }}
      onClick={(e) => {
        if (isDragging) e.preventDefault();
      }}
    >
      <TaskCard task={task} />
    </Link>
  );
}

function Column({
  estado,
  tasks,
}: {
  estado: OpsEstado;
  tasks: OpsTaskWithRelations[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: estado });
  const color = ESTADO_COLORS[estado];

  return (
    <div
      style={{
        minWidth: "280px",
        width: "280px",
        padding: "4px",
        borderRadius: "20px",
        background: isOver ? OPS.accentSoft : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOver ? OPS.borderHi : OPS.border}`,
        transition: `background 220ms ${EASE}, border-color 220ms ${EASE}`,
        height: "fit-content",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "14px 16px 12px",
          borderBottom: `1px solid ${OPS.border}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <span
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: OPS.text,
          }}
        >
          {ESTADO_LABELS[estado]}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: OPS_FONT_HEAD,
            fontSize: "11px",
            fontWeight: 700,
            color: OPS.textMuted,
            padding: "3px 9px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${OPS.border}`,
          }}
        >
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "12px",
          minHeight: "80px",
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              color: OPS.textDim,
              fontSize: "12px",
              border: `1px dashed ${OPS.border}`,
              borderRadius: "12px",
            }}
          >
            Arrastra tareas aquí
          </div>
        ) : (
          tasks.map((t) => <DraggableTask key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  color = OPS.accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "999px",
        background: active ? OPS.accentSoft : "transparent",
        border: `1px solid ${active ? OPS.borderHi : OPS.border}`,
        color: active ? color : OPS.textMuted,
        fontFamily: OPS_FONT_HEAD,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: `border-color 220ms ${EASE}, color 220ms ${EASE}, background 220ms ${EASE}`,
      }}
    >
      {children}
    </button>
  );
}

export default function KanbanBoard({ initialTasks, areas, members }: Props) {
  const [tasks, setTasks] = useState<OpsTaskWithRelations[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<OpsTaskWithRelations | null>(null);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [memberFilter, setMemberFilter] = useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (areaFilter && t.area?.slug !== areaFilter) return false;
      if (memberFilter != null && !t.assignees.some((a) => a.id === memberFilter)) return false;
      if (priorityFilter != null && t.prioridad !== priorityFilter) return false;
      return true;
    });
  }, [tasks, areaFilter, memberFilter, priorityFilter]);

  const byEstado = useMemo(() => {
    const m = new Map<OpsEstado, OpsTaskWithRelations[]>();
    for (const e of ESTADO_ORDER) m.set(e, []);
    for (const t of filtered) m.get(t.estado)!.push(t);
    return m;
  }, [filtered]);

  function onDragStart(e: DragStartEvent) {
    const t = tasks.find((x) => x.id === Number(e.active.id));
    setActiveTask(t ?? null);
  }

  async function onDragEnd(e: DragEndEvent) {
    setActiveTask(null);
    if (!e.over) return;
    const id = Number(e.active.id);
    const nuevoEstado = e.over.id as OpsEstado;
    const current = tasks.find((t) => t.id === id);
    if (!current || current.estado === nuevoEstado) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t)));
    const res = await fetch(`/api/ops/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: current.estado } : t)));
    }
  }

  const scrollShellStyle: CSSProperties = {
    display: "flex",
    gap: "16px",
    padding: "24px 40px 40px",
    overflowX: "auto",
    minHeight: "calc(100dvh - 260px)",
  };

  return (
    <>
      {/* Filter bar */}
      <div
        style={{
          padding: "20px 40px",
          borderBottom: `1px solid ${OPS.border}`,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: OPS.textDim,
              marginRight: "6px",
            }}
          >
            Área
          </span>
          <Chip active={areaFilter === null} onClick={() => setAreaFilter(null)}>
            Todas
          </Chip>
          {areas.map((a) => (
            <Chip
              key={a.id}
              active={areaFilter === a.slug}
              onClick={() => setAreaFilter(areaFilter === a.slug ? null : a.slug)}
              color={a.color}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: a.color,
                }}
              />
              {a.nombre}
            </Chip>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: OPS.textDim,
              marginRight: "6px",
            }}
          >
            Persona
          </span>
          <Chip active={memberFilter === null} onClick={() => setMemberFilter(null)}>
            Todos
          </Chip>
          {members.map((m) => (
            <Chip
              key={m.id}
              active={memberFilter === m.id}
              onClick={() => setMemberFilter(memberFilter === m.id ? null : m.id)}
            >
              {m.nombre.split(" ")[0]}
            </Chip>
          ))}
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: OPS.textDim,
              marginRight: "6px",
            }}
          >
            Prioridad
          </span>
          {[1, 2, 3, 4].map((p) => (
            <Chip
              key={p}
              active={priorityFilter === p}
              onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
              color={PRIORIDAD_COLORS[p]}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: PRIORIDAD_COLORS[p],
                }}
              />
              {PRIORIDAD_LABELS[p]}
            </Chip>
          ))}
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div style={scrollShellStyle}>
          {ESTADO_ORDER.map((e) => (
            <Column key={e} estado={e} tasks={byEstado.get(e) ?? []} />
          ))}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} isDragging />}</DragOverlay>
      </DndContext>
    </>
  );
}
