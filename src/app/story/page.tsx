"use client";

import { useState } from "react";
import { SplashGate } from "@/components/Splash";

/**
 * Preview harness for the full intro — startup video, then the splash.
 *
 * Runs the real SplashGate rather than the two components directly, so what is
 * previewed here is exactly what the homepage does, phase timings included.
 * Replay remounts the gate, which restarts both acts without a page load.
 */
export default function IntroPreviewPage() {
  const [run, setRun] = useState(0);

  return (
    <SplashGate key={run}>
      <main className="flex min-h-screen items-center justify-center bg-background">
        <button
          onClick={() => setRun((n) => n + 1)}
          className="rounded-xl bg-[hsl(var(--glow-cyan))] px-5 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Replay intro
        </button>
      </main>
    </SplashGate>
  );
}
