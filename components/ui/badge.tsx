"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "sand";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  primary: "badge-primary",
  accent: "badge-accent",
  neutral: "badge-neutral",
  success: "badge-success",
  warning:
    "bg-[var(--color-sand-subtle)] text-[var(--color-sand)] border-[rgba(207,190,140,0.2)]",
  error: "badge-error",
  sand: "badge-sand",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge-base capitalize",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
