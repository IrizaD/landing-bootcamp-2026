"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE } from "@/lib/ops/theme";
import type { OpsArea, OpsEstado, OpsMember, OpsTaskWithRelations } from "@/lib/ops/types";

interface Props {
  initialTasks: OpsTaskWithRelations[];
  areas: OpsArea[];
  initialMembers: OpsMember[];
}

async function patchTask(id: number, payload: { estado?: OpsEstado; assignees?: number[]; titulo?: string }) {
  await fetch(`/api/ops/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function deleteTask(id: number) {
  await fetch(`/api/ops/tasks/${id}`, { method: "DELETE" });
}

async function createTask(area_id: number, titulo: string): Promise<OpsTaskWithRelations> {
  const res = await fetch("/api/ops/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area_id, titulo }),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
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

  function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    startTransition(() => {
      deleteTask(id).catch(() => setTasks(tasks));
    });
  }

  function handleRename(id: number, titulo: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, titulo } : t)));
    startTransition(() => {
      patchTask(id, { titulo }).catch(() => setTasks(tasks));
    });
  }

  async function handleCreate(areaId: number, titulo: string) {
    const newTask = await createTask(areaId, titulo);
    setTasks((prev) => [...prev, newTask]);
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
            const done = areaTasks.filter((t) => t.estado === "hecho").length;
            return (
              <AreaSection
                key={area.id}
                areaId={area.id}
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
                onDelete={handleDelete}
                onRename={handleRename}
                onAddTask={handleCreate}
              />
            );
          })}
          {sinArea.length > 0 && (
            <AreaSection
              areaId={0}
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
              onDelete={handleDelete}
              onRename={handleRename}
              onAddTask={handleCreate}
            />
          )}
        </div>
      </section>

      <style>{`
        .ops-check-row:hover { background: rgba(255,255,255,0.03) !important; }
        .ops-assignee-pill:hover { border-color: rgba(255,255,255,0.2) !important; }
        .ops-task-row-wrap:hover .ops-row-action { opacity: 1 !important; }
        .ops-row-action:hover { color: #e0e0e0 !important; }
        .ops-row-delete:hover { color: #ff4d6d !important; }
        @media (max-width: 640px) {
          section { padding: 20px 16px 60px !important; }
          .ops-row-action { opacity: 0.6 !important; }
        }
      `}</style>
    </>
  );
}

function AreaSection({
  areaId, label, color, done, total, tasks, members, openPickerId,
  onToggleDone, onToggleAssignee, onOpenPicker, onMemberCreated, onDelete, onRename, onAddTask,
}: {
  areaId: number;
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
  onDelete: (id: number) => void;
  onRename: (id: number, titulo: string) => void;
  onAddTask: (areaId: number, titulo: string) => Promise<void>;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm) inputRef.current?.focus();
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      await onAddTask(areaId, newTitle.trim());
      setNewTitle("");
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

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
              isLast={i === tasks.length - 1 && !showForm}
              pickerOpen={openPickerId === t.id}
              onToggleDone={() => onToggleDone(t.id)}
              onToggleAssignee={(mid) => onToggleAssignee(t.id, mid)}
              onOpenPicker={() => onOpenPicker(t.id)}
              onMemberCreated={onMemberCreated}
              onDelete={() => onDelete(t.id)}
              onRename={(titulo) => onRename(t.id, titulo)}
            />
          ))}

          {/* Inline new task form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 14px",
                borderTop: tasks.length > 0 ? `1px solid ${OPS.border}` : "none",
              }}
            >
              <input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") { setShowForm(false); setNewTitle(""); } }}
                placeholder="Título de la tarea…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: OPS.text, fontFamily: OPS_FONT_BODY, fontSize: "14px",
                }}
              />
              <button
                type="submit"
                disabled={saving || !newTitle.trim()}
                style={{
                  padding: "5px 14px", borderRadius: "8px",
                  background: newTitle.trim() ? OPS.accent : OPS.bgInset,
                  border: "none", color: newTitle.trim() ? "#000" : OPS.textDim,
                  fontFamily: OPS_FONT_HEAD, fontSize: "11px", fontWeight: 800,
                  letterSpacing: "0.08em", cursor: newTitle.trim() ? "pointer" : "default",
                  transition: `background 150ms ${EASE}`,
                  flexShrink: 0,
                }}
              >
                {saving ? "..." : "Agregar"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setNewTitle(""); }}
                style={{
                  padding: "5px 10px", borderRadius: "8px",
                  background: "transparent", border: `1px solid ${OPS.border}`,
                  color: OPS.textMuted, cursor: "pointer", flexShrink: 0,
                  fontFamily: OPS_FONT_HEAD, fontSize: "11px",
                }}
              >
                Esc
              </button>
            </form>
          )}
        </div>

        {/* + Nueva tarea button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              width: "100%", padding: "9px 18px", marginTop: "2px",
              background: "transparent", border: "none",
              color: OPS.textDim, cursor: "pointer",
              fontFamily: OPS_FONT_HEAD, fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              transition: `color 180ms ${EASE}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = OPS.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = OPS.textDim; }}
          >
            <span style={{ fontSize: "15px", lineHeight: 1 }}>+</span> Nueva tarea
          </button>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  t, areaColor, members, isLast, pickerOpen,
  onToggleDone, onToggleAssignee, onOpenPicker, onMemberCreated, onDelete, onRename,
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
  onDelete: () => void;
  onRename: (titulo: string) => void;
}) {
  const isDone = t.estado === "hecho";
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(t.titulo);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  function startEdit() {
    setEditValue(t.titulo);
    setEditing(true);
  }

  function commitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== t.titulo) {
      onRename(trimmed);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditValue(t.titulo);
    setEditing(false);
  }

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : `1px solid ${OPS.border}`,
        position: "relative",
      }}
      className="ops-task-row-wrap"
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

        {/* Title / Edit input */}
        {editing ? (
          <input
            ref={editRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            style={{
              flex: 1, background: OPS.bgInset, border: `1px solid ${OPS.borderHi}`,
              borderRadius: "6px", padding: "2px 8px",
              color: OPS.text, fontFamily: OPS_FONT_BODY, fontSize: "14px", fontWeight: 500,
              outline: "none",
            }}
          />
        ) : (
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
        )}

        {/* Right side: edit/delete + assignees + date + picker toggle */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
          {/* Edit & Delete — visible on row hover via CSS */}
          {!editing && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); startEdit(); }}
                title="Editar título"
                className="ops-row-action"
                style={{
                  width: "22px", height: "22px", borderRadius: "6px",
                  background: "transparent", border: "none",
                  color: OPS.textDim, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", flexShrink: 0,
                  opacity: 0, transition: `opacity 150ms ${EASE}, color 150ms ${EASE}`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                title="Eliminar tarea"
                className="ops-row-action ops-row-delete"
                style={{
                  width: "22px", height: "22px", borderRadius: "6px",
                  background: "transparent", border: "none",
                  color: OPS.textDim, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", flexShrink: 0,
                  opacity: 0, transition: `opacity 150ms ${EASE}, color 150ms ${EASE}`,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </>
          )}

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
