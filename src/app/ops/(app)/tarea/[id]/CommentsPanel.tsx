"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE } from "@/lib/ops/theme";
import type { OpsComment, OpsMember } from "@/lib/ops/types";

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentsPanel({
  taskId,
  initial,
  members,
}: {
  taskId: number;
  initial: OpsComment[];
  members: OpsMember[];
}) {
  const [comments, setComments] = useState(initial);
  const [body, setBody] = useState("");
  const [memberId, setMemberId] = useState<number | "">("");
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!body.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/ops/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim(), member_id: memberId === "" ? null : memberId }),
    });
    setLoading(false);
    if (res.ok) {
      const c = (await res.json()) as OpsComment;
      setComments((prev) => [...prev, c]);
      setBody("");
      startTransition(() => router.refresh());
    }
  }

  const memberById = new Map(members.map((m) => [m.id, m]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          paddingBottom: "6px",
          borderBottom: `1px solid ${OPS.border}`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: OPS_FONT_HEAD,
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Comentarios
        </h3>
        <span
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "11px",
            fontWeight: 700,
            color: OPS.textMuted,
            padding: "2px 8px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${OPS.border}`,
          }}
        >
          {comments.length}
        </span>
      </div>

      {comments.length === 0 ? (
        <div style={{ color: OPS.textDim, fontSize: "13px", padding: "8px 0" }}>
          Aún no hay comentarios. Deja el primero.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments.map((c) => {
            const m = c.member_id != null ? memberById.get(c.member_id) : null;
            return (
              <div
                key={c.id}
                style={{
                  padding: "4px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${OPS.border}`,
                }}
              >
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "11px",
                    background: OPS.bgInset,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.06)",
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
                      {m?.initials ?? "·"}
                    </div>
                    <span
                      style={{
                        fontFamily: OPS_FONT_HEAD,
                        fontSize: "12px",
                        fontWeight: 700,
                        color: OPS.text,
                      }}
                    >
                      {m?.nombre ?? "Anónimo"}
                    </span>
                    <span style={{ color: OPS.textDim, fontSize: "11px", marginLeft: "auto" }}>
                      {fmtWhen(c.created_at)}
                    </span>
                  </div>
                  <div
                    style={{
                      color: OPS.text,
                      fontFamily: OPS_FONT_BODY,
                      fontSize: "14px",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {c.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          padding: "4px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${OPS.border}`,
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "11px",
            background: OPS.bgInset,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value === "" ? "" : Number(e.target.value))}
              style={{
                background: "transparent",
                border: `1px solid ${OPS.border}`,
                color: OPS.textMuted,
                borderRadius: "999px",
                padding: "5px 12px",
                fontSize: "11px",
                fontFamily: OPS_FONT_HEAD,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="">Publicar como…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Escribe un comentario…"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              color: OPS.text,
              fontFamily: OPS_FONT_BODY,
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={submit}
              disabled={loading || !body.trim()}
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                background: !body.trim() ? "rgba(0,224,64,0.2)" : OPS.accent,
                color: "#000",
                border: "none",
                cursor: loading || !body.trim() ? "not-allowed" : "pointer",
                fontFamily: OPS_FONT_HEAD,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: !body.trim() ? 0.4 : 1,
                transition: `opacity 220ms ${EASE}, transform 200ms ${EASE}`,
              }}
            >
              {loading ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
