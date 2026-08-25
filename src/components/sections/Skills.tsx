"use client";

import { skills } from "@/data/resume";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Toolkit"
        title={
          <>
            Skills, <span className="text-gradient-accent">grouped</span>
          </>
        }
        description="Exactly as listed across the resume and LinkedIn profile."
      />

      <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.08}>
        {skills.map((group) => (
          <RevealItem key={group.name} className="h-full">
            <SpotlightCard
              className="h-full p-5 sm:p-6"
              spotlightColor={
                group.source === "linkedin"
                  ? "var(--glow-violet)"
                  : "var(--glow-cyan)"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  {group.name}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="hairline my-4" />

              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border/70 bg-[hsl(var(--muted)/0.45)] px-2.5 py-1.5 text-[0.8rem] text-muted-foreground transition-all duration-300 hover:border-[hsl(var(--glow-cyan)/0.45)] hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
