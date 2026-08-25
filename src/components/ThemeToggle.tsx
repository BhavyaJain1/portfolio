"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes resolves on the client only; render a placeholder until then
  // so SSR and first paint agree.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      // Label must stay stable until mounted, or SSR and client disagree.
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full glass focus-ring transition-colors hover:border-[hsl(var(--glow-cyan)/0.4)]",
        className
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-[18px] text-[hsl(var(--glow-cyan))]" />
        ) : (
          <Moon className="size-[18px] text-[hsl(var(--glow-violet))]" />
        )
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  );
}
