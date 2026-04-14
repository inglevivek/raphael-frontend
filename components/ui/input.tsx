"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-lg)] px-4 text-[var(--color-text)]",
            "bg-[var(--color-surface-offset)] border",
            "placeholder:text-[var(--color-text-faint)]",
            "transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-[var(--color-error)]" : "border-[var(--color-border)]",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-[var(--color-error)] mt-0.5">{error}</span>
        )}
        {!error && hint && (
          <span className="text-xs text-[var(--color-text-faint)] mt-0.5">{hint}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
