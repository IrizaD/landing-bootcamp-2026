"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE } from "@/lib/ops/theme";
import type { OpsArea, OpsEstado, OpsMember, OpsTaskWithRelations } from "@/lib/ops/types";

interface Props {
  initialTasks: OpsTaskWithRelations[];
  areas: OpsArea[];
  initialMembers: OpsMember[];
}

async function patchTask(id: number, payload: { estado?: OpsEstado; assignees?: number[] }) {
  await fetch(`/api/ops/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function createMember(nombre: string, rol: string): Promise<OpsMember> {
  const res = await fetch("/api/ops/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, rol }),
  });
  if (!res.ok) throw new Error("Error al crear persona");
  return res.json();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export default function Checklist({ initialTasks, areas, initialMembers }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [members, setMembers] = useState(initialMembers);
  const [openPickerId, setOpenPickerId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function toggleDone(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next: OpsEstado = task.estado === "hecho" ? "backlog" : "hecho";
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: next } : t)));
    startTransition(() => {
      patchTask(id, { estado: next }).catch(() => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, estado: task.estado } : t)));
      });
    });
  }

  function toggleAssignee(taskId: number, memberId: number) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const has = task.assignees.some((a) => a.id === memberId);
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const nextAssignees = has
      ? task.assignees.filter((a) => a.id !== memberId)
      : [...task.assignees, member];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignees: nextAssignees } : t))
    );
    startTransition(() => {
      patchTask(taskId, { assignees: nextAssignees.map((a) => a.id) }).catch(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, assignees: task.assignees } : t))
        );
      });
    });
  }

  function handleMemberCreated(m: OpsMember) {
    setMembers((prev) => [...prev, m]);
  }

  const sinArea = tasks.filter((t) => !t.area_id);

  return (
    <>
      {openPickerId !== null && (
        <div
          onClick={() => setOpenPickerId(null)}
          style={{ position: "fixed", inset: 0, zIndex: 30 }}
        />
      )}

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
                members={members}
                openPickerId={openPickerId}
                onToggleDone={toggleDone}
                onToggleAssignee={toggleAssignee}
                onOpenPicker={(id) => setOpenPickerId((prev) => (prev === id ? null : id))}
                onMemberCreated={handleMemberCreated}
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
              members={members}
              openPickerId={openPickerId}
              onToggleDone={toggleDone}
              onToggleAssignee={toggleAssignee}
              onOpenPicker={(id) => setOpenPickerId((prev) => (prev === id ? null : id))}
              onMemberCreated={handleMemberCreated}
            />
          )}
        </div>
      </section>

      <style>{`
        .ops-check-row:hover { background: rgba(255,255,255,0.03) !important; }
        .ops-assignee-pill:hover { border-color: rgba(255,255,255,0.2) !important; }
        @media (max-width: 640px) {
          section { padding: 20px 16px 60px !important; }
        }
      `}</style>
    </>
  );
}

function AreaSection({
  label, color, done, total, tasks, members, openPickerId,
  onToggleDone, onToggleAssignee, onOpenPicker, onMemberCreated,
}: {
  label: string;
  color: string;
  done: number;
  total: number;
  tasks: OpsTaskWithRelations[];
  members: OpsMember[];
  openPickerId: number | null;
  onToggleDone: (id: number) => void;
  onToggleAssignee: (taskId: number, memberId: number) => void;
  onOpenPicker: (id: number) => void;
  onMemberCreated: (m: OpsMember) => void;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <span
          style={{
            width: "8px", height: "8px", borderRadius: "999px",
            background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: OPS_FONT_HEAD, fontSize: "13px", fontWeight: 700, color: OPS.text }}>
          {label}
        </span>
        <span style={{ fontFamily: OPS_FONT_HEAD, fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: OPS.textDim }}>
          {done}/{total}
        </span>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${color}40, transparent)` }} />
        <span style={{ fontFamily: OPS_FONT_HEAD, fontSize: "10px", color: pct === 100 ? color : OPS.textDim }}>
          {pct}%
        </span>
      </div>

      <div style={{ padding: "4px", borderRadius: "18px", background: "rgba(255,255,255,0.02)", border: `1px solid ${OPS.border}` }}>
        <div style={{ borderRadius: "14px", background: OPS.bgElevated, border: `1px solid ${OPS.border}`, overflow: "hidden" }}>
          {tasks.map((t, i) => (
            <TaskRow
              key={t.id}
              t={t}
              areaColor={color}
              members={members}
              isLast={i === tasks.length - 1}
              pickerOpen={openPickerId === t.id}
              onToggleDone={() => onToggleDone(t.id)}
              onToggleAssignee={(mid) => onToggleAssignee(t.id, mid)}
              onOpenPicker={() => onOpenPicker(t.id)}
              onMemberCreated={onMemberCreated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  t, areaColor, members, isLast, pickerOpen,
  onToggleDone, onToggleAssignee, onOpenPicker, onMemberCreated,
}: {
  t: OpsTaskWithRelations;
  areaColor: string;
  members: OpsMember[];
  isLast: boolean;
  pickerOpen: boolean;
  onToggleDone: () => void;
  onToggleAssignee: (memberId: number) => void;
  onOpenPicker: () => void;
  onMemberCreated: (m: OpsMember) => void;
}) {
  const isDone = t.estado === "hecho";

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : `1px solid ${OPS.border}`,
        position: "relative",
      }}
    >
      <div
        className="ops-check-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "13px 18px",
          transition: `background 180ms ${EASE}`,
        }}
      >
        {/* Checkbox */}
        <button
          onClick={onToggleDone}
          style={{
            width: "18px", height: "18px", borderRadius: "5px",
            border: `1.5px solid ${isDone ? areaColor : OPS.border}`,
            background: isDone ? areaColor : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, cursor: "pointer",
            transition: `background 180ms ${EASE}, border-color 180ms ${EASE}`,
          }}
        >
          {isDone && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Title */}
        <span
          style={{
            flex: 1, fontFamily: OPS_FONT_BODY, fontSize: "14px",
            fontWeight: isDone ? 400 : 500,
            color: isDone ? OPS.textDim : OPS.text,
            textDecoration: isDone ? "line-through" : "none",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            transition: `color 180ms ${EASE}`,
          }}
        >
          {t.titulo}
        </span>

        {/* Right side: assignees + date + picker toggle */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          {t.fecha_limite && !isDone && (
            <span
              style={{
                padding: "2px 8px", borderRadius: "999px",
                background: OPS.bgInset, border: `1px solid ${OPS.border}`,
                color: OPS.textDim, fontSize: "11px", fontFamily: OPS_FONT_HEAD,
              }}
            >
              {fmtDate(t.fecha_limite)}
            </span>
          )}

          {/* Assignee bubbles */}
          {t.assignees.slice(0, 3).map((a) => (
            <span
              key={a.id}
              title={a.nombre}
              style={{
                width: "24px", height: "24px", borderRadius: "999px",
                background: "rgba(255,255,255,0.08)", border: `1px solid ${OPS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: OPS_FONT_HEAD, fontSize: "9px", fontWeight: 700,
                color: OPS.text, letterSpacing: "-0.01em",
              }}
            >
              {a.initials}
            </span>
          ))}
          {t.assignees.length > 3 && (
            <span style={{ color: OPS.textDim, fontSize: "11px" }}>
              +{t.assignees.length - 3}
            </span>
          )}

          {/* Picker toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenPicker(); }}
            title="Asignar persona"
            style={{
              width: "24px", height: "24px", borderRadius: "999px",
              background: pickerOpen ? OPS.accentSoft : "rgba(255,255,255,0.04)",
              border: `1px solid ${pickerOpen ? OPS.borderHi : OPS.border}`,
              color: pickerOpen ? OPS.accent : OPS.textDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "14px", fontWeight: 700,
              transition: `background 180ms ${EASE}, color 180ms ${EASE}`,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Assignee picker */}
      {pickerOpen && (
        <AssigneePicker
          members={members}
          assigned={t.assignees.map((a) => a.id)}
          onToggle={onToggleAssignee}
          onClose={() => onOpenPicker()}
          onMemberCreated={onMemberCreated}
        />
      )}
    </div>
  );
}

function AssigneePicker({
  members, assigned, onToggle, onClose, onMemberCreated,
}: {
  members: OpsMember[];
  assigned: number[];
  onToggle: (id: number) => void;
  onClose: () => void;
  onMemberCreated: (m: OpsMember) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setErr("");
    try {
      const m = await createMember(nombre.trim(), rol.trim());
      onMemberCreated(m);
      setNombre("");
      setRol("");
      setShowForm(false);
    } catch {
      setErr("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        right: "18px",
        top: "calc(100% + 4px)",
        width: "240px",
        borderRadius: "14px",
        background: OPS.bgElevated,
        border: `1px solid ${OPS.borderHi}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {/* Member list */}
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {members.length === 0 && (
          <div style={{ padding: "14px 16px", color: OPS.textDim, fontSize: "13px" }}>
            Sin personas creadas
          </div>
        )}
        {members.map((m) => {
          const checked = assigned.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => onToggle(m.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 14px", background: "transparent", border: "none",
                borderBottom: `1px solid ${OPS.border}`, cursor: "pointer",
                textAlign: "left", transition: `background 150ms ${EASE}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {/* Check indicator */}
              <span
                style={{
                  width: "14px", height: "14px", borderRadius: "4px", flexShrink: 0,
                  border: `1.5px solid ${checked ? OPS.accent : OPS.border}`,
                  background: checked ? OPS.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: `background 150ms ${EASE}`,
                }}
              >
                {checked && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {/* Initials bubble */}
              <span
                style={{
                  width: "24px", height: "24px", borderRadius: "999px", flexShrink: 0,
                  background: "rgba(255,255,255,0.08)", border: `1px solid ${OPS.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: OPS_FONT_HEAD, fontSize: "9px", fontWeight: 700, color: OPS.text,
                }}
              >
                {m.initials}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: OPS_FONT_BODY, fontSize: "13px", fontWeight: 500, color: OPS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.nombre}
                </div>
                <div style={{ color: OPS.textDim, fontSize: "11px" }}>{m.rol}</div>
              </span>
            </button>
          );
        })}
      </div>

      {/* Create member section */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 14px", background: "transparent", border: "none",
            color: OPS.accent, cursor: "pointer", fontFamily: OPS_FONT_HEAD,
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", transition: `background 150ms ${EASE}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = OPS.accentSoft; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Nueva persona
        </button>
      ) : (
        <form
          onSubmit={handleCreate}
          style={{ padding: "12px 14px", borderTop: `1px solid ${OPS.border}` }}
        >
          <input
            autoFocus
            placeholder="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Rol (ej. Speaker, Logística)"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            style={{ ...inputStyle, marginTop: "6px" }}
          />
          {err && (
            <div style={{ color: OPS.p1, fontSize: "11px", marginTop: "4px" }}>{err}</div>
          )}
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={saving || !nombre.trim()}
              style={{
                flex: 1, padding: "7px 0", borderRadius: "8px",
                background: nombre.trim() ? OPS.accent : OPS.bgInset,
                border: "none", color: nombre.trim() ? "#000" : OPS.textDim,
                fontFamily: OPS_FONT_HEAD, fontSize: "11px", fontWeight: 800,
                letterSpacing: "0.08em", cursor: nombre.trim() ? "pointer" : "default",
                transition: `background 150ms ${EASE}`,
              }}
            >
              {saving ? "..." : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setNombre(""); setRol(""); setErr(""); }}
              style={{
                padding: "7px 12px", borderRadius: "8px",
                background: "transparent", border: `1px solid ${OPS.border}`,
                color: OPS.textMuted, cursor: "pointer",
                fontFamily: OPS_FONT_HEAD, fontSize: "11px",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: "8px",
  background: OPS.bgInset, border: `1px solid ${OPS.border}`,
  color: OPS.text, fontFamily: OPS_FONT_BODY, fontSize: "13px",
  outline: "none", boxSizing: "border-box",
};
