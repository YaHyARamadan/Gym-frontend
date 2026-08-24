"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles: RTL-aware, smooth transitions, focus ring
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl font-semibold text-sm leading-none",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        /** Yellow fill — one per screen, main CTA */
        primary: [
          "bg-gym-yellow text-gym-black",
          "hover:bg-gym-yellow/90",
          "focus-visible:ring-gym-yellow",
          "shadow-sm hover:shadow-md",
        ],
        /** Outlined — secondary actions */
        secondary: [
          "bg-transparent text-gym-black",
          "border border-gym-border",
          "hover:bg-gym-black/5",
          "focus-visible:ring-gym-black/30",
        ],
        /** Text-only red — destructive (delete, remove) */
        destructive: [
          "bg-transparent text-gym-red",
          "hover:bg-gym-red/8",
          "focus-visible:ring-gym-red/40",
        ],
        /** Ghost — sidebar nav items etc. */
        ghost: [
          "bg-transparent text-gym-text-secondary",
          "hover:bg-gym-black/5 hover:text-gym-black",
          "focus-visible:ring-gym-black/20",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-5",
        lg: "h-12 px-7 text-base rounded-2xl",
        icon: "h-9 w-9 rounded-lg p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
