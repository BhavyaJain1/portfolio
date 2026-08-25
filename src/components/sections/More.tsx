"use client";

import { FileText, Info, Linkedin } from "lucide-react";
import { basics, extra } from "@/data/resume";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";

/**
 * "Additional" section.
 *
 * Holds the two full-length summaries verbatim (the hero only shows a
 * condensed line) plus every source line that didn't map cleanly onto a
 * section — chiefly places where the resume and the LinkedIn export disagree
 * on titles, dates or spelling. Nothing is dropped or guessed at.
 */
export function More() {
  return (
    <Section id="more">
      <SectionHeading
        eyebrow="Additional"
        title={
          <>
            Everything <span className="text-gradient-accent">else</span>
          </>
        }
        description="Full summaries as written, plus the details where the resume and LinkedIn profile differ — recorded rather than resolved."
      />

      {/* Full summaries */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <SpotlightCard className="h-full p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--glow-cyan)/0.13)] text-[hsl(var(--glow-cyan))]">
                <FileText className="size-[18px]" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Summary — Resume
              </h3>
            </div>
            <div className="hairline my-4" />
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {basics.summary}
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.08}>
          <SpotlightCard
            className="h-full p-5 sm:p-6"
            spotlightColor="var(--glow-violet)"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--glow-violet)/0.14)] text-[hsl(var(--glow-violet))]">
                <Linkedin className="size-[18px]" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Summary — LinkedIn
              </h3>
            </div>
            <div className="hairline my-4" />
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {basics.linkedinSummary}
            </p>
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Source notes */}
      <Reveal className="mt-10" delay={0.05}>
        <div className="mb-5 flex items-center gap-2.5">
          <Info className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Profile variants & source notes
          </h3>
        </div>
      </Reveal>

      <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.06}>
        {extra.map((item, i) => (
          <RevealItem key={i} className="h-full">
            <div className="h-full rounded-xl border border-border/70 bg-[hsl(var(--muted)/0.3)] p-4 transition-colors duration-300 hover:border-[hsl(var(--glow-violet)/0.35)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {item.label}
                </span>
                <Badge variant={item.source === "linkedin" ? "violet" : "muted"}>
                  {item.source}
                </Badge>
              </div>

              <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.value}
              </p>

              {item.note && (
                <p className="mt-2.5 border-l-2 border-border pl-3 text-xs leading-relaxed text-muted-foreground/80">
                  {item.note}
                </p>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
