// generation-progress.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseMeta } from "@/lib/types/course.types";
import Link from "next/link";

export interface GenerationProgressProps {
  course: CourseMeta;
  onComplete: (courseId: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const STAGES = [
  { label: "Building course outline", sub: "Structuring chapters and sections" },
  { label: "Expanding key points", sub: "Mapping concepts per chapter" },
  { label: "Writing full content", sub: "Generating lessons and explanations" },
  { label: "Finding resources", sub: "Curating references and links" },
] as const;

type StageStatus = "done" | "active" | "waiting" | "failed";

function getStageIndex(course: CourseMeta): number {
  if (course.status === "completed") return STAGES.length;
  if (course.status === "failed") return -1;
  if (course.status === "pending") return 0;
  return 1; // "generating" — mid-way
}

function getProgress(course: CourseMeta): number {
  if (course.status === "completed") return 100;
  if (course.status === "failed") return 100;
  if (course.status === "pending") return 8;
  return 52;
}

export function GenerationProgress({ course, onComplete }: GenerationProgressProps) {
  const isFailed = course.status === "failed";
  const isCompleted = course.status === "completed";
  const activeIndex = getStageIndex(course);
  const progress = getProgress(course);

  React.useEffect(() => {
    if (!isCompleted) return;
    const t = setTimeout(() => onComplete(course.id), 1200);
    return () => clearTimeout(t);
  }, [isCompleted, course.id, onComplete]);

  const getStatus = (i: number): StageStatus => {
    if (isFailed) return "failed";
    if (isCompleted) return "done";
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "waiting";
  };

  return (
    <div
      className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)]
        bg-[var(--color-surface)] shadow-[var(--shadow-md)]"
      style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h2
            className="font-display font-bold text-[var(--color-text)]"
            style={{ fontSize: "1.125rem", letterSpacing: "-0.02em" }}
          >
            {isCompleted
              ? "Course ready!"
              : isFailed
                ? "Generation failed"
                : "Generating your course…"}
          </h2>
          <span className="text-xs font-mono tabular-nums text-[var(--color-text-faint)]">
            {progress}%
          </span>
        </div>

        {/* Course title pill */}
        {course.title && (
          <p className="text-sm text-[var(--color-text-muted)] truncate mb-4 max-w-[38ch]">
            {course.title}
          </p>
        )}

        {/* Progress bar */}
        <div className="h-1 w-full bg-[var(--color-surface-offset)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: isFailed
                ? "var(--color-error)"
                : undefined,
              backgroundImage: !isFailed
                ? "linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))"
                : undefined,
            } as any}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="flex flex-col">
        {STAGES.map((stage, i) => {
          const status = getStatus(i);
          const isLast = i === STAGES.length - 1;

          return (
            <div key={i} className={cn("flex items-start gap-4", !isLast && "pb-5")}>
              {/* Spine + icon column */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style={{
                    background:
                      status === "done" ? "var(--color-success-highlight)" :
                        status === "active" ? "var(--color-primary-highlight)" :
                          status === "failed" ? "var(--color-error-highlight)" :
                            "var(--color-surface-offset)",
                  }}
                >
                  {status === "done" && <Check size={13} strokeWidth={2.5} style={{ color: "var(--color-success)" }} />}
                  {status === "active" && <Loader2 size={13} strokeWidth={2} style={{ color: "var(--color-primary)" }} className="animate-spin" />}
                  {status === "failed" && <AlertCircle size={13} style={{ color: "var(--color-error)" }} />}
                  {status === "waiting" && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-border)" }} />
                  )}
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    className="w-px flex-1 mt-1 rounded-full transition-colors duration-500"
                    style={{
                      minHeight: "20px",
                      background: status === "done"
                        ? "var(--color-success-highlight)"
                        : "var(--color-surface-offset)",
                    }}
                  />
                )}
              </div>

              {/* Text */}
              <div className="pt-0.5 pb-1">
                <p
                  className="text-sm font-medium leading-snug transition-colors duration-200"
                  style={{
                    color:
                      status === "active" ? "var(--color-text)" :
                        status === "done" ? "var(--color-text-muted)" :
                          status === "failed" ? "var(--color-error)" :
                            "var(--color-text-faint)",
                    textDecoration: status === "done" ? "line-through" : "none",
                  }}
                >
                  {stage.label}
                </p>
                <AnimatePresence>
                  {status === "active" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="text-xs text-[var(--color-text-faint)] mt-0.5 overflow-hidden"
                    >
                      {stage.sub}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Failed CTA */}
      <AnimatePresence>
        {isFailed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-6 pt-6 border-t border-[var(--color-divider)] flex flex-col items-center gap-3"
          >
            <p className="text-sm text-[var(--color-error)] text-center">
              {course.error_message ?? "Something went wrong during generation."}
            </p>
            <Link href="/generate">
              <Button variant="accent" size="sm">Try Again</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── cn inline (remove if @/lib/utils/cn is imported at top) ─────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}