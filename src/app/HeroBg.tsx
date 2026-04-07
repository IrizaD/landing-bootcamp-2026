// Focal points: upper-left and upper-right corners (off-screen)
// Arcs radiate outward like the bootcamp banner reference
const GREEN = "#00e040";
const LEFT_FX  = -420;
const LEFT_FY  = -80;
const RIGHT_FX = 1860;
const RIGHT_FY = -80;
const NUM_WAVES = 24;

const waves = Array.from({ length: NUM_WAVES }, (_, i) => ({
  r:  620 + i * 64,                             // 620 → 2132
  op: 0.08 + (i / (NUM_WAVES - 1)) * 0.34,      // 0.08 → 0.42
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
          {/* Ambient glow — left corner */}
          <radialGradient id="orb-gl" cx="0%" cy="0%" r="100%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.20" />
            <stop offset="60%"  stopColor={GREEN} stopOpacity="0.05" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow — right corner */}
          <radialGradient id="orb-gr" cx="100%" cy="0%" r="100%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.16" />
            <stop offset="60%"  stopColor={GREEN} stopOpacity="0.04" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Center vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="wave-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT CORNER GLOWS ──────────────────────── */}
        <rect x="0" y="0" width="720" height="860" fill="url(#orb-gl)" />
        <rect x="720" y="0" width="720" height="860" fill="url(#orb-gr)" />

        {/* ── LEFT WAVE ARCS (focal: upper-left) ────────── */}
        <g className="wave-group wave-group-l" filter="url(#wave-glow)">
          {waves.map(({ r, op }, i) => (
            <circle
              key={`l${i}`}
              cx={LEFT_FX} cy={LEFT_FY}
              r={r}
              fill="none"
              stroke={GREEN}
              strokeWidth="0.85"
              strokeOpacity={op}
              className={`wave-el wl${i}`}
            />
          ))}
        </g>

        {/* ── RIGHT WAVE ARCS (focal: upper-right) ──────── */}
        <g className="wave-group wave-group-r" filter="url(#wave-glow)">
          {waves.map(({ r, op }, i) => (
            <circle
              key={`r${i}`}
              cx={RIGHT_FX} cy={RIGHT_FY}
              r={r}
              fill="none"
              stroke={GREEN}
              strokeWidth="0.85"
              strokeOpacity={op}
              className={`wave-el wr${i}`}
            />
          ))}
        </g>

        {/* ── CENTER VIGNETTE ───────────────────────────── */}
        <rect x="0" y="0" width="1440" height="860" fill="url(#vignette)" />

        {/* ── FLOATING PARTICLES ────────────────────────── */}
        {[
          { cx: 155,  cy: 670, r: 2,   cls: "p1", op: 0.55 },
          { cx: 310,  cy: 530, r: 1.5, cls: "p2", op: 0.40 },
          { cx: 490,  cy: 720, r: 2,   cls: "p3", op: 0.45 },
          { cx: 1100, cy: 185, r: 2,   cls: "p4", op: 0.45 },
          { cx: 1255, cy: 345, r: 1.5, cls: "p5", op: 0.40 },
          { cx: 1390, cy: 150, r: 2,   cls: "p6", op: 0.50 },
          { cx: 780,  cy: 790, r: 1.5, cls: "p7", op: 0.25 },
          { cx: 660,  cy: 72,  r: 1.5, cls: "p8", op: 0.30 },
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
