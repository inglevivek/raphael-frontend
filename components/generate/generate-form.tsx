// generate-form.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseLevel } from "@/lib/types/course.types";
import { cn } from "@/lib/utils/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
const LEVELS: { value: CourseLevel; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "No prior knowledge" },
  { value: "intermediate", label: "Intermediate", desc: "Some experience" },
  { value: "advanced", label: "Advanced", desc: "Deep dive" },
];

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

export interface GenerateFormProps {
  onSubmit: (title: string, level: CourseLevel) => void;
  isLoading?: boolean;
}

export function GenerateForm({ onSubmit, isLoading }: GenerateFormProps) {
  const [title, setTitle] = React.useState("");
  const [level, setLevel] = React.useState<CourseLevel | null>(null);

  const isValid = title.length >= 3 && title.length <= 120 && level !== null;
  const charPct = Math.min((title.length / 120) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) onSubmit(title, level!);
  };

  return (
    <div
      className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)]
        bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
      style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4
            bg-[var(--color-primary-highlight)] text-[var(--color-primary)]"
        >
          <SparkleIcon />
        </div>
        <h1
          className="font-display font-bold text-[var(--color-text)] mb-1.5"
          style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }}
        >
          What do you want to learn?
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] max-w-[38ch]">
          Describe a topic and Raphael will build a structured course for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Topic input */}
        <div>
          <Input
            label="Course topic"
            placeholder="e.g. Spiking Neural Networks, Jazz theory, Microeconomics"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
            disabled={isLoading}
          />
          {/* Char progress */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-[3px] bg-[var(--color-surface-offset)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: charPct > 90
                    ? "var(--color-warning)"
                    : "var(--color-primary)",
                } as any}
                animate={{ width: `${charPct}%` }}
                transition={{ duration: 0.2, ease: EASE }}
              />
            </div>
            <span className="text-[11px] text-[var(--color-text-faint)] tabular-nums w-[42px] text-right">
              {title.length}/120
            </span>
          </div>
        </div>

        {/* Level selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider
            text-[var(--color-text-muted)] mb-3">
            Skill level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map(({ value, label, desc }) => {
              const active = level === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLevel(value)}
                  disabled={isLoading}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-3 px-2 rounded-[var(--radius-lg)]",
                    "border text-center transition-all duration-[150ms]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                    active
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]"
                      : "bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]"
                  )}
                >
                  <span className="text-sm font-semibold leading-none">{label}</span>
                  <span className={cn(
                    "text-[10px] leading-none mt-0.5",
                    active ? "text-white/70" : "text-[var(--color-text-faint)]"
                  )}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            disabled={!isValid}
          >
            {isLoading ? "Creating…" : "Generate Course →"}
          </Button>
          <p className="text-center text-[11px] text-[var(--color-text-faint)] mt-3">
            Typically takes 2–5 minutes
          </p>
        </div>
      </form>
    </div>
  );
}