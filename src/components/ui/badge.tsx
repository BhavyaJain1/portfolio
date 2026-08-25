import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[hsl(var(--glow-cyan)/0.25)] bg-[hsl(var(--glow-cyan)/0.1)] text-[hsl(var(--glow-cyan))]",
        violet:
          "border-[hsl(var(--glow-violet)/0.3)] bg-[hsl(var(--glow-violet)/0.12)] text-[hsl(var(--glow-violet))]",
        muted:
          "border-border bg-[hsl(var(--muted)/0.7)] text-muted-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
