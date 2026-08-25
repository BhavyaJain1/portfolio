"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Crown, Trophy, Zap } from "lucide-react";
import { achievements, type Achievement } from "@/data/resume";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { cn } from "@/lib/utils";

type GroupKey = Achievement["group"];

const GROUPS: {
  key: GroupKey;
  label: string;
  icon: typeof Trophy;
  color: string;
}[] = [
  { key: "metrics", label: "Metrics", icon: Zap, color: "var(--glow-cyan)" },
  { key: "wins", label: "Wins", icon: Trophy, color: "var(--glow-violet)" },
  { key: "leadership", label: "Leadership", icon: Crown, color: "var(--glow-cyan)" },
  { key: "awards", label: "Awards & Certifications", icon: Award, color: "var(--glow-violet)" },
];

const FILTERS = [{ key: "all" as const, label: "All" }, ...GROUPS.map((g) => ({ key: g.key, label: g.label }))];

export function Achievements() {
  const [filter, setFilter] = useState<GroupKey | "all">("all");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () =>
      filter === "all"
        ? achievements
        : achievements.filter((a) => a.group === filter),
    [filter]
  );

  return (
    <Section id="achievements">
      <SectionHeading
        eyebrow="Achievements"
        title={
          <>
            Results that <span className="text-gradient-accent">moved numbers</span>
          </>
        }
        description="Every figure below is taken directly from the resume — grouped by the kind of impact it represents."
      />

      {/* Filter chips */}
      <Reveal className="mb-8 sm:mb-10">
        <div
          role="tablist"
          aria-label="Filter achievements"
          className="-mx-1 flex snap-x-carousel gap-2 overflow-x-auto px-1 pb-1"
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            const count =
              f.key === "all"
                ? achievements.length
                : achievements.filter((a) => a.group === f.key).length;

            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors focus-ring",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="achievement-filter"
                    className="absolute inset-0 rounded-full glass"
                    style={{
                      borderColor: "hsl(var(--glow-cyan) / 0.4)",
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {f.label}
                  <span className="font-mono text-[0.7rem] opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/*
        Mobile → horizontal snap carousel (swipeable).
        sm+     → responsive grid.
      */}
      <motion.div
        layout={!reduced}
        className={cn(
          "-mx-5 flex snap-x-carousel gap-4 overflow-x-auto px-5 pb-4",
          "sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0",
          "lg:grid-cols-3"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, index) => (
            <motion.div
              key={item.id}
              layout={!reduced}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : Math.min(index * 0.04, 0.3),
                ease: [0.21, 0.6, 0.35, 1],
              }}
              className="w-[78vw] shrink-0 snap-item xs:w-[70vw] sm:w-auto"
            >
              <AchievementCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Swipe affordance, mobile only */}
      <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">
        Swipe to explore →
      </p>
    </Section>
  );
}

function AchievementCard({ item }: { item: Achievement }) {
  const group = GROUPS.find((g) => g.key === item.group)!;
  const Icon = group.icon;

  return (
    <SpotlightCard
      className="flex h-full flex-col p-5 sm:p-6"
      spotlightColor={group.color}
    >
      {/* Trophy plinth: icon + group tag */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `hsl(${group.color} / 0.13)`,
            color: `hsl(${group.color})`,
            boxShadow: `0 0 24px -8px hsl(${group.color} / 0.6)`,
          }}
        >
          <Icon className="size-5" />
        </span>

        <span className="rounded-full border border-border/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          {group.label}
        </span>
      </div>

      {/* Counter — only when the source document states a figure */}
      {item.metric && (
        <div className="mt-5">
          <div
            className="font-mono text-4xl font-bold leading-none sm:text-[2.75rem]"
            style={{ color: `hsl(${group.color})` }}
          >
            <Counter
              value={item.metric.value}
              prefix={item.metric.prefix}
              suffix={item.metric.suffix}
              display={item.metric.display}
              decimals={Number.isInteger(item.metric.value) ? 0 : 1}
            />
          </div>
          <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            {item.metric.label}
          </p>
        </div>
      )}

      <h3
        className={cn(
          "text-balance text-base font-semibold leading-snug tracking-tight",
          item.metric ? "mt-4" : "mt-5"
        )}
      >
        {item.title}
      </h3>

      <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
        {item.context}
      </p>
    </SpotlightCard>
  );
}
