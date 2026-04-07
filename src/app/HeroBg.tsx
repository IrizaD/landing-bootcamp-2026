// Focal point ABOVE the viewport center → circles create horizontal U-shaped arcs
// ClipPath left/right prevents crossing in center seam
const GREEN = "#00e040";
const FOCAL_X = 720;
const FOCAL_Y = -520;   // well above viewport
const NUM_WAVES = 22;

const waves = Array.from({ length: NUM_WAVES }, (_, i) => ({
  r:  660 + i * 42,                             // 660 → 1542
  op: 0.09 + (i / (NUM_WAVES - 1)) * 0.36,      // 0.09 → 0.45
}));

export function HeroBg() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <svg
        className="hero-bg-svg"
        viewBox="0 0 1440 860"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip left arcs to left half */}
          <clipPath id="clip-l">
            <rect x="0" y="0" width="780" height="860" />
          </clipPath>
          {/* Clip right arcs to right half */}
          <clipPath id="clip-r">
            <rect x="660" y="0" width="780" height="860" />
          </clipPath>

          {/* Ambient glow — left */}
          <radialGradient id="orb-gl" cx="0%" cy="60%" r="80%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.16" />
            <stop offset="65%"  stopColor={GREEN} stopOpacity="0.04" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>
          {/* Ambient glow — right */}
          <radialGradient id="orb-gr" cx="100%" cy="60%" r="80%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.13" />
            <stop offset="65%"  stopColor={GREEN} stopOpacity="0.03" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Center vignette — darkens the seam */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="38%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.70" />
            <stop offset="55%"  stopColor="#000" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Glow blur */}
          <filter id="wave-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT GLOWS ─────────────────────────────── */}
        <rect x="0" y="0" width="1440" height="860" fill="url(#orb-gl)" />
        <rect x="0" y="0" width="1440" height="860" fill="url(#orb-gr)" />

        {/* ── LEFT ARCS — left half of each U-shape ─────── */}
        <g clipPath="url(#clip-l)">
          <g className="wave-group wave-group-l" filter="url(#wave-glow)">
            {waves.map(({ r, op }, i) => (
              <circle
                key={`l${i}`}
                cx={FOCAL_X} cy={FOCAL_Y}
                r={r}
                fill="none"
                stroke={GREEN}
                strokeWidth="0.85"
                strokeOpacity={op}
                className={`wave-el wl${i}`}
              />
            ))}
          </g>
        </g>

        {/* ── RIGHT ARCS — right half of each U-shape ───── */}
        <g clipPath="url(#clip-r)">
          <g className="wave-group wave-group-r" filter="url(#wave-glow)">
            {waves.map(({ r, op }, i) => (
              <circle
                key={`r${i}`}
                cx={FOCAL_X} cy={FOCAL_Y}
                r={r}
                fill="none"
                stroke={GREEN}
                strokeWidth="0.85"
                strokeOpacity={op}
                className={`wave-el wr${i}`}
              />
            ))}
          </g>
        </g>

        {/* ── CENTER VIGNETTE ───────────────────────────── */}
        <rect x="0" y="0" width="1440" height="860" fill="url(#vignette)" />

        {/* ── FLOATING PARTICLES ────────────────────────── */}
        {[
          { cx: 140,  cy: 660, r: 2,   cls: "p1", op: 0.55 },
          { cx: 300,  cy: 520, r: 1.5, cls: "p2", op: 0.40 },
          { cx: 480,  cy: 715, r: 2,   cls: "p3", op: 0.45 },
          { cx: 1095, cy: 180, r: 2,   cls: "p4", op: 0.45 },
          { cx: 1250, cy: 340, r: 1.5, cls: "p5", op: 0.40 },
          { cx: 1385, cy: 145, r: 2,   cls: "p6", op: 0.50 },
          { cx: 775,  cy: 785, r: 1.5, cls: "p7", op: 0.22 },
          { cx: 655,  cy: 70,  r: 1.5, cls: "p8", op: 0.28 },
        ].map((p) => (
          <circle
            key={p.cls}
            className={`particle ${p.cls}`}
            cx={p.cx} cy={p.cy} r={p.r}
            fill={GREEN} fillOpacity={p.op}
          />
        ))}
      </svg>
    </div>
  );
}
