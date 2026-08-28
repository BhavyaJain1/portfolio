"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Flat panel with a hover accent.
 *
 * The cursor-tracking spotlight and the 3D tilt are gone. Under the Terminal
 * direction a surface is a surface: it does not follow you around the screen
 * and it does not pretend to have depth. What is left is a border that picks
 * up the accent on hover and a hairline that lights along the top edge — both
 * pure CSS transitions, so there is no pointer state to track, nothing to
 * recompute per mousemove, and no touch/reduced-motion branching to get wrong.
 *
 * `spotlightColor` keeps its name and its call sites: it now tints the hover
 * border and hairline rather than a radial gradient. `tilt` is accepted and
 * ignored so existing usage stays valid.
 */
export function SpotlightCard({
  children,
  className,
  tilt: _tilt = true,
  spotlightColor = "var(--glow-cyan)",
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  spotlightColor?: string;
}) {
  return (
    <div
      style={
        {
          "--card-accent": `hsl(${spotlightColor})`,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-lg glass",
        "transition-colors duration-150",
        "hover:border-[var(--card-accent)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ background: "var(--card-accent)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
