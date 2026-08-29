import { cn } from "@/lib/utils";

/**
 * Brand mark — a robotic bug caught in a crosshair reticle, with a radar
 * sweep and an assertion check that draws itself green.
 *
 * Inlined rather than served as <img src="/logo.svg"> for three reasons: the
 * animation can be driven by the page's CSS (so the global reduced-motion
 * block in globals.css switches it off for free), the surfaces can follow the
 * theme, and there is no second network request on first paint — which matters
 * when the thing renders inside the splash.
 *
 * Every colour is a theme variable. The source ran cyan / indigo / emerald
 * against near-black fills — hues the Terminal palette does not contain, on
 * surfaces that would sit as dark blobs against the light theme's paper. Body
 * gradient and assertion check take signal green, structure takes instrument
 * teal, and the legs run teal at 60% so six strokes recede rather than compete.
 *
 * Animation classes live in globals.css so they stay scoped to one place and
 * inherit the site's motion contract. `oneShot` runs the assertion check once
 * and holds it — the splash needs the tick to land, not loop.
 */
export function Logo({
  className,
  animated = true,
  oneShot = false,
}: {
  className?: string;
  /** Radar sweep + check scan. Reduced-motion still overrides this. */
  animated?: boolean;
  /** Play the check once and hold, instead of looping. */
  oneShot?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("bj-logo", className)}
      role="img"
      aria-label="Bhavya Jain"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bjLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--glow-cyan))" />
          <stop offset="100%" stopColor="hsl(var(--glow-violet))" />
        </linearGradient>
      </defs>

      {/* Reticle frame — themed so the rings read on paper as well as graphite */}
      <circle
        cx="60"
        cy="60"
        r="48"
        stroke="hsl(var(--border))"
        strokeWidth="2"
        strokeDasharray="6 6"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke="hsl(var(--border))"
        strokeWidth="1.5"
        fill="none"
      />

      <line
        x1="60"
        y1="60"
        x2="60"
        y2="12"
        stroke="hsl(var(--glow-violet))"
        strokeWidth="1"
        strokeOpacity="0.3"
        className={animated ? "bj-logo-radar" : undefined}
      />

      {/* Crosshair markers */}
      <line x1="60" y1="6" x2="60" y2="18" stroke="hsl(var(--glow-violet))" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="102" x2="60" y2="114" stroke="hsl(var(--glow-violet))" strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="60" x2="18" y2="60" stroke="hsl(var(--glow-violet))" strokeWidth="3" strokeLinecap="round" />
      <line x1="102" y1="60" x2="114" y2="60" stroke="hsl(var(--glow-violet))" strokeWidth="3" strokeLinecap="round" />

      {/* Antennae */}
      <path d="M 54 38 L 42 24" stroke="hsl(var(--glow-violet))" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="24" r="2.5" fill="hsl(var(--glow-violet))" />
      <path d="M 66 38 L 78 24" stroke="hsl(var(--glow-violet))" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="78" cy="24" r="2.5" fill="hsl(var(--glow-violet))" />

      {/* Head */}
      <path
        d="M 50 40 Q 60 34 70 40 L 68 46 L 52 46 Z"
        fill="hsl(var(--muted))"
        stroke="hsl(var(--glow-violet))"
        strokeWidth="2"
      />

      {/* Circuit legs */}
      <path d="M 46 54 L 30 48" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 74 54 L 90 48" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 44 64 L 26 64" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 76 64 L 94 64" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 46 74 L 30 80" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 74 74 L 90 80" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Core body */}
      <path
        d="M 46 48 C 46 44, 74 44, 74 48 L 76 74 C 76 84, 60 90, 60 90 C 60 90, 44 84, 44 74 Z"
        fill="hsl(var(--card))"
        stroke="url(#bjLogoGrad)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Assertion check — the payoff */}
      <path
        d="M 52 64 L 58 70 L 70 56"
        stroke="hsl(var(--glow-cyan))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={
          animated
            ? oneShot
              ? "bj-logo-tick-once"
              : "bj-logo-tick"
            : undefined
        }
      />
      <circle cx="70" cy="56" r="2.5" fill="hsl(var(--glow-cyan))" />
    </svg>
  );
}

/**
 * Small-size variant of the mark, for anywhere under ~48px.
 *
 * The full logo does not survive being shrunk: six leg strokes at 2.5px, two
 * antennae and a dashed ring collapse into fuzz well before favicon size. This
 * drops the legs, antennae, inner ring and radar sweep, thickens what remains,
 * and keeps only what stays legible — reticle, body, and the green check that
 * carries the whole idea. Same geometry as app/icon.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Bhavya Jain"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bjMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--glow-cyan))" />
          <stop offset="100%" stopColor="hsl(var(--glow-violet))" />
        </linearGradient>
      </defs>

      <rect width="120" height="120" rx="26" fill="hsl(var(--muted))" />

      <circle cx="60" cy="60" r="36" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />

      <line x1="60" y1="10" x2="60" y2="26" stroke="hsl(var(--glow-violet))" strokeWidth="7" strokeLinecap="round" />
      <line x1="60" y1="94" x2="60" y2="110" stroke="hsl(var(--glow-violet))" strokeWidth="7" strokeLinecap="round" />
      <line x1="10" y1="60" x2="26" y2="60" stroke="hsl(var(--glow-violet))" strokeWidth="7" strokeLinecap="round" />
      <line x1="94" y1="60" x2="110" y2="60" stroke="hsl(var(--glow-violet))" strokeWidth="7" strokeLinecap="round" />

      <path
        d="M 44 46 C 44 41, 76 41, 76 46 L 78 74 C 78 85, 60 92, 60 92 C 60 92, 42 85, 42 74 Z"
        fill="hsl(var(--card))"
        stroke="url(#bjMarkGrad)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      <path
        d="M 50 64 L 57 71 L 71 55"
        stroke="hsl(var(--glow-cyan))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
