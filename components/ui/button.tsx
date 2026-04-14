"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "accent" | "ghost" | "danger" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
  accent:
    "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
  ghost:
    "bg-[var(--color-surface-offset)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-text-faint)] hover:text-[var(--color-text)]",
  danger:
    "bg-[rgba(234,89,31,0.12)] text-[var(--color-error)] border border-[rgba(234,89,31,0.2)] hover:bg-[rgba(234,89,31,0.18)]",
  destructive:
    "bg-[rgba(234,89,31,0.12)] text-[var(--color-error)] border border-[rgba(234,89,31,0.2)] hover:bg-[rgba(234,89,31,0.18)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3.5 py-1.5 gap-1.5",
  md: "text-sm px-4.5 py-2 gap-2",
  lg: "text-base px-6 py-2.5 gap-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled,
      isLoading,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-full",
          "transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.97]",
          "whitespace-nowrap cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 size={13} className="animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
