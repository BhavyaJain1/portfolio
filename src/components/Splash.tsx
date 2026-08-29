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
import { StartupVideo, STARTUP_VIDEO_MS } from "@/components/StartupVideo";

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

/** The name-card sequence below. Its internal beats are paced to this exactly:
 *  the last one lands at ~2.85s, so nothing is cut mid-fill. */
const SPLASH_MS = 3000;
const TOTAL_MS = STARTUP_VIDEO_MS + SPLASH_MS;

const EASE = [0.16, 0.84, 0.44, 1] as const;

type Phase = "deciding" | "video" | "splash" | "done";

/**
 * Two acts, then the site.
 *
 *   video   the defect hunt over a page of failing tests — no branding
 *   splash  the mark, the typed name card, the progress bar, [ ok ]
 *
 * They are separate phases rather than one component because they carry
 * different jobs: the video is the story, the splash is the identity. Neither
 * should have to know about the other's timing.
 *
 * The intro runs on EVERY load. There was previously a sessionStorage guard
 * that showed it once per browser session; it is gone by request. The only
 * remaining skip is prefers-reduced-motion, which is an accessibility guard
 * rather than a "seen it already" one.
 */
export function SplashGate({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  // `deciding` = still on the first client paint. useReducedMotion resolves
  // on the client, so committing to a phase before then risks starting the
  // intro for someone who asked not to have it.
  const [phase, setPhase] = useState<Phase>("deciding");

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }
    setPhase("video");
    const toSplash = setTimeout(() => setPhase("splash"), STARTUP_VIDEO_MS);
    const toDone = setTimeout(() => setPhase("done"), TOTAL_MS);
    return () => {
      clearTimeout(toSplash);
      clearTimeout(toDone);
    };
  }, [reduced]);

  const value = useMemo(() => ({ done: phase === "done" }), [phase]);

  return (
    <SplashContext.Provider value={value}>
      <AnimatePresence>
        {phase === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
          >
            <StartupVideo />
          </motion.div>
        )}

        {/* Fades up over the outgoing video rather than cutting. The video ends
            on near-black; the splash sits on --background, which is near-white
            in light mode — a hard cut between the two would flash. */}
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeOut" } }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </SplashContext.Provider>
  );
}

/**
 * Act two — mark, typed name card, stepped progress, [ ok ] marker.
 *
 * Unchanged from the original splash and still paced to its own 3000ms window;
 * it simply runs after the startup video now instead of on its own.
 */
export function SplashScreen() {
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
