"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { basics, sections } from "@/data/resume";
import { useActiveSection } from "@/hooks/useActiveSection";
import { LogoMark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTION_IDS = sections.map((s) => s.id);

export function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* ---------------- Top bar ---------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className="container">
          <div
            className={cn(
              "flex items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-4",
              scrolled ? "glass-strong" : "border border-transparent"
            )}
          >
            <button
              onClick={() => go("hero")}
              className="flex items-center gap-2.5 rounded-full px-2 py-1 focus-ring"
              aria-label="Back to top"
            >
              <LogoMark className="size-8 shrink-0" />
              <span className="hidden text-sm font-semibold tracking-tight sm:block">
                {basics.name}
              </span>
            </button>

            {/* Desktop links */}
            <nav className="hidden items-center gap-1 lg:flex">
              {sections
                .filter((s) => s.id !== "hero")
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => go(s.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm transition-colors focus-ring",
                      active === s.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-[hsl(var(--glow-cyan)/0.12)] ring-1 ring-[hsl(var(--glow-cyan)/0.25)]"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">{s.label}</span>
                  </button>
                ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="glass"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/resume">
                  <FileText className="size-4" />
                  Resume
                </Link>
              </Button>
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid size-10 place-items-center rounded-full glass focus-ring lg:hidden"
              >
                <Menu className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- Desktop scroll-spy rail ---------------- */}
      <nav
        aria-label="Section navigation"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className="group flex items-center gap-2.5 focus-ring rounded-full"
            aria-label={`Go to ${s.label}`}
            aria-current={active === s.id ? "true" : undefined}
          >
            <span
              className={cn(
                "text-[0.7rem] uppercase tracking-[0.16em] opacity-0 transition-all duration-300 group-hover:opacity-100",
                active === s.id
                  ? "text-[hsl(var(--glow-cyan))] opacity-100"
                  : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                active === s.id
                  ? "h-6 w-[3px] bg-[linear-gradient(180deg,hsl(var(--glow-cyan)),hsl(var(--glow-violet)))] shadow-[0_0_12px_hsl(var(--glow-cyan)/0.7)]"
                  : "h-1.5 w-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground"
              )}
            />
          </button>
        ))}
      </nav>

      {/* ---------------- Mobile sheet ---------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-background/85 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="absolute inset-x-0 top-0 p-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
            >
              <div className="glass-strong rounded-3xl p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-semibold">{basics.name}</span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="grid size-10 place-items-center rounded-full glass focus-ring"
                  >
                    <X className="size-[18px]" />
                  </button>
                </div>

                <ul className="flex flex-col">
                  {sections.map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                    >
                      <button
                        onClick={() => go(s.id)}
                        className={cn(
                          // 48px min target — comfortable for thumbs
                          "flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-base transition-colors focus-ring",
                          active === s.id
                            ? "bg-[hsl(var(--glow-cyan)/0.1)] text-[hsl(var(--glow-cyan))]"
                            : "text-muted-foreground hover:bg-[hsl(var(--muted)/0.5)] hover:text-foreground"
                        )}
                      >
                        {s.label}
                        <span className="font-mono text-xs opacity-50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <Button asChild className="mt-4 w-full" size="lg">
                  <Link href="/resume" onClick={() => setOpen(false)}>
                    <FileText className="size-4" />
                    View / Download Resume
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
