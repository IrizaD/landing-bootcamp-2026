"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_COLORS, ESTADO_LABELS } from "@/lib/ops/theme";
import type { OpsMilestone, OpsTaskWithRelations } from "@/lib/ops/types";

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

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function MilestoneCard({
  m: initial,
  tasks,
  isPast,
  isNext,
}: {
  m: OpsMilestone;
  tasks: OpsTaskWithRelations[];
  isPast: boolean;
  isNext: boolean;
}) {
  const [m, setM] = useState(initial);
  const [editingDate, setEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState(toDatetimeLocal(initial.fecha));
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const color = TIPO_COLOR[m.tipo] ?? OPS.accent;

  useEffect(() => {
    if (editingDate) inputRef.current?.focus();
  }, [editingDate]);

  async function saveDate() {
    if (!dateValue) { setEditingDate(false); return; }
    const newIso = new Date(dateValue).toISOString();
    if (newIso === new Date(m.fecha).toISOString()) { setEditingDate(false); return; }
    setSaving(true);
    try {
      await fetch(`/api/ops/milestones/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: newIso }),
      });
      setM((prev) => ({ ...prev, fecha: newIso }));
      setEditingDate(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function cancelDate() {
    setDateValue(toDatetimeLocal(m.fecha));
    setEditingDate(false);
  }

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
      {/* Date column */}
      <div
        style={{
          textAlign: "right",
          paddingTop: "8px",
          color: isPast ? OPS.textDim : OPS.text,
        }}
      >
        {editingDate ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <input
              ref={inputRef}
              type="datetime-local"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveDate();
                if (e.key === "Escape") cancelDate();
              }}
              style={{
                width: "130px",
                padding: "4px 6px",
                borderRadius: "6px",
                background: OPS.bgInset,
                border: `1px solid ${OPS.borderHi}`,
                color: OPS.text,
                fontFamily: OPS_FONT_HEAD,
                fontSize: "11px",
                outline: "none",
                colorScheme: "dark",
              }}
            />
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={saveDate}
                disabled={saving}
                style={{
                  padding: "3px 8px", borderRadius: "5px",
                  background: OPS.accent, border: "none",
                  color: "#000", fontFamily: OPS_FONT_HEAD,
                  fontSize: "10px", fontWeight: 800, cursor: "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "..." : "OK"}
              </button>
              <button
                onClick={cancelDate}
                style={{
                  padding: "3px 6px", borderRadius: "5px",
                  background: "transparent", border: `1px solid ${OPS.border}`,
                  color: OPS.textMuted, fontFamily: OPS_FONT_HEAD,
                  fontSize: "10px", cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditingDate(true)}
            title="Editar fecha"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "right",
              color: "inherit",
            }}
          >
            <div
              className="milestone-date-text"
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                textTransform: "capitalize",
                transition: `color 150ms ${EASE}`,
              }}
            >
              {fmtFull(m.fecha).replace(".", "")}
            </div>
            <div
              style={{
                color: OPS.textDim,
                fontSize: "11px",
                marginTop: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
              }}
            >
              {fmtTime(m.fecha)}
              <svg
                className="milestone-edit-icon"
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: 0, transition: `opacity 150ms ${EASE}` }}
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Dot */}
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

      {/* Card */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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

export default function TimelineClient({
  milestones,
  tasksByMilestone,
  nextSlug,
}: {
  milestones: OpsMilestone[];
  tasksByMilestone: Map<number, OpsTaskWithRelations[]>;
  nextSlug: string | undefined;
}) {
  const now = Date.now();
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
        {/* Vertical line */}
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
        {milestones.map((m) => (
          <MilestoneCard
            key={m.id}
            m={m}
            tasks={tasksByMilestone.get(m.id) ?? []}
            isPast={new Date(m.fecha).getTime() < now}
            isNext={m.slug === nextSlug}
          />
        ))}
      </div>
      <style>{`
        button:hover .milestone-date-text { color: ${OPS.accent} !important; }
        button:hover .milestone-edit-icon { opacity: 1 !important; }
      `}</style>
    </>
  );
}
