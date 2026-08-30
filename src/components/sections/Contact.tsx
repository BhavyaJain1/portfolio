"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { SHOW_PHONE, basics, links } from "@/data/resume";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/SectionHeading";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Button } from "@/components/ui/button";

const ICONS = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
  phone: Phone,
  map: MapPin,
} as const;

export function Contact() {
  return (
    <Section id="contact" className="pb-24 sm:pb-32">
      <Reveal>
        <SpotlightCard className="overflow-hidden p-7 text-center sm:p-12 lg:p-16">
          <span className="eyebrow">Get in touch</span>

          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s talk about{" "}
            <span className="text-gradient-accent">quality at scale</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Open to conversations about test automation, performance
            engineering and QA ownership.
          </p>

          {/* Primary contact rows */}
          <div className="mx-auto mt-9 flex max-w-md flex-col gap-3">
            <ContactRow
              icon={Mail}
              label="Email"
              value={basics.email}
              href={`mailto:${basics.email}`}
            />
            {SHOW_PHONE && (
              /* No tel: href — the number is masked, so a dial link would
                 either be broken or have to reconstruct the digits it is
                 meant to be hiding. Email is the working channel. */
              <ContactRow icon={Phone} label="Phone" value={basics.phone} />
            )}
            <ContactRow icon={MapPin} label="Location" value={basics.location} />
          </div>

          {/* Profile links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {links
              .filter((l) => l.icon !== "mail")
              .map((link) => {
                const Icon = ICONS[link.icon];
                return (
                  <Button key={link.label} asChild variant="glass">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="size-4" />
                      {link.label}
                      <ArrowUpRight className="size-3.5 opacity-60" />
                    </a>
                  </Button>
                );
              })}

            <Button asChild>
              <Link href="/resume">
                <FileText className="size-4" />
                Download Resume
              </Link>
            </Button>
          </div>
        </SpotlightCard>
      </Reveal>

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {basics.name}
        </p>
      </footer>
    </Section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[hsl(var(--glow-cyan)/0.12)] text-[hsl(var(--glow-cyan))]">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[0.65rem] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-sm font-medium">{value}</span>
      </span>
      {href && (
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5" />
      )}
    </>
  );

  const className =
    "group/row flex items-center gap-3 rounded-xl border border-border/70 bg-[hsl(var(--muted)/0.35)] p-3 transition-colors duration-300 hover:border-[hsl(var(--glow-cyan)/0.4)] focus-ring";

  return href ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}
