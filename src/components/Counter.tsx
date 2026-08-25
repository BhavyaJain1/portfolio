"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Count-up numeral. Only ever rendered for figures that genuinely appear in
 * the source documents — see `metric` on each achievement.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  display,
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Pre-formatted string that wins once the animation lands (e.g. "1,000"). */
  display?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setCurrent(value);
      setDone(true);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast out of the gate, settles gently on the number.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCurrent(value * eased);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);

  const rendered =
    done && display
      ? display
      : current.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
