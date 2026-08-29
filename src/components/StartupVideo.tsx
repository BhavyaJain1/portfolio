"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Startup video — the defect hunt.
 *
 * Full-bleed, no chrome, over a page of failing test code. Four beats in 4.6s:
 *
 *   0.15s  a red defect fades up in the bottom-left corner and crawls a
 *          deliberate curve across the code toward the top-right, leaving a
 *          trail behind it
 *   1.70s  the scanner converges — it drops in oversized and tightens onto
 *          the target while the crawl is still running
 *   3.05s  lock. The crawl stops dead, mid-path
 *   3.35s  the defect is destroyed — flash, fragments scatter, shock ring.
 *          Destroyed, not corrected: nothing turns green, nothing gets a tick
 *
 * Then it hands over to SplashScreen for the mark, the name card and the
 * progress bar. This video deliberately carries no branding of its own.
 *
 * The whole timeline is CSS keyframes inside one SVG, driven by nothing but
 * animation-delay. The earlier React version ticked a `time` state every 50ms
 * and rebuilt Framer Motion's `animate` target on each tick, which restarted
 * the keyframe animation before it could finish — the bug never reached its
 * fourth keyframe. There is no render loop here to lose that race with.
 *
 * The scene is one SVG on a 160x90 viewBox. Every coordinate below is in those
 * user units, so nothing depends on pixel dimensions.
 *
 * `meet`, not `slice`. Slice fills the screen but crops to cover — into a
 * portrait viewport it cut roughly half the width, which swallowed the entire
 * bottom-left half of the crawl. Meet letterboxes instead, so the full diagonal
 * survives at every aspect ratio, at the cost of a scene that is centred rather
 * than edge-to-edge on unusual shapes. The letterbox bands are invisible only
 * because the backdrop — fill, dot grid, vignette — is painted on the container
 * div rather than inside the viewBox; painted inside, it would stop at the band
 * edges and draw the very seams the letterbox is meant to hide.
 *
 * The bug and the effects both ride the SAME `offset-path`, with the same
 * distance timing — the bug with `offset-rotate: auto` so it faces its
 * direction of travel, the effects with a fixed rotation so the reticle and
 * fragments stay upright. That coupling is why the scanner lands exactly on
 * the target with no hand-tuned coordinates to drift out of sync.
 *
 * Class names are prefixed `bjv-`. A <style> block inside inline SVG is NOT
 * scoped — it leaks into the document — so bare names like `.leg` would
 * collide with LogoShield's globals.css rules.
 */

/**
 * Total run length, and the single knob for the whole pace. SplashGate reads it
 * for its own phase timer. Changing this does NOT rescale the beats below —
 * they are absolute animation-delays, so shortening it would cut the sequence
 * off mid-flight.
 *
 * Ends just after the debris settles. The mark and the name card are the
 * splash's job, not this video's — it hands straight over to them.
 */
export const STARTUP_VIDEO_MS = 4600;

/**
 * The field the defect crawls over.
 *
 * This is the whole reason the sequence reads as a *bug* rather than an insect:
 * a defect only means anything on top of code. It is a real-shaped Playwright
 * suite against the grain-grading API, and the assertion the bug is sitting on
 * is the one that fails.
 */
