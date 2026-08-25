"use client";

import { BadgeCheck, GraduationCap, Languages as LanguagesIcon } from "lucide-react";
import { certifications, education, languages } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Foundation"
        title={
          <>
            Education & <span className="text-gradient-accent">credentials</span>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Degree */}
        <Reveal className="lg:col-span-2">
          <SpotlightCard className="h-full p-5 sm:p-6">
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

        {/* Certifications */}
        <Reveal delay={0.08}>
          <SpotlightCard
            className="h-full p-5 sm:p-6"
            spotlightColor="var(--glow-violet)"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--glow-violet)/0.14)] text-[hsl(var(--glow-violet))]">
                <BadgeCheck className="size-[18px]" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Certifications
              </h3>
            </div>

            <div className="hairline my-4" />

            <ul className="flex flex-col gap-3">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="text-sm font-medium">{cert.name}</p>
                  {cert.altName !== cert.name && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      LinkedIn: “{cert.altName}”
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        {/* Languages */}
        <Reveal delay={0.12} className="lg:col-span-3">
          <SpotlightCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--glow-cyan)/0.13)] text-[hsl(var(--glow-cyan))]">
                  <LanguagesIcon className="size-[18px]" />
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Languages
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang.name}
                    className="rounded-lg border border-border/70 bg-[hsl(var(--muted)/0.45)] px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {lang.level}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  );
}
