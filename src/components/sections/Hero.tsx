"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { achievements, basics, links, topImpactIds } from "@/data/resume";
import { useSplash } from "@/components/Splash";
import { Counter } from "@/components/Counter";
import { Button } from "@/components/ui/button";

const ICONS = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  phone: Mail,
  map: MapPin,
} as const;

export function Hero() {
  const { done } = useSplash();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Gentle parallax: content drifts up and fades as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  const top3 = topImpactIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // Hero content waits for the splash to clear, then plays in.
  const show = done;
  const ease = [0.21, 0.6, 0.35, 1] as const;

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 28 },
    animate: show ? { opacity: 1, y: 0 } : {},
    transition: { duration: reduced ? 0.3 : 0.75, delay, ease },
  });

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-28 sm:pb-16"
    >
      <motion.div style={{ y, opacity }} className="container">
        <div className="max-w-4xl">
          {/* Location chip */}
          <motion.div {...rise(0.05)}>
            <span className="eyebrow">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[hsl(var(--glow-cyan))] opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[hsl(var(--glow-cyan))]" />
              </span>
              {basics.locationShort}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            {...rise(0.14)}
            className="mt-6 text-balance text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            <span className="text-gradient">{basics.name}</span>
          </motion.h1>

          {/* Title */}
          <motion.p
            {...rise(0.24)}
            className="mt-4 text-lg font-medium tracking-tight text-muted-foreground sm:text-2xl"
          >
            {basics.title}
            <span className="mx-2.5 text-[hsl(var(--glow-cyan))]">/</span>
            <span className="text-[hsl(var(--glow-violet))]">
              {basics.yearsExperience} years
            </span>
          </motion.p>

          {/* Summary */}
          <motion.p
            {...rise(0.32)}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {basics.heroSummary}
          </motion.p>

          {/* CTAs */}
          <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById("experience")?.scrollIntoView({
                  behavior: reduced ? "auto" : "smooth",
                  block: "start",
                })
              }
            >
              View Experience
              <ArrowDown className="size-4" />
            </Button>

            <Button asChild size="lg" variant="glass">
              <Link href="/resume">
                <FileText className="size-4" />
                Download Resume
              </Link>
            </Button>
          </motion.div>

          {/* Links */}
          <motion.div {...rise(0.48)} className="mt-8 flex flex-wrap items-center gap-4">
            {links.map((link) => {
              const Icon = ICONS[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.icon === "mail" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[hsl(var(--glow-cyan))] focus-ring rounded-full"
                >
                  <Icon className="size-4" />
                  <span className="border-b border-transparent pb-px transition-colors group-hover:border-[hsl(var(--glow-cyan)/0.5)]">
                    {link.display}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </div>

        {/* ---- Top 3 Impact strip — above the fold, resume data only ---- */}
        <motion.div
          {...rise(0.58)}
          id="impact"
          className="mt-12 grid scroll-mt-24 grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-3"
        >
          {top3.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl p-4 transition-colors duration-300 hover:border-[hsl(var(--glow-cyan)/0.35)] sm:p-5"
            >
              <div className="font-mono text-2xl font-bold text-gradient-accent sm:text-3xl">
                {item.metric ? (
                  <Counter
                    value={item.metric.value}
                    prefix={item.metric.prefix}
                    suffix={item.metric.suffix}
                    display={item.metric.display}
                  />
                ) : (
                  "—"
                )}
              </div>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.metric?.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center lg:flex"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5 text-muted-foreground"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.25em]">Scroll</span>
          <ArrowDown className="size-3.5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
