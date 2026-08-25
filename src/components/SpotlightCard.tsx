"use client";

import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Glass card with two pointer-driven effects:
 *   - a spotlight that tracks the cursor
 *   - a subtle 3D tilt
 *
 * Both are pointer-only (never fires on touch) and both switch off under
 * prefers-reduced-motion.
 */
export function SpotlightCard({
  children,
  className,
  tilt = true,
  spotlightColor = "var(--glow-cyan)",
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const [transform, setTransform] = useState("");

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setPos({ x: px * 100, y: py * 100 });

    if (tilt) {
      // Keep the tilt tiny — enough to read as depth, not enough to distract.
      const rx = (0.5 - py) * 6;
      const ry = (px - 0.5) * 6;
      setTransform(
        `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      );
    }
  };

  const reset = () => {
    setActive(false);
    setTransform("");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={(e) => {
        if (e.pointerType !== "touch") setActive(true);
      }}
      onPointerLeave={reset}
      style={{ transform, transition: "transform 400ms cubic-bezier(0.21,0.6,0.35,1)" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass",
        "transition-[border-color,box-shadow] duration-400",
        "hover:border-[hsl(var(--glow-cyan)/0.35)]",
        className
      )}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, hsl(${spotlightColor} / 0.14), transparent 65%)`,
        }}
      />
      {/* Top hairline that lights up on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${spotlightColor} / 0.7), transparent)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
