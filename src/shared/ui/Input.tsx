"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-200 select-none"
          >
            {label}
            {props.required && (
              <span className="text-gym-red mr-1" aria-hidden="true">
                {" "}
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gym-text-secondary pointer-events-none">
              {rightIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : "", hint ? hintId : ""]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              // Base
              "w-full h-11 rounded-xl border bg-black/40 px-4 py-2.5",
              "text-sm text-white placeholder:text-zinc-400",
              "transition-all duration-200",
              // RTL padding adjustments
              rightIcon && "pr-10",
              leftIcon && "pl-10",
              // Border states
              "border-white/10",
              "hover:border-gym-yellow/40",
              "focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 focus:bg-black/60",
              // Error state
              error && [
                "border-gym-red/60",
                "focus:border-gym-red focus:ring-gym-red/20",
                "bg-gym-red/10",
              ],
              className
            )}
            {...props}
          />

          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gym-text-secondary pointer-events-none">
              {leftIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-gym-red flex items-center gap-1">
            <span aria-hidden="true">⚠</span>
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-gym-text-secondary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
