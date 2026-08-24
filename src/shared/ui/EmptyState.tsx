"use client";

import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      )}
    >
      {icon && (
        <div className="text-gym-text-secondary/30 mb-2">
          <span className="[&>svg]:h-16 [&>svg]:w-16">{icon}</span>
        </div>
      )}

      <div className="space-y-1.5 max-w-xs">
        <p className="text-base font-bold text-gym-black font-cairo">{title}</p>
        {description && (
          <p className="text-sm text-gym-text-secondary leading-relaxed">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
