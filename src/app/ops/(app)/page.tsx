import Link from "next/link";
import { fetchAreas, fetchMembers, fetchMilestones, fetchTasks } from "@/lib/ops/queries";
import { OPS, OPS_FONT_HEAD, OPS_FONT_BODY, EASE, ESTADO_LABELS, ESTADO_COLORS } from "@/lib/ops/theme";
import type { OpsTaskWithRelations, OpsMilestone } from "@/lib/ops/types";
import PageHeader from "./PageHeader";

export const dynamic = "force-dynamic";

const EVENT_START = new Date("2026-06-05T09:30:00-06:00");

function daysUntil(date: Date): number {
  const diff = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtMilestone(iso: string): string {
  return new Date(iso).toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupBy<T, K extends string | number>(arr: T[], fn: (t: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of arr) {
    const k = fn(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

function KpiCard({
  eyebrow,
  value,
  suffix,
  caption,
  accent = OPS.accent,
}: {
  eyebrow: string;
  value: string | number;
  suffix?: string;
  caption?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${OPS.border}`,
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderRadius: "19px",
          background: OPS.bgElevated,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
          position: "relative",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "3px",
            background: `linear-gradient(180deg, ${accent}, transparent)`,
          }}
        />
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: OPS.textDim,
            marginBottom: "14px",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            fontFamily: OPS_FONT_HEAD,
          }}
        >
          <span
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: OPS.text,
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              style={{
                fontSize: "14px",
                color: OPS.textMuted,
                fontWeight: 500,
              }}
            >
              {suffix}
            </span>
          )}
        </div>
        {caption && (
          <div style={{ color: OPS.textMuted, fontSize: "12.5px", marginTop: "10px" }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneRow({ m, isNext }: { m: OpsMilestone; isNext: boolean }) {
  const d = new Date(m.fecha);
  const past = d.getTime() < Date.now();
  return (
    <div
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        borderBottom: `1px solid ${OPS.border}`,
        background: isNext ? OPS.accentSoft : "transparent",
        position: "relative",
      }}
    >
      {isNext && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "2px",
            background: OPS.accent,
          }}
        />
      )}
      <div
        style={{
          width: "44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "1.5rem",
            fontWeight: 800,
            color: past ? OPS.textDim : isNext ? OPS.accent : OPS.text,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {d.getDate()}
        </div>
        <div
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: OPS.textDim,
            marginTop: "3px",
          }}
        >
          {d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: OPS_FONT_BODY,
            fontWeight: 600,
            fontSize: "14px",
            color: past ? OPS.textMuted : OPS.text,
            marginBottom: "2px",
          }}
        >
          {m.nombre}
        </div>
        {m.descripcion && (
          <div style={{ color: OPS.textDim, fontSize: "12.5px" }}>{m.descripcion}</div>
        )}
      </div>
      <div
        style={{
          fontFamily: OPS_FONT_HEAD,
          fontSize: "10px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: past ? OPS.textDim : isNext ? OPS.accent : OPS.textMuted,
          padding: "4px 10px",
          borderRadius: "999px",
          background: isNext ? OPS.accentSoft : "transparent",
          border: `1px solid ${isNext ? OPS.borderHi : OPS.border}`,
          flexShrink: 0,
        }}
      >
        {m.tipo.replace("_", " ")}
      </div>
    </div>
  );
}

function TaskRow({ t }: { t: OpsTaskWithRelations }) {
  const areaColor = t.area?.color ?? OPS.accent;
  return (
    <Link
      href={`/ops/tarea/${t.id}`}
      className="ops-task-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 18px",
        borderBottom: `1px solid ${OPS.border}`,
        color: OPS.text,
        textDecoration: "none",
        transition: `background 220ms ${EASE}`,
      }}
    >
      <div
        style={{
          width: "2px",
          height: "36px",
          background: areaColor,
          borderRadius: "2px",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: OPS_FONT_BODY,
            fontWeight: 600,
            fontSize: "14px",
            marginBottom: "3px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t.titulo}
        </div>
        <div style={{ color: OPS.textDim, fontSize: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
          <span>{t.area?.nombre ?? "—"}</span>
          {t.fecha_limite && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{fmtDate(t.fecha_limite)}</span>
            </>
          )}
          {t.assignees.length > 0 && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{t.assignees.map((a) => a.nombre.split(" ")[0]).join(", ")}</span>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          fontFamily: OPS_FONT_HEAD,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: ESTADO_COLORS[t.estado] ?? OPS.textMuted,
          padding: "4px 10px",
          borderRadius: "999px",
          border: `1px solid ${OPS.border}`,
          flexShrink: 0,
        }}
      >
        {ESTADO_LABELS[t.estado]}
      </div>
    </Link>
  );
}

function BentoCard({
  title,
  subtitle,
  children,
  span = 1,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        padding: "5px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${OPS.border}`,
      }}
      className={`ops-bento-span-${span}`}
    >
      <div
        style={{
          borderRadius: "19px",
          background: OPS.bgElevated,
          border: `1px solid ${OPS.border}`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px 14px",
            borderBottom: `1px solid ${OPS.border}`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: OPS_FONT_HEAD,
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div style={{ color: OPS.textDim, fontSize: "12px", marginTop: "3px" }}>
                {subtitle}
              </div>
            )}
          </div>
          {action}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default async function OverviewPage() {
  const [tasks, areas, members, milestones] = await Promise.all([
    fetchTasks(),
    fetchAreas(),
    fetchMembers(),
    fetchMilestones(),
  ]);

  const total = tasks.length;
  const hechas = tasks.filter((t) => t.estado === "hecho").length;
  const bloqueadas = tasks.filter((t) => t.estado === "bloqueado").length;
  const enProgreso = tasks.filter((t) => t.estado === "en_progreso").length;
  const pct = total > 0 ? Math.round((hechas / total) * 100) : 0;

  const criticas = tasks
    .filter((t) => t.prioridad === 1 && t.estado !== "hecho")
    .sort((a, b) => (a.fecha_limite ?? "").localeCompare(b.fecha_limite ?? ""))
    .slice(0, 6);

  const nextMilestones = milestones
    .filter((m) => new Date(m.fecha).getTime() > Date.now())
    .slice(0, 6);
  const nextSlug = nextMilestones[0]?.slug;

  const byArea = groupBy(tasks, (t) => t.area?.slug ?? "sin-area");

  return (
    <>
      <PageHeader
        eyebrow="Overview · Radar"
        title="Tablero de operaciones"
        subtitle="Estado vivo del Bootcamp y Synergy Unlimited. Todos los frentes, un solo plano."
        right={
          <Link
            href="/ops/tablero"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px",
              borderRadius: "999px",
              background: "rgba(0,224,64,0.15)",
              border: `1px solid ${OPS.borderHi}`,
              textDecoration: "none",
              transition: `transform 200ms ${EASE}`,
            }}
          >
            <span
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                background: OPS.accent,
                color: "#000",
                fontFamily: OPS_FONT_HEAD,
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Abrir tablero
            </span>
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "999px",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: OPS.accent,
                fontWeight: 700,
                marginRight: "4px",
              }}
            >
              →
            </span>
          </Link>
        }
      />

      <section style={{ padding: "28px 40px 60px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
            marginBottom: "22px",
          }}
          className="ops-kpi-grid"
        >
          <KpiCard
            eyebrow="Días al evento"
            value={daysUntil(EVENT_START)}
            suffix="restantes"
            caption="Bootcamp · 5-7 junio 2026"
            accent={OPS.accent}
          />
          <KpiCard
            eyebrow="Progreso global"
            value={`${pct}%`}
            caption={`${hechas} de ${total} tareas completadas`}
            accent={OPS.accent}
          />
          <KpiCard
            eyebrow="En progreso"
            value={enProgreso}
            caption={enProgreso === 1 ? "tarea activa" : "tareas activas"}
            accent={OPS.p3}
          />
          <KpiCard
            eyebrow="Bloqueadas"
            value={bloqueadas}
            caption={bloqueadas > 0 ? "requieren desbloqueo" : "sin bloqueos"}
            accent={bloqueadas > 0 ? OPS.p1 : OPS.textDim}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "18px",
            marginBottom: "22px",
          }}
          className="ops-bento-grid"
        >
          <BentoCard
            title="Tareas críticas"
            subtitle="Prioridad máxima · ordenadas por vencimiento"
            action={
              <Link
                href="/ops/tablero"
                style={{
                  color: OPS.accent,
                  fontFamily: OPS_FONT_HEAD,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Ver todas →
              </Link>
            }
          >
            {criticas.length === 0 ? (
              <div style={{ padding: "30px", color: OPS.textMuted, textAlign: "center" }}>
                Sin tareas críticas pendientes. 🟢
              </div>
            ) : (
              criticas.map((t) => <TaskRow key={t.id} t={t} />)
            )}
          </BentoCard>

          <BentoCard title="Próximos milestones" subtitle="Siguientes 6 hitos">
            {nextMilestones.length === 0 ? (
              <div style={{ padding: "30px", color: OPS.textMuted, textAlign: "center" }}>
                Sin milestones próximos.
              </div>
            ) : (
              nextMilestones.map((m) => (
                <MilestoneRow key={m.id} m={m} isNext={m.slug === nextSlug} />
              ))
            )}
          </BentoCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
          }}
          className="ops-area-grid"
        >
          {areas.map((a) => {
            const ts = byArea[a.slug] ?? [];
            const done = ts.filter((t) => t.estado === "hecho").length;
            const p = ts.length ? Math.round((done / ts.length) * 100) : 0;
            return (
              <Link
                key={a.id}
                href={`/ops/tablero?area=${a.slug}`}
                className="ops-area-card"
                style={
                  {
                    padding: "5px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${OPS.border}`,
                    textDecoration: "none",
                    color: OPS.text,
                    transition: `transform 260ms ${EASE}, border-color 260ms ${EASE}`,
                    "--area-color": a.color,
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: OPS.bgElevated,
                    border: `1px solid ${OPS.border}`,
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "999px",
                        background: a.color,
                        boxShadow: `0 0 10px ${a.color}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: OPS_FONT_HEAD,
                        fontSize: "13px",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {a.nombre}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: OPS_FONT_HEAD,
                        fontSize: "2rem",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {done}
                    </span>
                    <span style={{ color: OPS.textDim, fontSize: "13px" }}>/ {ts.length}</span>
                  </div>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${p}%`,
                        background: a.color,
                        borderRadius: "2px",
                        transition: `width 500ms ${EASE}`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: OPS.textDim,
                      fontFamily: OPS_FONT_HEAD,
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: "10px",
                    }}
                  >
                    {p}% completado
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: "40px", color: OPS.textDim, fontSize: "12px" }}>
          {members.length} personas en el equipo · {milestones.length} milestones mapeados · última actualización{" "}
          {new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
        </div>

        <style>{`
          .ops-task-row:hover { background: rgba(255,255,255,0.025) !important; }
          .ops-area-card:hover { transform: translateY(-2px); border-color: var(--area-color) !important; }
          @media (max-width: 1100px) {
            .ops-kpi-grid, .ops-area-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .ops-bento-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .ops-kpi-grid, .ops-area-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
