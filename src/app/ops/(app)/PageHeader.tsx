import type { ReactNode } from "react";
import { OPS, OPS_FONT_HEAD } from "@/lib/ops/theme";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "42px 40px 28px",
        borderBottom: `1px solid ${OPS.border}`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: "720px" }}>
        {eyebrow && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: OPS.accentSoft,
              border: `1px solid ${OPS.borderHi}`,
              fontFamily: OPS_FONT_HEAD,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: OPS.accent,
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: OPS.accent,
                boxShadow: `0 0 10px ${OPS.accent}`,
              }}
            />
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            fontFamily: OPS_FONT_HEAD,
            fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: OPS.textMuted,
              fontSize: "15px",
              lineHeight: 1.55,
              marginTop: "14px",
              maxWidth: "620px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
