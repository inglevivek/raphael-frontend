"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg)] flex flex-col items-center justify-center text-center px-[var(--space-4)]">
      <AlertCircle className="w-12 h-12 text-[var(--color-accent)] mb-[var(--space-6)]" />
      <h1 className="font-display text-[var(--text-2xl)] text-[var(--color-text)] font-semibold mb-[var(--space-3)]">
        Something went wrong
      </h1>
      <p className="text-[var(--color-text-muted)] mb-[var(--space-8)] max-w-md text-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex items-center gap-[var(--space-3)]">
        <Button variant="ghost" onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="accent">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
