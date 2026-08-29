import { ImageResponse } from "next/og";
import { basics } from "@/data/resume";

/**
 * Social preview card.
 *
 * This is the highest-reach placement the mark has: it renders in LinkedIn
 * posts, recruiter emails, WhatsApp and Slack — i.e. it is seen *before* the
 * site, by people deciding whether to open the link at all. Previously the
 * openGraph block carried a title and description and no image, so every share
 * rendered as a bare text stub.
 *
 * Generated at build time via ImageResponse rather than checked in as a PNG,
 * so the name and title stay in sync with resume.ts instead of drifting.
 *
 * Satori (the renderer behind ImageResponse) supports a deliberately narrow
 * slice of SVG and CSS: no external stylesheets, no CSS variables, no
 * gradients on strokes. The mark is therefore rebuilt here with literal
 * colours and flat strokes rather than reusing <Logo />.
 */

export const runtime = "nodejs";
export const alt = `${basics.name} — ${basics.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 88px",
          background: "#0f1115",
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(39,206,128,0.10), transparent 55%)",
        }}
      >
        <svg width="300" height="300" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke="#243040"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />
          <circle cx="60" cy="60" r="40" stroke="#2c3a4c" strokeWidth="1.5" fill="none" />

          <line x1="60" y1="6" x2="60" y2="18" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="102" x2="60" y2="114" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <line x1="6" y1="60" x2="18" y2="60" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <line x1="102" y1="60" x2="114" y2="60" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />

          <path d="M 54 38 L 42 24" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="42" cy="24" r="2.5" fill="#06b6d4" />
          <path d="M 66 38 L 78 24" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="78" cy="24" r="2.5" fill="#06b6d4" />

          <path d="M 50 40 Q 60 34 70 40 L 68 46 L 52 46 Z" fill="#1a2130" stroke="#06b6d4" strokeWidth="2" />

          <path d="M 46 54 L 30 48" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 74 54 L 90 48" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 44 64 L 26 64" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 76 64 L 94 64" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 46 74 L 30 80" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 74 74 L 90 80" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

          <path
            d="M 46 48 C 46 44, 74 44, 74 48 L 76 74 C 76 84, 60 90, 60 90 C 60 90, 44 84, 44 74 Z"
            fill="#131a24"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path
            d="M 52 64 L 58 70 L 70 56"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="70" cy="56" r="2.5" fill="#34d399" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#27ce80",
            }}
          >
            {basics.locationShort}
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: "#f2f5f3",
              letterSpacing: -2,
              marginTop: 16,
            }}
          >
            {basics.name}
          </div>
          <div style={{ fontSize: 38, color: "#30bfcf", marginTop: 10 }}>
            {basics.title}
          </div>
          {/* Single interpolated string, not `{expr} text` — Satori rejects a
              div with more than one child unless it declares display:flex. */}
          <div style={{ fontSize: 27, color: "#9aa4ae", marginTop: 22 }}>
            {`${basics.yearsExperience} years · Test automation · API · Performance`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
