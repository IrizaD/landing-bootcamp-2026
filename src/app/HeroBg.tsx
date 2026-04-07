const GREEN = "#00e040";
const LEFT_CX = -350;
const RIGHT_CX = 1790;
const FOCAL_CY = 430;
const EL_RY = 720;
const NUM_WAVES = 13;

const waves = Array.from({ length: NUM_WAVES }, (_, i) => ({
  ellRx: 460 + i * 68,               // 460 → 1276
  op: 0.07 + (i / (NUM_WAVES - 1)) * 0.30,  // 0.07 → 0.37
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
          {/* Ambient glow orb — left */}
          <radialGradient id="orb-gl" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.22" />
            <stop offset="55%"  stopColor={GREEN} stopOpacity="0.06" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow orb — right */}
          <radialGradient id="orb-gr" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GREEN} stopOpacity="0.18" />
            <stop offset="55%"  stopColor={GREEN} stopOpacity="0.05" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>

          {/* Center vignette to keep hero text area clean */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.60" />
            <stop offset="50%"  stopColor="#000" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for wave lines */}
          <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── AMBIENT ORBS ──────────────────────────────── */}
        <ellipse
          className="orb-wave-l"
          cx="180" cy="470" rx="430" ry="330"
          fill="url(#orb-gl)"
        />
        <ellipse
          className="orb-wave-r"
          cx="1260" cy="390" rx="430" ry="330"
          fill="url(#orb-gr)"
        />

        {/* ── LEFT WAVE LINES ───────────────────────────── */}
        <g className="wave-group wave-group-l" filter="url(#wave-glow)">
          {waves.map(({ ellRx, op }, i) => (
            <ellipse
              key={`l${i}`}
              cx={LEFT_CX} cy={FOCAL_CY}
              rx={ellRx} ry={EL_RY}
              fill="none"
              stroke={GREEN}
              strokeWidth="1"
              strokeOpacity={op}
              className={`wave-el wl${i}`}
            />
          ))}
        </g>

        {/* ── RIGHT WAVE LINES ──────────────────────────── */}
        <g className="wave-group wave-group-r" filter="url(#wave-glow)">
          {waves.map(({ ellRx, op }, i) => (
            <ellipse
              key={`r${i}`}
              cx={RIGHT_CX} cy={FOCAL_CY}
              rx={ellRx} ry={EL_RY}
              fill="none"
              stroke={GREEN}
              strokeWidth="1"
              strokeOpacity={op}
              className={`wave-el wr${i}`}
            />
          ))}
        </g>

        {/* ── CENTER VIGNETTE ───────────────────────────── */}
        <rect x="0" y="0" width="1440" height="860" fill="url(#vignette)" />

        {/* ── FLOATING PARTICLES ────────────────────────── */}
        {[
          { cx: 155,  cy: 670, r: 2,   cls: "p1", op: 0.60 },
          { cx: 310,  cy: 530, r: 1.5, cls: "p2", op: 0.45 },
          { cx: 495,  cy: 725, r: 2,   cls: "p3", op: 0.50 },
          { cx: 1100, cy: 185, r: 2,   cls: "p4", op: 0.50 },
          { cx: 1258, cy: 345, r: 1.5, cls: "p5", op: 0.45 },
          { cx: 1392, cy: 155, r: 2,   cls: "p6", op: 0.55 },
          { cx: 780,  cy: 795, r: 1.5, cls: "p7", op: 0.28 },
          { cx: 665,  cy: 75,  r: 1.5, cls: "p8", op: 0.32 },
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
