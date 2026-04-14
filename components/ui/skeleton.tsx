"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  className,
  width,
  height,
  style,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-sm)]",
        "bg-gradient-to-r from-[var(--color-surface-offset)] via-[var(--color-surface-dynamic)] to-[var(--color-surface-offset)]",
        "bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]",
        className
      )}
      style={{ width: width ?? "100%", height: height ?? "1em", ...style }}
    />
  );
}
