"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AnimatedBackground
 * ------------------
 * Three stacked layers, all non-interactive:
 *
 *   1. Base wash          — flat background colour.
 *   2. Soft gradient mesh — CSS radial blobs drifting on very long durations.
 *   3. Canvas field       — drifting particles with occasional faint links.
 *
 * Perf + a11y contract:
 *   - single requestAnimationFrame loop, cancelled on unmount
 *   - particle count derived from viewport area, hard-capped per breakpoint
 *   - device pixel ratio capped at 2 so retina phones don't push 3x the pixels
 *   - loop parks itself when the tab is hidden
 *   - prefers-reduced-motion → canvas never starts, mesh falls back to static
 *   - pointer-events: none throughout, so scroll and clicks pass straight through
 *
 * No external libraries — plain Canvas 2D.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Per-particle phase so opacity breathing isn't synchronised. */
  phase: number;
};

/** Viewport-aware particle budget. Mobile stays deliberately sparse. */
function particleBudget(w: number, h: number) {
  const areaBased = Math.round((w * h) / 26000);
  if (w < 640) return Math.min(areaBased, 22); // mobile
  if (w < 1024) return Math.min(areaBased, 36); // tablet
  return Math.min(areaBased, 58); // desktop
}

/**
 * Link distance. Kept deliberately short — long links start reading as a
 * "neural network" diagram rather than an ambient field.
 */
function linkDistance(w: number) {
  if (w < 640) return 78;
  if (w < 1024) return 96;
  return 112;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Track the reduced-motion preference live. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) return; // static gradient fallback only
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;

    /* Particle tint follows the active theme so the field stays low-contrast
       on both. Re-read whenever the `dark` class flips. */
    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const seed = () => {
      const count = particleBudget(width, height);
      const next: Particle[] = [];
      for (let i = 0; i < count; i++) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Slow drift — roughly 6–20 px/sec. Nothing that pulls the eye.
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.7,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = next;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    resize();

    let lastTime = performance.now();

    const draw = (now: number) => {
      if (!running) return;

      // Normalised delta keeps drift speed constant regardless of frame rate,
      // and clamps so a background tab returning doesn't teleport particles.
      const delta = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const maxLink = linkDistance(width);
      const maxLinkSq = maxLink * maxLink;

      // Cyan-leaning tint on dark, indigo on light. Alpha stays low by design.
      const dotRGB = isDark ? "125, 226, 255" : "43, 92, 145";
      const lineRGB = isDark ? "140, 190, 255" : "70, 100, 165";
      const dotAlpha = isDark ? 0.42 : 0.38;
      const lineAlphaMax = isDark ? 0.07 : 0.065;

      /* --- move --- */
      for (const p of particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.phase += 0.006 * delta;

        // Wrap around the edges rather than bouncing — reads as an endless field.
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      /* --- links (drawn under the dots) --- */
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > maxLinkSq) continue;

          // Fade the link out as the pair separates. Cubic falloff keeps all
          // but the very closest pairs invisible, which is the "occasional
          // faint line" the brief asks for rather than a constellation web.
          const t = 1 - distSq / maxLinkSq;
          const alpha = t * t * t * lineAlphaMax;
          if (alpha < 0.005) continue;

          ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* --- dots --- */
      for (const p of particles) {
        // Gentle opacity breathing so the field feels alive when still.
        const breathe = 0.72 + Math.sin(p.phase) * 0.28;
        ctx.fillStyle = `rgba(${dotRGB}, ${dotAlpha * breathe})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    /* Park the loop while the tab is hidden — no wasted frames. */
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!running) {
        running = true;
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    /* Debounced resize — reseeding on every resize event is wasteful. */
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 160);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* 2 — soft gradient mesh. Drift is pure CSS transform, so it is
             GPU-composited and costs the main thread nothing. The global
             reduced-motion rule in globals.css freezes these in place,
             which is exactly the required static-gradient fallback. */}
      <div className="absolute inset-0">
        <div className="mesh-blob mesh-blob--cyan" />
        <div className="mesh-blob mesh-blob--violet" />
        <div className="mesh-blob mesh-blob--deep" />
      </div>

      {/* 3 — particle field */}
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* 4 — vignette keeps text legible over the brighter mesh centres */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,hsl(var(--background)/0.55)_100%)]" />

      <style jsx>{`
        .mesh-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          will-change: transform;
        }
        .mesh-blob--cyan {
          top: -12%;
          left: -8%;
          width: 58vw;
          height: 58vw;
          min-width: 320px;
          min-height: 320px;
          background: radial-gradient(
            circle at 50% 50%,
            hsl(var(--glow-cyan) / 0.32),
            transparent 68%
          );
          animation: drift-a 34s ease-in-out infinite alternate;
        }
        .mesh-blob--violet {
          top: 18%;
          right: -14%;
          width: 62vw;
          height: 62vw;
          min-width: 340px;
          min-height: 340px;
          background: radial-gradient(
            circle at 50% 50%,
            hsl(var(--glow-violet) / 0.28),
            transparent 68%
          );
          animation: drift-b 42s ease-in-out infinite alternate;
        }
        .mesh-blob--deep {
          bottom: -22%;
          left: 22%;
          width: 54vw;
          height: 54vw;
          min-width: 300px;
          min-height: 300px;
          background: radial-gradient(
            circle at 50% 50%,
            hsl(var(--glow-violet) / 0.2),
            transparent 70%
          );
          animation: drift-c 38s ease-in-out infinite alternate;
        }

        @keyframes drift-a {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(8vw, 6vh, 0) scale(1.12);
          }
        }
        @keyframes drift-b {
          from {
            transform: translate3d(0, 0, 0) scale(1.06);
          }
          to {
            transform: translate3d(-7vw, 9vh, 0) scale(1);
          }
        }
        @keyframes drift-c {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(5vw, -7vh, 0) scale(1.15);
          }
        }

        /* Explicit belt-and-braces fallback: freeze the mesh entirely. */
        @media (prefers-reduced-motion: reduce) {
          .mesh-blob {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
