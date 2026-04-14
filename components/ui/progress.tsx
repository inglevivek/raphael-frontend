import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: "primary" | "accent";
  showLabel?: boolean;
}

export function Progress({ value, variant = "primary", showLabel, className, ...props }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2 w-full", className)} {...props}>
      <div className="relative h-2 flex-1 overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-surface-offset)]">
        <div
          className={cn(
            "h-full w-full flex-1 transition-all duration-[600ms] ease-in-out origin-left",
            variant === "primary" ? "bg-[var(--color-primary)]" : "bg-[var(--color-accent)]"
          )}
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--color-text-muted)] min-w-[2.5rem]">{Math.round(safeValue)}%</span>
      )}
    </div>
  );
}
