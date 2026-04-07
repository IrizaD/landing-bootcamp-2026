// Focal points: left and right SIDES, vertically centered (off-screen)
// ClipPaths prevent the two groups from crossing in the center
const GREEN = "#00e040";
const LEFT_FX  = -380;
const LEFT_FY  = 430;
const RIGHT_FX = 1820;
const RIGHT_FY = 430;
const NUM_WAVES = 22;

const waves = Array.from({ length: NUM_WAVES }, (_, i) => ({
  r:  460 + i * 52,                             // 460 → 1482
  op: 0.07 + (i / (NUM_WAVES - 1)) * 0.36,      // 0.07 → 0.43
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
          {/* Clip left waves to left portion */}
          <clipPath id="clip-l">
            <rect x="0" y="0" width="790" height="860" />
          </clipPath>
          {/* Clip right waves to right portion */}
          <clipPath id="clip-r">
            <rect x="650" y="0" width="790" height="860" />
          </clipPath>

          {/* Ambient glow — left side */}
          <radialGradient id="orb-gl" cx="0%" cy="50%" r="70%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.18" />
            <stop offset="60%"  stopColor={GREEN} stopOpacity="0.05" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow — right side */}
          <radialGradient id="orb-gr" cx="100%" cy="50%" r="70%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.15" />
            <stop offset="60%"  stopColor={GREEN} stopOpacity="0.04" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Center vignette — hides crossing seam */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="40%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.72" />
            <stop offset="60%"  stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter */}
          <filter id="wave-glow" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT SIDE GLOWS ────────────────────────── */}
        <rect x="0"   y="0" width="1440" height="860" fill="url(#orb-gl)" />
        <rect x="0"   y="0" width="1440" height="860" fill="url(#orb-gr)" />

        {/* ── LEFT WAVE ARCS ────────────────────────────── */}
        {/* Circles from left-side focal, clipped to left half */}
        <g className="wave-group wave-group-l"
           filter="url(#wave-glow)"
           clipPath="url(#clip-l)">
          {waves.map(({ r, op }, i) => (
            <circle
              key={`l${i}`}
              cx={LEFT_FX} cy={LEFT_FY}
              r={r}
              fill="none"
              stroke={GREEN}
              strokeWidth="0.9"
              strokeOpacity={op}
              className={`wave-el wl${i}`}
            />
          ))}
        </g>

        {/* ── RIGHT WAVE ARCS ───────────────────────────── */}
        {/* Mirror circles from right-side focal, clipped to right half */}
        <g className="wave-group wave-group-r"
           filter="url(#wave-glow)"
           clipPath="url(#clip-r)">
          {waves.map(({ r, op }, i) => (
            <circle
              key={`r${i}`}
              cx={RIGHT_FX} cy={RIGHT_FY}
              r={r}
              fill="none"
              stroke={GREEN}
              strokeWidth="0.9"
              strokeOpacity={op}
              className={`wave-el wr${i}`}
            />
          ))}
        </g>

        {/* ── CENTER VIGNETTE (hides seam) ─────────────── */}
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
