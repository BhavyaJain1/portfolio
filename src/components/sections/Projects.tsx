"use client";

import { Layers } from "lucide-react";
import { projects } from "@/data/resume";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Products"
        title={
          <>
            Platforms I <span className="text-gradient-accent">tested</span>
          </>
        }
        description="The products behind the roles — four AI platforms at Wadhwani AI and two enterprise product lines at TIBCO."
      />

      <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.09}>
        {projects.map((project) => (
          <RevealItem key={project.id} className="h-full">
            <SpotlightCard className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--glow-cyan)/0.12)] text-[hsl(var(--glow-cyan))]">
                  <Layers className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.org}
                  </p>
                </div>
              </div>

              <p className="mt-3.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <Badge key={tech} variant="muted">
                    {tech}
                  </Badge>
                ))}
              </div>

              {project.bullets.length > 0 && (
                <>
                  <div className="hairline my-5" />
                  <ul className="flex flex-col gap-2.5">
                    {project.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.6em] size-1 shrink-0 rounded-full bg-[hsl(var(--glow-violet)/0.75)]"
                        />
                        <HighlightedBullet text={bullet} className="text-pretty" />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
