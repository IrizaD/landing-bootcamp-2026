"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_ORDER, ESTADO_LABELS, PRIORIDAD_LABELS } from "@/lib/ops/theme";
import type { OpsArea, OpsMember, OpsMilestone, OpsTaskWithRelations } from "@/lib/ops/types";

interface Props {
  task: OpsTaskWithRelations;
  areas: OpsArea[];
  members: OpsMember[];
  milestones: OpsMilestone[];
}

const inputBase = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  background: OPS.bgInset,
  border: `1px solid ${OPS.border}`,
  color: OPS.text,
  fontFamily: OPS_FONT_BODY,
  fontSize: "14.5px",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: `border-color 220ms ${EASE}`,
};

const labelStyle = {
  display: "block",
  fontFamily: OPS_FONT_HEAD,
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: OPS.textDim,
  marginBottom: "8px",
  fontWeight: 700,
};

export default function TaskEditor({ task, areas, members, milestones }: Props) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(task.titulo);
  const [descripcion, setDescripcion] = useState(task.descripcion ?? "");
  const [estado, setEstado] = useState(task.estado);
  const [prioridad, setPrioridad] = useState<number>(task.prioridad);
  const [areaId, setAreaId] = useState(task.area_id);
  const [milestoneId, setMilestoneId] = useState<number | "">(task.milestone_id ?? "");
  const [fechaLimite, setFechaLimite] = useState(task.fecha_limite ?? "");
  const [assignees, setAssignees] = useState<number[]>(task.assignees.map((m) => m.id));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    const payload = {
      titulo,
      descripcion: descripcion.trim() || null,
      estado,
      prioridad,
      area_id: areaId,
      milestone_id: milestoneId === "" ? null : Number(milestoneId),
      fecha_limite: fechaLimite || null,
      assignees,
    };
    const res = await fetch(`/api/ops/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j.error ?? "Error al guardar");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    startTransition(() => router.refresh());
  }

  async function onDelete() {
    if (!confirm("¿Eliminar esta tarea? No se puede deshacer.")) return;
    const res = await fetch(`/api/ops/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) router.push("/ops/tablero");
  }

  function toggleAssignee(id: number) {
    setAssignees((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <label style={labelStyle}>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputBase} />
      </div>

      <div>
        <label style={labelStyle}>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          style={{ ...inputBase, resize: "vertical", fontFamily: OPS_FONT_BODY }}
          placeholder="Contexto, aclaraciones, criterios de listo…"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as typeof estado)}
            style={{ ...inputBase, cursor: "pointer" }}
          >
            {ESTADO_ORDER.map((s) => (
              <option key={s} value={s}>
                {ESTADO_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(Number(e.target.value))}
            style={{ ...inputBase, cursor: "pointer" }}
          >
            {[1, 2, 3, 4].map((p) => (
              <option key={p} value={p}>
                {PRIORIDAD_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={labelStyle}>Área</label>
          <select
            value={areaId}
            onChange={(e) => setAreaId(Number(e.target.value))}
            style={{ ...inputBase, cursor: "pointer" }}
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Milestone</label>
          <select
            value={milestoneId}
            onChange={(e) => setMilestoneId(e.target.value === "" ? "" : Number(e.target.value))}
            style={{ ...inputBase, cursor: "pointer" }}
          >
            <option value="">— Sin milestone —</option>
            {milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Fecha límite</label>
        <input
          type="date"
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
          style={{ ...inputBase, colorScheme: "dark" }}
        />
      </div>

      <div>
        <label style={labelStyle}>Asignar a</label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {members.map((m) => {
            const on = assignees.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleAssignee(m.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 14px 7px 8px",
                  borderRadius: "999px",
                  background: on ? OPS.accentSoft : "transparent",
                  border: `1px solid ${on ? OPS.borderHi : OPS.border}`,
                  color: on ? OPS.accent : OPS.textMuted,
                  cursor: "pointer",
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "11.5px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  transition: `all 220ms ${EASE}`,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${OPS.border}`,
                    fontSize: 10,
                    fontWeight: 800,
                    color: OPS.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {m.initials}
                </span>
                {m.nombre.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {err && <div style={{ color: OPS.p1, fontSize: "13px" }}>{err}</div>}

      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
        <button
          onClick={save}
          disabled={isPending}
          style={{
            padding: "4px",
            borderRadius: "999px",
            background: "rgba(0,224,64,0.18)",
            border: `1px solid ${OPS.borderHi}`,
            cursor: "pointer",
            transition: `transform 200ms ${EASE}`,
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 18px",
              borderRadius: "999px",
              background: saved ? "#34d399" : OPS.accent,
              color: "#000",
              fontFamily: OPS_FONT_HEAD,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {saved ? "✓ Guardado" : isPending ? "Guardando…" : "Guardar cambios"}
          </span>
        </button>
        <button
          onClick={onDelete}
          style={{
            background: "transparent",
            border: `1px solid ${OPS.border}`,
            color: OPS.textMuted,
            padding: "10px 16px",
            borderRadius: "999px",
            cursor: "pointer",
            fontFamily: OPS_FONT_HEAD,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            transition: `color 220ms ${EASE}, border-color 220ms ${EASE}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = OPS.p1;
            e.currentTarget.style.borderColor = "rgba(255,77,109,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = OPS.textMuted;
            e.currentTarget.style.borderColor = OPS.border;
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
