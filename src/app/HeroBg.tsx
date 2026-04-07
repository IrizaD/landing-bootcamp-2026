// Focal BELOW viewport → circles produce ∩ arcs that curve UPWARD
// r range chosen so arcs enter from the side edges and peak near/above the top
const GREEN = "#00e040";
const FOCAL_X = 720;   // horizontally centered
const FOCAL_Y = 1400;  // well below the 860px-tall viewport
const NUM_WAVES = 24;

// r must be > sqrt(FOCAL_Y² + 720²) ≈ 1577 to span full width at the top.
// We range from arcs that peak mid-viewport to arcs spanning full width.
const waves = Array.from({ length: NUM_WAVES }, (_, i) => ({
  r:  980 + i * 28,                              // 980 → 1632
  op: 0.07 + (i / (NUM_WAVES - 1)) * 0.38,       // 0.07 → 0.45
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
          {/* Ambient glow — left edge */}
          <radialGradient id="orb-gl" cx="0%" cy="70%" r="70%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.18" />
            <stop offset="65%"  stopColor={GREEN} stopOpacity="0.04" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>
          {/* Ambient glow — right edge */}
          <radialGradient id="orb-gr" cx="100%" cy="70%" r="70%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.15" />
            <stop offset="65%"  stopColor={GREEN} stopOpacity="0.03" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Center vignette — darkens mid-viewport so text reads clearly */}
          <radialGradient id="vignette" cx="50%" cy="45%" r="42%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.68" />
            <stop offset="55%"  stopColor="#000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Subtle glow on wave lines */}
          <filter id="wave-glow" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT SIDE GLOWS ────────────────────────── */}
        <rect x="0" y="0" width="1440" height="860" fill="url(#orb-gl)" />
        <rect x="0" y="0" width="1440" height="860" fill="url(#orb-gr)" />

        {/* ── WAVE ARCS — ∩ shape, curve upward ─────────── */}
        <g className="wave-group wave-group-l" filter="url(#wave-glow)">
          {waves.map(({ r, op }, i) => (
            <circle
              key={i}
              cx={FOCAL_X} cy={FOCAL_Y}
              r={r}
              fill="none"
              stroke={GREEN}
              strokeWidth="1.4"
              strokeOpacity={op}
              className={`wave-el w${i}`}
            />
          ))}
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
