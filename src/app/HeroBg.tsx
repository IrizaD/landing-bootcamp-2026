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
          <radialGradient id="orb-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eb2b1a" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#eb2b1a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#eb2b1a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#188bf6" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#188bf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#188bf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-r2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eb2b1a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#eb2b1a" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-r" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-b" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── ORBS ─────────────────────────────────────── */}
        <ellipse className="orb-red"   cx="260"  cy="680" rx="560" ry="440" fill="url(#orb-r)"  />
        <ellipse className="orb-blue"  cx="1260" cy="180" rx="480" ry="380" fill="url(#orb-b)"  />
        <ellipse className="orb-red-2" cx="820"  cy="420" rx="300" ry="240" fill="url(#orb-r2)" />
        <ellipse className="orb-blue-m" cx="960" cy="720" rx="320" ry="260" fill="url(#orb-b)" />

        {/* ── PLUS SIGNS ───────────────────────────────── */}

        {/* Large + top-left — center (110, 190) */}
        <g className="geo geo-plus-1" filter="url(#glow-r)">
          <line x1="110" y1="170" x2="110" y2="210" stroke="#eb2b1a" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.75" />
          <line x1="90"  y1="190" x2="130" y2="190" stroke="#eb2b1a" strokeWidth="9" strokeLinecap="round" strokeOpacity="0.75" />
        </g>

        {/* Medium + top-right — center (1310, 122) */}
        <g className="geo geo-plus-2" filter="url(#glow-b)">
          <line x1="1310" y1="106" x2="1310" y2="138" stroke="#188bf6" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="1294" y1="122" x2="1326" y2="122" stroke="#188bf6" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.7" />
        </g>

        {/* Small + center-right — center (1390, 378) */}
        <g className="geo geo-plus-3" filter="url(#glow-r)">
          <line x1="1390" y1="366" x2="1390" y2="390" stroke="#eb2b1a" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.6" />
          <line x1="1378" y1="378" x2="1402" y2="378" stroke="#eb2b1a" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.6" />
        </g>

        {/* Tiny + scattered — center (560, 78) */}
        <g className="geo geo-plus-4">
          <line x1="560" y1="70" x2="560" y2="86" stroke="#188bf6" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.6" />
          <line x1="552" y1="78" x2="568" y2="78" stroke="#188bf6" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.6" />
        </g>

        {/* Tiny + — center (1080, 710) */}
        <g className="geo geo-plus-5">
          <line x1="1080" y1="702" x2="1080" y2="718" stroke="#eb2b1a" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.55" />
          <line x1="1072" y1="710" x2="1088" y2="710" stroke="#eb2b1a" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.55" />
        </g>

        {/* ── VENN — referencia sutil a 1+1=3 ─────────── */}
        <g className="geo geo-venn-1" filter="url(#glow-r)">
          <circle cx="1200" cy="640" r="38" fill="none" stroke="#eb2b1a" strokeWidth="3.5" strokeOpacity="0.65" />
          <circle cx="1228" cy="640" r="38" fill="none" stroke="#eb2b1a" strokeWidth="3.5" strokeOpacity="0.65" />
        </g>

        <g className="geo geo-venn-2" filter="url(#glow-b)">
          <circle cx="55"  cy="340" r="26" fill="none" stroke="#188bf6" strokeWidth="3" strokeOpacity="0.6" />
          <circle cx="76"  cy="340" r="26" fill="none" stroke="#188bf6" strokeWidth="3" strokeOpacity="0.6" />
        </g>

        {/* ── ARCOS FRAGMENTADOS ────────────────────────── */}
        <path className="geo geo-arc-1"
          d="M 760 30 A 60 60 0 0 1 880 30"
          fill="none" stroke="#188bf6" strokeWidth="3.5" strokeOpacity="0.55" strokeLinecap="round"
        />
        <path className="geo geo-arc-2"
          d="M 300 810 A 70 70 0 0 0 440 810"
          fill="none" stroke="#eb2b1a" strokeWidth="3.2" strokeOpacity="0.5" strokeLinecap="round"
        />
        <path className="geo geo-arc-3"
          d="M 1440 480 A 80 80 0 0 1 1360 580"
          fill="none" stroke="#188bf6" strokeWidth="3.5" strokeOpacity="0.5" strokeLinecap="round"
        />

        {/* ── MOBILE — esquina inferior-derecha ── */}

        {/* + grande bottom-right — center (880, 650) */}
        <g className="geo geo-plus-m1" filter="url(#glow-b)">
          <line x1="880" y1="630" x2="880" y2="670" stroke="#188bf6" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="860" y1="650" x2="900" y2="650" stroke="#188bf6" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.7" />
        </g>

        <g className="geo geo-venn-m" filter="url(#glow-r)">
          <circle cx="820" cy="780" r="32" fill="none" stroke="#eb2b1a" strokeWidth="3.5" strokeOpacity="0.6" />
          <circle cx="848" cy="780" r="32" fill="none" stroke="#eb2b1a" strokeWidth="3.5" strokeOpacity="0.6" />
        </g>

        <path className="geo geo-arc-m"
          d="M 760 830 A 55 55 0 0 1 870 830"
          fill="none" stroke="#eb2b1a" strokeWidth="3.2" strokeOpacity="0.5" strokeLinecap="round"
        />

        {/* + tiny mid-right — center (940, 496) */}
        <g className="geo geo-plus-m2" filter="url(#glow-r)">
          <line x1="940" y1="484" x2="940" y2="508" stroke="#eb2b1a" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.55" />
          <line x1="928" y1="496" x2="952" y2="496" stroke="#eb2b1a" strokeWidth="7" strokeLinecap="round" strokeOpacity="0.55" />
        </g>

        {/* ── ENERGY STREAKS ────────────────────────────── */}
        <line className="streak streak-1"
          x1="-100" y1="300" x2="600" y2="60"
          stroke="#eb2b1a" strokeWidth="3" strokeOpacity="0.28"
          strokeDasharray="60 90" strokeLinecap="round"
        />
        <line className="streak streak-2"
          x1="700" y1="860" x2="1540" y2="520"
          stroke="#188bf6" strokeWidth="3" strokeOpacity="0.22"
          strokeDasharray="80 120" strokeLinecap="round"
        />
        <line className="streak streak-3"
          x1="400" y1="860" x2="1000" y2="600"
          stroke="#eb2b1a" strokeWidth="2.5" strokeOpacity="0.2"
          strokeDasharray="40 80" strokeLinecap="round"
        />

        {/* ── FLOATING PARTICLES ────────────────────────── */}
        {[
          { cx: 480,  cy: 700, r: 2.5, cls: "p1", col: "#eb2b1a", op: 0.55 },
          { cx: 900,  cy: 780, r: 2,   cls: "p2", col: "#188bf6", op: 0.45 },
          { cx: 1100, cy: 650, r: 2,   cls: "p3", col: "#eb2b1a", op: 0.4  },
          { cx: 280,  cy: 600, r: 1.5, cls: "p4", col: "#188bf6", op: 0.5  },
          { cx: 650,  cy: 720, r: 1.5, cls: "p5", col: "#eb2b1a", op: 0.35 },
          { cx: 1250, cy: 560, r: 2,   cls: "p6", col: "#188bf6", op: 0.4  },
          { cx: 760,  cy: 800, r: 1.5, cls: "p7", col: "#eb2b1a", op: 0.3  },
          { cx: 1050, cy: 750, r: 2.5, cls: "p8", col: "#188bf6", op: 0.35 },
        ].map((p) => (
          <circle key={p.cls} className={`particle ${p.cls}`}
            cx={p.cx} cy={p.cy} r={p.r} fill={p.col} fillOpacity={p.op} />
        ))}
      </svg>
    </div>
  );
}
