"use client";

import { ArrowUpRight, Globe, Smartphone } from "lucide-react";
import type { ProjectLink as ProjectLinkData } from "@/data/resume";
import { cn } from "@/lib/utils";

/**
 * The "go see the actual product" button on a project card.
 *
 * Deliberately over-signalled as clickable. Everything else on these cards is
 * inert — badges, taglines, bullets — so a link that merely changed colour on
 * hover would read as one more chip. This carries four affordances at once:
 * a destination icon, a border and tint against the flat card, an arrow that
 * leaves the box on hover, and lift. Nobody has to guess.
 *
 * Icon says where it goes rather than decorating: a phone for a Play Store
 * listing, a globe for a website. The arrow points up-and-right because that
 * is the established "leaves this site" convention, and these all open in a
 * new tab — announced to screen readers, since a tab switching underneath
 * someone is only a nice surprise if they were told.
 */
export function ProjectLink({
  link,
  projectTitle,
  className,
}: {
  link: ProjectLinkData;
  /** Names the target so the link still makes sense read out of context. */
  projectTitle: string;
  className?: string;
}) {
  const Icon = link.kind === "play" ? Smartphone : Globe;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/link inline-flex items-center gap-2 rounded-full px-3.5 py-1.5",
        "border border-[hsl(var(--glow-cyan)/0.4)] bg-[hsl(var(--glow-cyan)/0.08)]",
        "text-xs font-semibold text-[hsl(var(--glow-cyan))]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-px hover:border-[hsl(var(--glow-cyan)/0.85)]",
        "hover:bg-[hsl(var(--glow-cyan)/0.16)]",
        "hover:shadow-[0_0_20px_hsl(var(--glow-cyan)/0.28)]",
        "active:translate-y-0 active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[hsl(var(--glow-cyan))] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        className
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{link.label}</span>
      <ArrowUpRight
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 transition-transform duration-200 ease-out",
          "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        )}
      />
      {/* Leading space is explicit: JSX strips whitespace between elements, so
          without it the accessible name runs together as "Visit site— Agri". */}
      <span className="sr-only">{` — ${projectTitle} (opens in a new tab)`}</span>
    </a>
  );
}
