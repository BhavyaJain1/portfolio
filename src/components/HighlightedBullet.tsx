import { tokenizeNumbers } from "@/lib/metrics";
import { cn } from "@/lib/utils";

/**
 * Renders a bullet verbatim, but wraps any figure it contains in a highlight
 * chip. The text itself is never altered.
 */
export function HighlightedBullet({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={cn(className)}>
      {tokenizeNumbers(text).map(([chunk, isNumber], i) =>
        isNumber ? (
          <span
            key={i}
            className="mx-px rounded-md bg-[hsl(var(--glow-cyan)/0.13)] px-1.5 py-0.5 font-mono text-[0.92em] font-semibold text-[hsl(var(--glow-cyan))]"
          >
            {chunk}
          </span>
        ) : (
          <span key={i}>{chunk}</span>
        )
      )}
    </span>
  );
}
