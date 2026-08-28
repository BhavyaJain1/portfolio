/**
 * Background field.
 * -----------------
 * Two stacked layers, both non-interactive and both entirely static:
 *
 *   1. Base wash  — flat background colour.
 *   2. Dot grid   — CSS radial-gradient lattice, masked so it fades out
 *                   toward the edges instead of tiling to a hard stop.
 *
 * This replaces the previous canvas particle field. The Terminal direction
 * wants a surface that reads as instrumentation, not weather — and a static
 * grid costs nothing: no requestAnimationFrame loop, no canvas, no resize
 * observer, no per-frame paint. Nothing here needs a reduced-motion branch
 * because nothing moves.
 *
 * Server component on purpose — there is no state left to hold.
 */
export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />

      <div
        className="grid-field absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 120% 85% at 50% 40%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 85% at 50% 40%, #000 35%, transparent 100%)",
        }}
      />
    </div>
  );
}
