export const OPS = {
  bg:           "#030405",
  bgElevated:   "#0a0b0d",
  bgInset:      "#121316",
  border:       "rgba(255,255,255,0.08)",
  borderHi:     "rgba(0,224,64,0.32)",
  borderHover:  "rgba(255,255,255,0.14)",
  text:         "#ffffff",
  textMuted:    "#8b8d93",
  textDim:      "#55585e",
  accent:       "#00e040",
  accentDim:    "#00b530",
  accentSoft:   "rgba(0,224,64,0.08)",
  accentMid:    "rgba(0,224,64,0.18)",
  accentGlow:   "rgba(0,224,64,0.25)",
  p1:           "#ff4d6d",
  p2:           "#fbbf24",
  p3:           "#60a5fa",
  p4:           "#8b8d93",
  danger:       "#ef4444",
} as const;

export const OPS_FONT_HEAD = "var(--font-head), system-ui, sans-serif";
export const OPS_FONT_BODY = "var(--font-body), system-ui, sans-serif";

export const ESTADO_LABELS: Record<string, string> = {
  backlog:      "Backlog",
  en_progreso:  "En progreso",
  bloqueado:    "Bloqueado",
  en_revision:  "En revisión",
  hecho:        "Hecho",
};

export const ESTADO_COLORS: Record<string, string> = {
  backlog:      OPS.textDim,
  en_progreso:  OPS.accent,
  bloqueado:    OPS.p1,
  en_revision:  OPS.p2,
  hecho:        "#34d399",
};

export const ESTADO_ORDER = ["backlog", "en_progreso", "bloqueado", "en_revision", "hecho"] as const;

export const PRIORIDAD_LABELS: Record<number, string> = {
  1: "Crítica",
  2: "Alta",
  3: "Normal",
  4: "Baja",
};

export const PRIORIDAD_COLORS: Record<number, string> = {
  1: OPS.p1,
  2: OPS.p2,
  3: OPS.p3,
  4: OPS.p4,
};

export const MESH_BG = `
  radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0,224,64,0.08), transparent 50%),
  radial-gradient(ellipse 60% 40% at 85% 90%, rgba(0,224,64,0.06), transparent 50%),
  radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,255,255,0.02), transparent 50%)
`;

export const EASE = "cubic-bezier(0.32,0.72,0,1)";