const CODE = `import { test, expect, request } from '@playwright/test';
import { gradingPayload, tokenFor } from '../fixtures/agri';

test.describe('Agri AI Collect — grain grading', () => {
  let api;

  test.beforeEach(async ({ playwright }) => {
    api = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: { Authorization: tokenFor('qa-runner') },
    });
  });

  test('returns a schema-valid grade for a clean sample', async () => {
    const res = await api.get('/v2/grain-grading/sample-4417');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toMatchObject({
      sampleId: expect.any(String),
      moisture: expect.any(Number),
      foreignMatter: expect.any(Number),
    });
    expect(body.grade).toBeOneOf(['A', 'B', 'C']);
  });

  test('rejects a payload with no moisture reading', async () => {
    const res = await api.post('/v2/grain-grading', {
      data: { ...gradingPayload, moisture: null },
    });
    expect(res.status()).toBe(422);
    expect(await res.json()).toHaveProperty('errors.moisture');
  });

  test('advisory falls back when the model times out', async () => {
    await api.post('/v2/_test/latency', { data: { ms: 9000 } });
    const res = await api.get('/v2/crop-advisory/plot-882');

    expect(res.status()).toBe(200);
    expect((await res.json()).source).toBe('cached');
  });

  test('grade histogram totals match the sample count', async () => {
    const res = await api.get('/v2/grain-grading/histogram?window=7d');
    const { buckets, total } = await res.json();

    const summed = buckets.reduce((n, b) => n + b.count, 0);
    expect(summed).toBe(total);
  });

  test('paginates without dropping or repeating rows', async () => {
    const seen = new Set();
    let cursor = null;

    for (let page = 0; page < 5; page++) {
      const res = await api.get('/v2/grain-grading', { params: { cursor } });
      const { rows, next } = await res.json();

      rows.forEach((r) => expect(seen.has(r.id)).toBe(false));
      rows.forEach((r) => seen.add(r.id));
      cursor = next;
    }
    expect(seen.size).toBe(100);
  });
});

test.describe('Collect — field capture UI', () => {
  test('submits a reading while offline and syncs on reconnect', async ({ page, context }) => {
    await page.goto('/collect/plot-882');
    await context.setOffline(true);

    await page.getByLabel('Moisture %').fill('13.4');
    await page.getByRole('button', { name: 'Save reading' }).click();
    await expect(page.getByText('Queued — will sync')).toBeVisible();

    await context.setOffline(false);
    await expect(page.getByText('Synced')).toBeVisible({ timeout: 15000 });
  });

  test('blocks submission when the plot has no crop assigned', async ({ page }) => {
    await page.goto('/collect/plot-000');

    const save = page.getByRole('button', { name: 'Save reading' });
    await expect(save).toBeDisabled();
    await expect(page.getByRole('alert')).toContainText('Assign a crop first');
  });

  test('advisory card renders the model confidence band', async ({ page }) => {
    await page.goto('/advisory/plot-882');

    const band = page.getByTestId('confidence-band');
    await expect(band).toBeVisible();
    await expect(band).toHaveAttribute('data-level', /high|medium|low/);
  });
});`.split("\n");

/** Keywords, strings, comments, numbers — enough to read as code, no more. */
const TOKENS =
  /(\/\/[^\n]*)|('[^']*')|(\b(?:import|from|const|let|await|async|test|expect|describe|beforeEach|process|return|new|null|true|false)\b)|(\b\d+\b)/g;

