/**
 * Shield mark — a bug crawling inside a security shield.
 *
 * The gait is the point: the six legs are split into two tripods (front-left +
 * middle-right + hind-left against front-right + middle-left + hind-right)
 * driven exactly out of phase, which is what reads as walking rather than legs
 * wiggling. The body bobs twice per cycle, once per tripod plant. The antennae
 * run on longer, mismatched cycles so they read as sensing rather than keeping
 * time with the legs.
 *
 * Inlined rather than served as <img src="/logo-shield.svg"> so it paints with
 * the first frame — it is the first thing on screen, and a second request for
 * it would be visible.
 *
 * Class names are prefixed `bjs-` and the keyframes live in globals.css. The
 * source SVG used bare names like `.leg` and `.bug-body`, which would leak into
 * a global stylesheet and collide with anything else on the page.
 *
 * Colours are theme variables, not the source's literals. The original ran
 * cyan #06b6d4 / indigo #6366f1 / emerald #10b981 against hard-coded navy
 * fills — three hues the Terminal palette does not contain, on surfaces that
 * would sit as dark blobs in light mode. The mapping keeps the artwork's
 * hierarchy:
 *
 *   shield border  signal green → instrument teal, the same ramp as
 *                  .text-gradient-accent
 *   bug strokes    teal, so the body reads as structure
 *   legs           teal at 60%, so six strokes recede instead of competing
 *   pass node      signal green — it is the pass state, and green is what
 *                  that means everywhere else on the site
 */
export function LogoShield({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Bhavya Jain"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bjsShieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--glow-cyan))" />
          <stop offset="100%" stopColor="hsl(var(--glow-violet))" />
        </linearGradient>

        <linearGradient id="bjsShieldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--card))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>

        <filter id="bjsShieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient backdrop glow */}
      <path
        d="M 60 14 Q 96 14 96 34 C 96 74 60 106 60 106 C 60 106 24 74 24 34 Q 24 14 60 14 Z"
        fill="hsl(var(--glow-cyan))"
        opacity="0.1"
        filter="url(#bjsShieldGlow)"
      />

      {/* Shield frame */}
      <path
        d="M 60 14 Q 96 14 96 34 C 96 74 60 106 60 106 C 60 106 24 74 24 34 Q 24 14 60 14 Z"
        fill="url(#bjsShieldGlass)"
        stroke="url(#bjsShieldBorder)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g className="bjs-body">
        {/* Antennae */}
        <path
          className="bjs-antenna-l"
          d="M 54 39 Q 48 27 42 29"
          stroke="hsl(var(--glow-violet))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="bjs-antenna-r"
          d="M 66 39 Q 72 27 78 29"
          stroke="hsl(var(--glow-violet))"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Head */}
        <path
          d="M 52 42 C 52 36, 68 36, 68 42 Z"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--glow-violet))"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Legs — three pairs, alternating tripod */}
        <path className="bjs-leg bjs-leg-fl" d="M 46 51 Q 33 46 34 38" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="bjs-leg bjs-leg-fr" d="M 74 51 Q 87 46 86 38" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="bjs-leg bjs-leg-ml" d="M 43 62 Q 30 62 31 52" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="bjs-leg bjs-leg-mr" d="M 77 62 Q 90 62 89 52" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="bjs-leg bjs-leg-hl" d="M 46 73 Q 33 78 34 88" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="bjs-leg bjs-leg-hr" d="M 74 73 Q 87 78 86 88" stroke="hsl(var(--glow-violet) / 0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Carapace */}
        <ellipse cx="60" cy="63" rx="16.5" ry="19.5" fill="hsl(var(--card))" stroke="hsl(var(--glow-violet))" strokeWidth="3" />
        <line x1="60" y1="45" x2="60" y2="82" stroke="hsl(var(--glow-violet))" strokeWidth="2.5" strokeLinecap="round" />

        {/* Pass indicator */}
        <circle cx="60" cy="63" r="3.5" fill="hsl(var(--glow-cyan))" className="bjs-pass" />
      </g>
    </svg>
  );
}
