"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy. Returns the id of the section currently occupying the reading
 * band of the viewport. Uses IntersectionObserver rather than scroll maths so
 * it stays cheap on mobile.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    // Track ratios for every observed section and pick the strongest each tick.
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        let best = "";
        let bestRatio = 0;
        Object.keys(ratios).forEach((id) => {
          if (ratios[id] > bestRatio) {
            best = id;
            bestRatio = ratios[id];
          }
        });
        if (best) setActive(best);
      },
      {
        // Band roughly spanning the middle of the viewport.
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Pin the first section while the user is at the very top of the page.
    const onScroll = () => {
      if (window.scrollY < 80) setActive(ids[0]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
