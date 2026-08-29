"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { basics } from "@/data/resume";
import { Logo } from "@/components/Logo";

/**
 * Splash / intro gate.
 *
 * Terminal treatment: a run starting, not a logo animating. A prompt line, the
 * first name written a character at a time, a stepped progress bar, then a pass
 * marker — all monospace, all snappy.
 *
 * Cut from 1600ms to 1100ms. The splash earns its place by setting the theme in
 * one beat; past about a second it stops being an entrance and starts being a
 * wait, and the person on the other side is usually a recruiter with a stack of
 * tabs open.
 *
 * Replays stay suppressed for the rest of the browser session so returning from
 * /resume is instant. Under prefers-reduced-motion it is skipped entirely.
 */

const SplashContext = createContext<{ done: boolean }>({ done: true });

export const useSplash = () => useContext(SplashContext);

const SESSION_KEY = "bj-splash-seen";
const DURATION_MS = 1100;
const EASE = [0.16, 0.84, 0.44, 1] as const;

export function SplashGate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  // `null` = still deciding (first client paint), avoids a flash of the splash
  // for users who have already seen it.
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    if (seen || reduced) {
      setShow(false);
      return;
    }
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, [reduced]);

  const value = useMemo(() => ({ done: show === false }), [show]);

  return (
    <SplashContext.Provider value={value}>
      <AnimatePresence>{show && <SplashScreen key="splash" />}</AnimatePresence>
      {children}
    </SplashContext.Provider>
  );
}

function SplashScreen() {
  const letters = basics.name.split(" ")[0].split("");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeOut" } }}
    >
      <div
        aria-hidden="true"
        className="grid-field pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative flex flex-col items-start gap-3 font-mono">
        {/* Brand mark. oneShot so the assertion check draws and holds inside
            the 1100ms window rather than looping back to empty. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <Logo oneShot className="size-16 sm:size-20" />
        </motion.div>

        <motion.p
          className="text-xs text-muted-foreground sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12, delay: 0.1 }}
        >
          <span className="text-[hsl(var(--glow-cyan))]">$</span> init --profile
        </motion.p>

        {/* Wordmark, written one character at a time */}
        <div className="flex items-center">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="text-4xl font-bold tracking-tight text-[hsl(var(--glow-cyan))] sm:text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05, delay: 0.12 + i * 0.045 }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            aria-hidden="true"
            className="ml-1 inline-block h-8 w-[10px] bg-[hsl(var(--glow-violet))] sm:h-10"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              times: [0, 0.5, 0.5, 1],
            }}
          />
        </div>

        {/* Stepped progress — blocks land discretely, like a task queue */}
        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-4 bg-[hsl(var(--glow-cyan))]"
              initial={{ opacity: 0.12 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.06, delay: 0.2 + i * 0.055 }}
            />
          ))}
        </div>

        <motion.p
          className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.2, ease: EASE }}
        >
          <span className="text-[hsl(var(--glow-cyan))]">[ ok ]</span>{" "}
          {basics.title}
        </motion.p>
      </div>
    </motion.div>
  );
}
