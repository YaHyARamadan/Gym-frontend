"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none",
  {
    variants: {
      variant: {
        /** نشط — Active */
        active: "bg-gym-yellow-tint text-gym-black border border-gym-yellow/30",
        /** معلّق — Pending / Frozen */
        pending: "bg-gym-maroon-tint text-gym-maroon border border-gym-maroon/20",
        /** منتهي / مرفوض — Expired / Rejected */
        expired: "bg-gym-red-tint text-gym-red border border-gym-red/20",
        /** محايد — Neutral */
        neutral: "bg-gray-100 text-gray-600 border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

const DOT_COLORS = {
  active: "bg-gym-yellow",
  pending: "bg-gym-maroon",
  expired: "bg-gym-red",
  neutral: "bg-gray-400",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

export function Badge({ className, variant, showDot = true, children, ...props }: BadgeProps) {
  const dotColor = DOT_COLORS[variant ?? "neutral"];
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <span className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
      )}
      {children}
    </span>
  );
}
