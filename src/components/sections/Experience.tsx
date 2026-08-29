"use client";

import { useState } from "react";
import { Briefcase, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { experience } from "@/data/resume";
import { collectImpactBullets } from "@/lib/metrics";
import { HighlightedBullet } from "@/components/HighlightedBullet";
import { ProjectLink } from "@/components/ProjectLink";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Experience() {
  // First role starts open — it carries the most content.
  const [open, setOpen] = useState<string[]>([experience[0].id]);
  const impact = collectImpactBullets(5);

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Career"
        title={
          <>
            Where the work <span className="text-gradient-accent">happened</span>
          </>
        }
        description="Five years across AI-driven agriculture, healthcare and enterprise software — from sole QA ownership of four products to BDD automation at scale."
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        {/* ---------------- Timeline ---------------- */}
        <div className="relative">
          {/* Glowing spine — desktop only; mobile stacks into plain cards. */}
          <div
            aria-hidden="true"
            className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px sm:block"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--glow-cyan)/0.6), hsl(var(--glow-violet)/0.4) 55%, transparent)",
            }}
          />

          <Accordion
            type="multiple"
            value={open}
            onValueChange={setOpen}
            className="flex flex-col gap-5"
          >
            {experience.map((role, index) => {
              const isOpen = open.includes(role.id);

              return (
                <Reveal key={role.id} delay={index * 0.08}>
                  <AccordionItem value={role.id} className="relative sm:pl-12">
                    {/* Timeline node */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-2 top-6 hidden size-3.5 rounded-full border-2 transition-all duration-500 sm:block",
                        isOpen
                          ? "border-[hsl(var(--glow-cyan))] bg-[hsl(var(--glow-cyan))] shadow-[0_0_16px_hsl(var(--glow-cyan)/0.8)]"
                          : "border-[hsl(var(--glow-cyan)/0.45)] bg-background"
                      )}
                    />

                    <SpotlightCard className="p-5 sm:p-6">
                      <AccordionTrigger className="w-full">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                              {role.role}
                            </h3>
                            {role.tenure && (
                              <Badge variant="muted">{role.tenure}</Badge>
                            )}
                          </div>

                          <p className="mt-1.5 text-sm font-medium text-[hsl(var(--glow-cyan))] sm:text-base">
                            {role.company}
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="size-3.5" />
                              {role.dates}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {role.location}
                            </span>
                          </div>

                          {role.summary && (
                            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                              {role.summary}
                            </p>
                          )}
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        {/* Role-level bullets */}
                        {role.bullets.length > 0 && (
                          <ul className="flex flex-col gap-2.5">
                            {role.bullets.map((bullet, i) => (
                              <BulletRow key={i} text={bullet} />
                            ))}
                          </ul>
                        )}

                        {/* Nested products */}
                        {role.projects.length > 0 && (
                          <div
                            className={cn(
                              "flex flex-col gap-5",
                              role.bullets.length > 0 && "mt-6"
                            )}
                          >
                            {role.projects
                              .filter((p) => p.bullets.length > 0)
                              .map((project) => (
                                <div
                                  key={project.id}
                                  className="rounded-xl border border-border/60 bg-[hsl(var(--muted)/0.35)] p-4"
                                >
                                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                                    <h4 className="text-sm font-semibold tracking-tight">
                                      {project.title}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                      {project.tagline}
                                    </span>
                                  </div>

                                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                                    {project.stack.map((tech) => (
                                      <Badge key={tech} variant="violet">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>

                                  <ul className="mt-3.5 flex flex-col gap-2.5">
                                    {project.bullets.map((bullet, i) => (
                                      <BulletRow key={i} text={bullet} />
                                    ))}
                                  </ul>

                                  {project.link && (
                                    <div className="mt-4">
                                      <ProjectLink
                                        link={project.link}
                                        projectTitle={project.title}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}

                            {/* Projects with no bullets of their own (TIBCO). */}
                            {role.projects.some((p) => p.bullets.length === 0) && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Projects:
                                </span>
                                {role.projects
                                  .filter((p) => p.bullets.length === 0)
                                  .map((p) => (
                                    <Badge key={p.id} variant="violet">
                                      {p.title}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </AccordionContent>
                    </SpotlightCard>
                  </AccordionItem>
                </Reveal>
              );
            })}
          </Accordion>
        </div>

        {/* ---------------- Impact highlights panel ---------------- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.15}>
            <SpotlightCard
              className="p-5 sm:p-6"
              spotlightColor="var(--glow-violet)"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--glow-violet)/0.14)] text-[hsl(var(--glow-violet))]">
                  <TrendingUp className="size-[18px]" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight">
                    Impact Highlights
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Auto-pulled measurable results
                  </p>
                </div>
              </div>

              <div className="hairline my-5" />

              <RevealGroup className="flex flex-col gap-4" stagger={0.07}>
                {impact.map((item, i) => (
                  <RevealItem key={i}>
                    <div className="group/item">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="size-3 text-[hsl(var(--glow-violet))]" />
                        <span className="text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground">
                          {item.project ?? item.company}
                        </span>
                      </div>
                      <p className="text-pretty text-[0.82rem] leading-relaxed text-muted-foreground transition-colors group-hover/item:text-foreground">
                        <HighlightedBullet text={item.text} />
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </SpotlightCard>
          </Reveal>
        </aside>
      </div>
    </Section>
  );
}

function BulletRow({ text }: { text: string }) {
  return (
    <li className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
      <span
        aria-hidden="true"
        className="mt-[0.6em] size-1 shrink-0 rounded-full bg-[hsl(var(--glow-cyan)/0.7)]"
      />
      <HighlightedBullet text={text} className="text-pretty" />
    </li>
  );
}
