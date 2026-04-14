import * as React from "react";

export function RaphaelLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Raphael">
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path d="M9 8h8a5 5 0 0 1 0 10H9V8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M17 18l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