function highlight(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKENS.lastIndex = 0;
  while ((m = TOKENS.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1]
      ? "text-slate-700"
      : m[2]
      ? "text-emerald-300"
      : m[3]
      ? "text-cyan-300"
      : "text-indigo-300";
    out.push(
      <span key={`${m.index}`} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function StartupVideo({ onComplete }: { onComplete?: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!onComplete) return;
    // Reduced motion gets no video at all — hand off immediately.
    if (reduced) {
      onComplete();
      return;
    }
    const t = setTimeout(onComplete, STARTUP_VIDEO_MS);
    return () => clearTimeout(t);
  }, [onComplete, reduced]);

  if (reduced) return null;

  return (
    // Hard #030712 in both themes — this is a cinematic beat, not a themed
    // surface, and every colour inside it is literal for the same reason.
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#030712]">
      {/* The code field the defect crawls over.

          It lives on the container rather than inside the viewBox on purpose.
          Under `meet` the SVG is letterboxed, and anything painted inside the
          viewBox would stop at the band edges — drawing exactly the horizontal
          seams the letterbox exists to hide. On the container it runs edge to
          edge at any aspect ratio. */}
      <pre
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre p-6 font-mono text-[11px] leading-[1.5] text-slate-500 opacity-[0.28] sm:p-10 sm:text-[12px]"
      >
        {CODE.map((line, i) => (
          <div key={i}>{highlight(line) as React.ReactNode[]}</div>
        ))}
      </pre>

      {/* Scrim — the code has to read as code without competing with the bug
          for attention. Darkest in the middle, where the action happens. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(3,7,18,0.86) 0%, rgba(3,7,18,0.45) 55%, rgba(3,7,18,0.2) 100%)",
        }}
      />

      <svg
        viewBox="0 0 160 90"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label="Defect detected and eliminated"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* A flat fill gave the detonation a hard circular edge that read as
              a pink disc laid over the scene. The falloff makes it a burst. */}
          <radialGradient id="bjvFlash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#fecaca" stopOpacity="0.42" />
            <stop offset="65%" stopColor="#ef4444" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <style>{`
            /* ── beat 1: the crawl ───────────────────────────────────────
               Both travel groups share this path and this timing, so the
               effects sit exactly on the bug without any tuned offsets.
               Linear: a walk holds its pace, it does not ease.            */
            .bjv-travel {
              offset-path: path("M 4 88 C 32 82, 52 64, 78 52 C 104 40, 128 24, 158 10");
              offset-distance: 0%;
              animation: bjv-crawl 2.9s linear 0.15s forwards;
            }
            .bjv-travel--facing { offset-rotate: auto; }
            .bjv-travel--upright { offset-rotate: 0deg; }
            @keyframes bjv-crawl { to { offset-distance: 52%; } }

            /* The trail draws in step with the crawl. pathLength="100"
               normalises the geometry so the dash maths is just percent. */
            .bjv-trail {
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
              animation:
                bjv-trail-draw 2.9s linear 0.15s forwards,
                bjv-fade-out 0.5s ease-out 3.9s forwards;
            }
            @keyframes bjv-trail-draw { to { stroke-dashoffset: 48; } }

            /* ── the gait ────────────────────────────────────────────────
               Alternating tripod, same construction as the shield mark:
               stance is linear and long, swing is eased and short. The
               asymmetry is what reads as walking rather than waving.
               Stops at lock — 5.8 cycles of 0.5s from 0.15s ends at 3.05s. */
            @keyframes bjv-stride-a {
              0%   { transform: rotate(9deg);  animation-timing-function: linear; }
              62%  { transform: rotate(-8deg); animation-timing-function: cubic-bezier(0.35, 0, 0.2, 1); }
              100% { transform: rotate(9deg); }
            }
            @keyframes bjv-stride-b {
              0%   { transform: rotate(-9deg); animation-timing-function: linear; }
              62%  { transform: rotate(8deg);  animation-timing-function: cubic-bezier(0.35, 0, 0.2, 1); }
              100% { transform: rotate(-9deg); }
            }
            .bjv-leg {
              animation-duration: 0.5s;
              animation-delay: 0.15s;
              animation-iteration-count: 5.8;
              animation-fill-mode: both;
            }
            /* Tripod A: front-top, mid-bottom, hind-top */
            .bjv-leg-ft { transform-origin: 3.5px -3.2px; animation-name: bjv-stride-a; }
            .bjv-leg-mb { transform-origin: -1px 4.3px;   animation-name: bjv-stride-b; }
            .bjv-leg-ht { transform-origin: -5.5px -3.2px; animation-name: bjv-stride-a; }
            /* Tripod B: half a cycle out of phase */
            .bjv-leg-fb { transform-origin: 3.5px 3.2px;   animation-name: bjv-stride-b; animation-delay: -0.1s; }
            .bjv-leg-mt { transform-origin: -1px -4.3px;   animation-name: bjv-stride-a; animation-delay: -0.1s; }
            .bjv-leg-hb { transform-origin: -5.5px 3.2px;  animation-name: bjv-stride-b; animation-delay: -0.1s; }

            .bjv-antenna-t { transform-origin: 7.5px -1.5px; animation: bjv-feel-t 1.3s ease-in-out 0.15s 2.2; }
            .bjv-antenna-b { transform-origin: 7.5px 1.5px;  animation: bjv-feel-b 1.1s ease-in-out 0.15s 2.6; }
            @keyframes bjv-feel-t {
              0%, 100% { transform: rotate(0deg); } 40% { transform: rotate(-7deg); } 70% { transform: rotate(4deg); }
            }
            @keyframes bjv-feel-b {
              0%, 100% { transform: rotate(0deg); } 45% { transform: rotate(7deg); } 75% { transform: rotate(-4deg); }
            }

            /* ── beat 2: acquisition ─────────────────────────────────────
               Already locked positionally; the drop from 3x sells the
               convergence.                                               */
            .bjv-reticle {
              opacity: 0;
              transform-origin: 0 0;
              animation:
                bjv-acquire 1.15s cubic-bezier(0.22, 1, 0.36, 1) 1.7s forwards,
                bjv-lock 0.2s ease-out 2.9s forwards,
                bjv-fade-out 0.35s ease-out 4.05s forwards;
            }
            @keyframes bjv-acquire {
              from { opacity: 0; transform: scale(3) rotate(-25deg); }
              to   { opacity: 1; transform: scale(1) rotate(0deg); }
            }
            @keyframes bjv-lock {
              from { transform: scale(1); }
              to   { transform: scale(0.86); }
            }
            .bjv-reticle-spin { transform-origin: 0 0; animation: bjv-spin 5s linear infinite; }
            @keyframes bjv-spin { to { transform: rotate(360deg); } }

            /* Lock ticks snap in at the moment the crawl stops. */
            .bjv-tick { opacity: 0; animation: bjv-tick-in 0.16s ease-out 2.95s forwards, bjv-fade-out 0.3s ease-out 4.05s forwards; }
            @keyframes bjv-tick-in { from { opacity: 0; } to { opacity: 1; } }

            /* ── beat 4: destruction ─────────────────────────────────────
               The bug does not turn green and it does not get a check. It
               flares white, collapses, and comes apart.                   */
            /* Materialise rather than pop — the path starts inside the frame so
               the crawl is on screen immediately at any aspect ratio, which
               means there is no offscreen approach to hide the entrance. */
            .bjv-bug {
              animation:
                bjv-enter 0.35s ease-out 0.15s both,
                bjv-destroy 0.34s cubic-bezier(0.5, 0, 0.9, 0.4) 3.35s forwards;
            }
            @keyframes bjv-enter { from { opacity: 0; } to { opacity: 1; } }
            @keyframes bjv-destroy {
              0%   { opacity: 1; transform: scale(1); filter: brightness(1); }
              22%  { opacity: 1; transform: scale(1.22); filter: brightness(6) saturate(0); }
              100% { opacity: 0; transform: scale(0.3); filter: brightness(3); }
            }

            .bjv-shard {
              opacity: 0;
              animation: bjv-shard-fly 0.85s cubic-bezier(0.15, 0.7, 0.3, 1) 3.42s forwards;
            }
            @keyframes bjv-shard-fly {
              0%   { opacity: 1; transform: translate(0px, 0px) scale(1); }
              100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.15); }
            }

            .bjv-shock {
              opacity: 0;
              transform-origin: 0 0;
              animation: bjv-shock-out 0.7s cubic-bezier(0.1, 0.8, 0.2, 1) 3.4s forwards;
            }
            @keyframes bjv-shock-out {
              0%   { opacity: 0.9; transform: scale(0.15); }
              100% { opacity: 0; transform: scale(3.4); }
            }

            .bjv-flash {
              opacity: 0;
              animation: bjv-flash-pop 0.5s ease-out 3.38s forwards;
            }
            @keyframes bjv-flash-pop {
              0%  { opacity: 0.5; }
              100% { opacity: 0; }
            }

            @keyframes bjv-fade-out { to { opacity: 0; } }
          `}</style>
        </defs>

        {/* The route travelled, drawn in behind the bug */}
        <path
          className="bjv-trail"
          pathLength="100"
          d="M 4 88 C 32 82, 52 64, 78 52 C 104 40, 128 24, 158 10"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.4"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* ── The defect ───────────────────────────────────────────────
            Drawn head-first along +x and centred on its own origin, so
            `offset-rotate: auto` points it down the path and the group's
            origin is what rides the curve. */}
        <g className="bjv-travel bjv-travel--facing">
          <g className="bjv-bug" stroke="#ef4444" fill="none" strokeLinecap="round">
            {/* Legs — three pairs, alternating tripod */}
            <path className="bjv-leg bjv-leg-ft" d="M 3.5 -3.2 Q 6.5 -6.5 5 -9" strokeWidth="0.75" strokeOpacity="0.85" />
            <path className="bjv-leg bjv-leg-fb" d="M 3.5 3.2 Q 6.5 6.5 5 9" strokeWidth="0.75" strokeOpacity="0.85" />
            <path className="bjv-leg bjv-leg-mt" d="M -1 -4.3 Q -1.5 -8 -3.5 -9.5" strokeWidth="0.75" strokeOpacity="0.85" />
            <path className="bjv-leg bjv-leg-mb" d="M -1 4.3 Q -1.5 8 -3.5 9.5" strokeWidth="0.75" strokeOpacity="0.85" />
            <path className="bjv-leg bjv-leg-ht" d="M -5.5 -3.2 Q -8.5 -6.5 -10.5 -8" strokeWidth="0.75" strokeOpacity="0.85" />
            <path className="bjv-leg bjv-leg-hb" d="M -5.5 3.2 Q -8.5 6.5 -10.5 8" strokeWidth="0.75" strokeOpacity="0.85" />

            {/* Antennae */}
            <path className="bjv-antenna-t" d="M 7.5 -1.5 Q 11 -4 13.5 -3" strokeWidth="0.7" />
            <path className="bjv-antenna-b" d="M 7.5 1.5 Q 11 4 13.5 3" strokeWidth="0.7" />

            {/* Head, carapace, segment line */}
            <circle cx="6" cy="0" r="2.6" fill="#1a0508" strokeWidth="0.8" />
            <ellipse cx="-1.2" cy="0" rx="6.4" ry="4.4" fill="#1a0508" strokeWidth="0.9" />
            <path d="M 4 0 L -6.8 0" strokeWidth="0.6" strokeOpacity="0.8" />
          </g>
        </g>

        {/* ── Scanner and destruction ──────────────────────────────────
            Same path, same timing, no rotation — so these stay upright
            while sitting exactly on the target. */}
        <g className="bjv-travel bjv-travel--upright">
          {/* Detonation flash */}
          <circle className="bjv-flash" cx="0" cy="0" r="30" fill="url(#bjvFlash)" />

          {/* Shock ring */}
          <circle
            className="bjv-shock"
            cx="0"
            cy="0"
            r="9"
            fill="none"
            stroke="#f87171"
            strokeWidth="1.2"
          />

          {/* Fragments — ten, each thrown on its own vector. Two brightnesses
              so the debris field has some depth rather than reading as one
              uniform spray. */}
          <g>
            <rect className="bjv-shard" fill="#fecaca" style={{ "--dx": "19px", "--dy": "-7px" } as React.CSSProperties} x="-1.2" y="-1.2" width="2.4" height="2.4" rx="0.5" />
            <rect className="bjv-shard" fill="#f87171" style={{ "--dx": "13px", "--dy": "13px" } as React.CSSProperties} x="-0.95" y="-0.95" width="1.9" height="1.9" rx="0.4" />
            <rect className="bjv-shard" fill="#ef4444" style={{ "--dx": "-4px", "--dy": "20px" } as React.CSSProperties} x="-1.05" y="-1.05" width="2.1" height="2.1" rx="0.45" />
            <rect className="bjv-shard" fill="#f87171" style={{ "--dx": "-16px", "--dy": "10px" } as React.CSSProperties} x="-0.8" y="-0.8" width="1.6" height="1.6" rx="0.35" />
            <rect className="bjv-shard" fill="#fecaca" style={{ "--dx": "-20px", "--dy": "-6px" } as React.CSSProperties} x="-1.1" y="-1.1" width="2.2" height="2.2" rx="0.45" />
            <rect className="bjv-shard" fill="#ef4444" style={{ "--dx": "-10px", "--dy": "-16px" } as React.CSSProperties} x="-0.9" y="-0.9" width="1.8" height="1.8" rx="0.4" />
            <rect className="bjv-shard" fill="#f87171" style={{ "--dx": "5px", "--dy": "-21px" } as React.CSSProperties} x="-0.95" y="-0.95" width="1.9" height="1.9" rx="0.4" />
            <rect className="bjv-shard" fill="#ef4444" style={{ "--dx": "22px", "--dy": "4px" } as React.CSSProperties} x="-0.7" y="-0.7" width="1.4" height="1.4" rx="0.3" />
            <rect className="bjv-shard" fill="#fecaca" style={{ "--dx": "-13px", "--dy": "-19px" } as React.CSSProperties} x="-0.75" y="-0.75" width="1.5" height="1.5" rx="0.35" />
            <rect className="bjv-shard" fill="#f87171" style={{ "--dx": "16px", "--dy": "-17px" } as React.CSSProperties} x="-0.85" y="-0.85" width="1.7" height="1.7" rx="0.35" />
          </g>

          {/* Reticle */}
          <g className="bjv-reticle">
            <g className="bjv-reticle-spin">
              <circle
                cx="0"
                cy="0"
                r="13"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.5"
                strokeDasharray="3 2.5"
              />
            </g>
            <circle cx="0" cy="0" r="9" fill="none" stroke="#6366f1" strokeWidth="0.35" strokeOpacity="0.7" />
            <circle cx="0" cy="0" r="13" fill="#06b6d4" fillOpacity="0.05" />

            {/* Crosshair arms, held off the centre so the target stays clear */}
            <g stroke="#06b6d4" strokeWidth="0.4" strokeLinecap="round">
              <path d="M -19 0 L -11 0" />
              <path d="M 19 0 L 11 0" />
              <path d="M 0 -19 L 0 -11" />
              <path d="M 0 19 L 0 11" />
            </g>

            {/* Corner brackets — snap in on lock */}
            <g className="bjv-tick" stroke="#ef4444" strokeWidth="0.6" strokeLinecap="round" fill="none">
              <path d="M -9 -6 L -9 -9 L -6 -9" />
              <path d="M 9 -6 L 9 -9 L 6 -9" />
              <path d="M -9 6 L -9 9 L -6 9" />
              <path d="M 9 6 L 9 9 L 6 9" />
            </g>
          </g>
        </g>

      </svg>

      {/* Vignette, on the container rather than the viewBox — same reason as
          the grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />

    </div>
  );
}
