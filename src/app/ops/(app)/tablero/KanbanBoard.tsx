"use client";
import { useState, useTransition } from "react";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE } from "@/lib/ops/theme";
import type { OpsArea, OpsEstado, OpsTaskWithRelations } from "@/lib/ops/types";

interface Props {
  initialTasks: OpsTaskWithRelations[];
  areas: OpsArea[];
}

async function patchTask(id: number, estado: string) {
  await fetch(`/api/ops/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export default function Checklist({ initialTasks, areas }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();

  function toggle(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next: OpsEstado = task.estado === "hecho" ? "backlog" : "hecho";

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: next } : t))
    );

    startTransition(() => {
      patchTask(id, next).catch(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, estado: task.estado } : t))
        );
      });
    });
  }

  const sinArea = tasks.filter((t) => !t.area_id);

  return (
    <section style={{ padding: "28px 40px 80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {areas.map((area) => {
          const areaTasks = tasks.filter((t) => t.area_id === area.id);
          if (areaTasks.length === 0) return null;
          const done = areaTasks.filter((t) => t.estado === "hecho").length;
          return (
            <AreaSection
              key={area.id}
              label={area.nombre}
              color={area.color}
              done={done}
              total={areaTasks.length}
              tasks={areaTasks}
              onToggle={toggle}
            />
          );
        })}
        {sinArea.length > 0 && (
          <AreaSection
            label="Sin área"
            color={OPS.textDim}
            done={sinArea.filter((t) => t.estado === "hecho").length}
            total={sinArea.length}
            tasks={sinArea}
            onToggle={toggle}
          />
        )}
      </div>

      <style>{`
        .ops-check-row:hover { background: rgba(255,255,255,0.03) !important; }
        @media (max-width: 640px) {
          section { padding: 20px 16px 60px !important; }
        }
      `}</style>
    </section>
  );
}

function AreaSection({
  label,
  color,
  done,
  total,
  tasks,
  onToggle,
}: {
  label: string;
  color: string;
  done: number;
  total: number;
  tasks: OpsTaskWithRelations[];
  onToggle: (id: number) => void;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            background: color,
            boxShadow: `0 0 8px ${color}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: OPS.text,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "10px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: OPS.textDim,
          }}
        >
          {done}/{total}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(90deg, ${color}40, transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "10px",
            color: pct === 100 ? color : OPS.textDim,
          }}
        >
          {pct}%
        </span>
      </div>

      <div
        style={{
          padding: "4px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${OPS.border}`,
        }}
      >
        <div
          style={{
            borderRadius: "14px",
            background: OPS.bgElevated,
            border: `1px solid ${OPS.border}`,
            overflow: "hidden",
          }}
        >
          {tasks.map((t, i) => {
            const isDone = t.estado === "hecho";
            return (
              <button
                key={t.id}
                className="ops-check-row"
                onClick={() => onToggle(t.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "13px 18px",
                  borderBottom: i < tasks.length - 1 ? `1px solid ${OPS.border}` : "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: `background 180ms ${EASE}`,
                }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "5px",
                    border: `1.5px solid ${isDone ? color : OPS.border}`,
                    background: isDone ? color : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: `background 180ms ${EASE}, border-color 180ms ${EASE}`,
                  }}
                >
                  {isDone && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#000"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                <span
                  style={{
                    flex: 1,
                    fontFamily: OPS_FONT_BODY,
                    fontSize: "14px",
                    fontWeight: isDone ? 400 : 500,
                    color: isDone ? OPS.textDim : OPS.text,
                    textDecoration: isDone ? "line-through" : "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    transition: `color 180ms ${EASE}`,
                  }}
                >
                  {t.titulo}
                </span>

                <span
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    color: OPS.textDim,
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  {t.assignees.length > 0 && (
                    <span>{t.assignees.map((a) => a.nombre.split(" ")[0]).join(", ")}</span>
                  )}
                  {t.fecha_limite && !isDone && (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: OPS.bgInset,
                        border: `1px solid ${OPS.border}`,
                        fontSize: "11px",
                      }}
                    >
                      {fmtDate(t.fecha_limite)}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
