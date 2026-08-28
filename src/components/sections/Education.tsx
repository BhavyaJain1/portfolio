"use client";

import { GraduationCap } from "lucide-react";
import { education } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Foundation"
        title={<span className="text-gradient-accent">Education</span>}
      />

      {/* Degree */}
      <Reveal>
        <SpotlightCard className="p-5 sm:p-6">
          {education.map((edu) => (
            <div key={edu.degree} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[hsl(var(--glow-cyan)/0.13)] text-[hsl(var(--glow-cyan))]">
                <GraduationCap className="size-5" />
              </span>

              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {edu.degree}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {edu.institution}, {edu.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="muted">{edu.dates}</Badge>
                  {edu.detail && <Badge>{edu.detail}</Badge>}
                </div>
              </div>
            </div>
          ))}
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}
