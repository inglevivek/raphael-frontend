// page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GenerateForm } from "@/components/generate/generate-form";
import { GenerationProgress } from "@/components/generate/generation-progress";
import { useCreateCourse } from "@/lib/hooks/use-courses";
import { useGeneratePoll } from "@/lib/hooks/use-generate-poll";
import { CourseLevel } from "@/lib/types/course.types";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function GeneratePage() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<"form" | "generating">("form");
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const createCourse = useCreateCourse();
  const poll = useGeneratePoll(activeCourseId);

  React.useEffect(() => { document.title = "Generate — Raphael"; }, []);

  const handleSubmit = async (title: string, level: CourseLevel) => {
    setErrorMsg(null);
    try {
      const result = await createCourse.mutateAsync({ title, level });
      setActiveCourseId(result.id);
      setPhase("generating");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create course");
    }
  };

  return (
    <div className="w-full max-w-[580px] mx-auto pt-[var(--space-12)] pb-[var(--space-16)]">

      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mb-[var(--space-4)] overflow-hidden"
          >
            <div className="p-3 rounded-[var(--radius-md)] text-sm
              bg-[var(--color-error-highlight)] border border-[var(--color-error)]
              text-[var(--color-error)] flex items-center gap-2"
            >
              <span className="text-base">⚠</span>
              {errorMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <GenerateForm onSubmit={handleSubmit} isLoading={createCourse.isPending} />
          </motion.div>
        )}

        {phase === "generating" && poll.data && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <GenerationProgress
              course={poll.data}
              onComplete={id => router.push(`/courses/${id}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}