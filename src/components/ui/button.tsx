"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /* Primary CTA — gradient fill with a bloom on hover. */
        default:
          "text-[hsl(var(--primary-foreground))] shadow-glow bg-[linear-gradient(100deg,hsl(var(--glow-cyan)),hsl(var(--glow-violet)))] hover:brightness-110 hover:shadow-[0_0_0_1px_hsl(var(--glow-cyan)/0.4),0_0_44px_-4px_hsl(var(--glow-cyan)/0.55)]",
        /* Secondary CTA — glass with a gradient border that brightens. */
        glass:
          "glass text-foreground hover:border-[hsl(var(--glow-cyan)/0.45)] hover:shadow-[0_0_28px_-6px_hsl(var(--glow-cyan)/0.4)]",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted)/0.6)]",
        outline:
          "border border-border bg-transparent hover:bg-[hsl(var(--muted)/0.5)] hover:text-foreground",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-[0.8rem]",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
