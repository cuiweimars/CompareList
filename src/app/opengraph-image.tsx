import { ImageResponse } from "next/og";

export const alt = "CompareList - Smart List Comparison Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(129,140,248,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34,211,238,0.06) 0%, transparent 50%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #818cf8, #22d3ee)",
            marginBottom: 32,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </div>
        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            fontFamily: "sans-serif",
            color: "#f9fafb",
            marginBottom: 16,
          }}
        >
          Compare<span style={{ background: "linear-gradient(135deg, #818cf8, #22d3ee)", backgroundClip: "text", color: "transparent" }}>List</span>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            fontFamily: "sans-serif",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Compare Two Lists Instantly. Find differences, common items, and unique entries.
        </div>
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            padding: "8px 24px",
            borderRadius: 100,
            border: "1px solid rgba(129,140,248,0.3)",
            background: "rgba(129,140,248,0.1)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ fontSize: 16, color: "#9ca3af", fontFamily: "sans-serif" }}>Free · Private · No Signup</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
