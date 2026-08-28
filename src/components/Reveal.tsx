"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Children enter once, when they scroll into view.
 *
 * Terminal motion contract: short, fast, and horizontal. Content slides in
 * from the left like a line of output being written, rather than drifting up
 * from below. 170ms with a hard ease-out reads as a machine committing a
 * result; the previous 600ms rise read as decoration and kept content
 * invisible long enough to be felt.
 *
 * Under prefers-reduced-motion everything renders immediately, no transform.
 */

const EASE = [0.16, 0.84, 0.44, 1] as const;
const DURATION = 0.17;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled on entry, in px. Horizontal under this theme. */
  x?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  x = 8,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-60px 0px -60px 0px" }}
      transition={{
        duration: reduced ? 0.15 : DURATION,
        delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its `RevealItem` children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.04,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, x: 8 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0.15 : DURATION, ease: EASE },
    },
  };

  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
