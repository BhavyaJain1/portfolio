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

/**
 * Splash / intro gate.
 *
 * Runs ~1.6s on a cold load: animated wordmark drawn from the first name, a
 * progress bar, then a cinematic wipe into the hero. Replays are suppressed
 * for the rest of the browser session so returning from /resume is instant.
 * Under prefers-reduced-motion the whole thing is skipped.
 */

const SplashContext = createContext<{ done: boolean }>({ done: true });

export const useSplash = () => useContext(SplashContext);

const SESSION_KEY = "bj-splash-seen";

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
    }, 1600);
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
  // First name rather than the nav's compact monogram — the splash has room.
  const letters = basics.name.split(" ")[0].split("");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.06,
        filter: "blur(12px)",
        transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] },
      }}
    >
      {/* Faint mesh so the splash shares the site's palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(var(--glow-cyan)/0.16),transparent_60%)]"
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Monogram */}
        <div className="relative">
          <motion.div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--glow-cyan) / 0.28), transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0.7], scale: [0.6, 1.15, 1] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <div className="relative flex items-center">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="text-6xl font-bold tracking-tight text-gradient sm:text-7xl"
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.09,
                  ease: [0.21, 0.6, 0.35, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Sweeping underline */}
          <motion.div
            className="mt-2 h-px w-full origin-left bg-[linear-gradient(90deg,transparent,hsl(var(--glow-cyan)),hsl(var(--glow-violet)),transparent)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          />
        </div>

        {/* Progress bar */}
        <div className="h-[3px] w-44 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--glow-cyan)),hsl(var(--glow-violet)))]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.25, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <motion.p
          className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {basics.title}
        </motion.p>
      </div>
    </motion.div>
  );
}
