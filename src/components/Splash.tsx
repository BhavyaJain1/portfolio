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
import { LogoShield } from "@/components/LogoShield";

/**
 * Splash / intro gate.
 *
 * Terminal treatment: a run starting, not a logo animating. Three beats over
 * 3000ms, deliberately unhurried:
 *
 *   0.0s  the shield mark alone, held for a full second so the crawl gait is
 *         read rather than glimpsed
 *   1.0s  the name card — prompt line, then the first name written a character
 *         at a time, finishing at ~1.6s
 *   1.75s stepped progress below the card, last block landing at ~2.6s
 *   2.6s  the [ ok ] pass marker
 *   3.0s  wipe
 *
 * Everything completes before the wipe; nothing is cut mid-fill. The trade is
 * real — three seconds is a long hold for a recruiter with a stack of tabs —
 * but the mark is the point of the splash, so it gets the room to land.
 *
 * Replays stay suppressed for the rest of the browser session so returning from
 * /resume is instant. Under prefers-reduced-motion it is skipped entirely.
 */

const SplashContext = createContext<{ done: boolean }>({ done: true });

export const useSplash = () => useContext(SplashContext);

const SESSION_KEY = "bj-splash-seen";
const DURATION_MS = 3000;
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

      <div className="relative flex flex-col items-center gap-7 font-mono">
        {/* Beat 1 — the mark alone. It holds on its own for most of a second
            before anything else arrives, so the crawl gait is actually read
            rather than glimpsed. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <LogoShield className="w-36 sm:w-44" />
        </motion.div>

        {/* Beat 2 — the name card. */}
        <motion.div
          className="glass flex flex-col items-center rounded-lg px-7 py-5 sm:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 1.0, ease: EASE }}
        >
          <p className="text-xs text-muted-foreground sm:text-sm">
            <span className="text-[hsl(var(--glow-cyan))]">$</span> init --profile
          </p>

          {/* Written one character at a time, paced to finish before the bar */}
          <div className="mt-2 flex items-center">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="text-4xl font-bold tracking-tight text-[hsl(var(--glow-cyan))] sm:text-5xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.06, delay: 1.2 + i * 0.07 }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              aria-hidden="true"
              className="ml-1 inline-block h-8 w-[10px] bg-[hsl(var(--glow-violet))] sm:h-10"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                times: [0, 0.5, 0.5, 1],
              }}
            />
          </div>
        </motion.div>

        {/* Beat 3 — stepped progress below the card. Blocks land discretely,
            like a task queue draining, and the last one lands at ~2.6s so the
            bar completes before the wipe rather than being cut mid-fill. */}
        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 w-4 bg-[hsl(var(--glow-cyan))]"
              initial={{ opacity: 0.12 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.08, delay: 1.75 + i * 0.07 }}
            />
          ))}
        </div>

        <motion.p
          className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.25, ease: EASE }}
        >
          <span className="text-[hsl(var(--glow-cyan))]">[ ok ]</span>{" "}
          {basics.title}
        </motion.p>
      </div>
    </motion.div>
  );
}
