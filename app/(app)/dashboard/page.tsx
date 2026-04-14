// app/(app)/dashboard/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Trash2, Sparkles,
  Plus, AlertTriangle, RefreshCw, Loader2,
} from 'lucide-react';

import { useUserCourses, useDeleteCourse } from '@/lib/hooks/use-courses';
import { formatRelativeDate, formatMinutes } from '@/lib/utils/format';
import type { CourseMeta } from '@/lib/types/course.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// ANIMATION
// ============================================================================

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// ============================================================================
// COURSE CARD
// ============================================================================

type BadgeVariant = 'primary' | 'accent' | 'neutral' | 'success' | 'error' | 'sand';

function CourseCard({ course, onDelete }: { course: CourseMeta; onDelete: () => void }) {
  const [deleteHovered, setDeleteHovered] = React.useState(false);
  const [cardHovered, setCardHovered] = React.useState(false);

  const isGenerating = course.status === 'pending' || course.status === 'generating';

  const levelVariant = (l: string): BadgeVariant =>
    l === 'advanced' ? 'accent' : l === 'intermediate' ? 'primary' : 'neutral';

  const statusVariant = (s: string): BadgeVariant => {
    if (s === 'completed') return 'success';
    if (s === 'failed') return 'error';
    if (s === 'generating' || s === 'pending') return 'primary';
    return 'neutral';
  };

  return (
    <motion.div
      variants={cardItem}
      layout
      className="relative glass glass-hover rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] flex flex-col min-h-[180px] overflow-hidden group"
      style={{
        borderColor: cardHovered || isGenerating ? 'rgba(112,0,204,0.15)' : undefined,
      }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Generating shimmer stripe */}
      {isGenerating && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]"
        />
      )}

      {/* Full-card click target */}
      <Link
        href={`/courses/${course.id}`}
        className="absolute inset-0 z-10 rounded-[var(--radius-xl)]"
        aria-label={`View ${course.title}`}
      />

      <div className="p-5 flex flex-col flex-1 z-20 pointer-events-none">

        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-3">
          <Badge variant={levelVariant(course.level)}>{course.level}</Badge>
          <Badge variant={statusVariant(course.status)}>
            {isGenerating && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-[pulse_1.5s_ease-in-out_infinite] flex-shrink-0" />
            )}
            {course.status}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-semibold text-[var(--color-text)] leading-snug mb-auto line-clamp-2">
          {course.title}
        </h3>

        {/* Stats (completed only) */}
        {course.status === 'completed' && (
          <div className="flex items-center gap-3 mt-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            {course.total_modules != null && (
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {course.total_modules} mod
              </span>
            )}
            {course.total_topics != null && (
              <span>{course.total_topics} topics</span>
            )}
            {course.estimated_minutes != null && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {formatMinutes(course.estimated_minutes)}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-divider)] pointer-events-auto">
          <span className="text-[11px] text-[var(--color-text-faint)]">
            {formatRelativeDate(course.created_at)}
          </span>

          {/* Continue indicator on hover */}
          <span className="text-[11px] font-semibold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
            {course.status === 'completed' ? 'Continue →' : ''}
          </span>

          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            className="p-1.5 rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer opacity-0 group-hover:opacity-100"
            style={{
              color: deleteHovered ? 'var(--color-error)' : 'var(--color-text-faint)',
              background: deleteHovered ? 'rgba(234,89,31,0.08)' : 'transparent',
            }}
            aria-label="Delete course"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// SKELETON GRID
// ============================================================================

function CourseGridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-[var(--radius-xl)] p-5 flex flex-col min-h-[180px] gap-3"
        >
          <div className="flex gap-2">
            <Skeleton width="72px" height="20px" className="rounded-full" />
            <Skeleton width="80px" height="20px" className="rounded-full" />
          </div>
          <Skeleton height="18px" />
          <Skeleton width="70%" height="18px" />
          <div className="mt-auto flex flex-col gap-2">
            <Skeleton width="50%" height="12px" />
            <Skeleton width="30%" height="10px" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex flex-col items-center justify-center text-center py-20 px-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-subtle)] flex items-center justify-center mb-6 shadow-[var(--shadow-glow)]">
        <Sparkles size={28} className="text-[var(--color-primary)]" />
      </div>
      <h3 className="font-display text-xl font-bold text-[var(--color-text)] mb-2 tracking-tight">
        No courses yet
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] max-w-[280px] leading-relaxed mb-8">
        Generate your first AI-powered course and start learning in minutes.
      </p>
      <Link href="/generate">
        <Button variant="accent" size="lg">
          <Sparkles size={15} />
          Generate a course
        </Button>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function DashboardPage() {
  const { data: courses, isPending, error, refetch } = useUserCourses();
  const { mutateAsync: deleteAsync, isPending: isDeleting } = useDeleteCourse();

  const [pendingDelete, setPendingDelete] = React.useState<CourseMeta | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAsync(pendingDelete.id);
      setToast(`"${pendingDelete.title}" deleted.`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setPendingDelete(null);
    }
  }

  const completedCount = courses?.filter(c => c.status === 'completed').length ?? 0;
  const generatingCount = courses?.filter(c => c.status === 'generating' || c.status === 'pending').length ?? 0;

  return (
    <>
      <div className="page-container">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex items-start justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--color-text)] tracking-tight leading-tight mb-1">
              Your Courses
            </h1>
            {!isPending && courses && courses.length > 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                {completedCount} completed
                {generatingCount > 0 && (
                  <span className="text-[var(--color-primary)] font-semibold">
                    {' '}· {generatingCount} generating
                  </span>
                )}
                <span className="text-[var(--color-text-faint)]">
                  {' '}· {courses.length} total
                </span>
              </p>
            )}
          </div>

          <Link href="/generate" className="flex-shrink-0">
            <Button variant="accent" size="md">
              <Plus size={15} />
              New Course
            </Button>
          </Link>
        </motion.div>

        {/* ── Toast ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="mb-5 overflow-hidden"
            >
              <div className="p-3 rounded-[var(--radius-lg)] bg-[rgba(76,175,125,0.1)] border border-[rgba(76,175,125,0.2)] text-[var(--color-success)] text-sm font-medium">
                {toast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ─────────────────────────────────────────────────── */}
        {isPending && <CourseGridSkeleton />}

        {error && !isPending && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertTriangle size={36} className="text-[var(--color-error)] opacity-70" />
            <p className="text-[var(--color-error)] text-sm">
              {(error as Error).message}
            </p>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              <RefreshCw size={13} />
              Try again
            </Button>
          </div>
        )}

        {!isPending && !error && !courses?.length && <EmptyState />}

        {!isPending && !error && !!courses?.length && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
          >
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={() => setPendingDelete(course)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────── */}
      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete course?"
      >
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
          Are you sure you want to delete{' '}
          <span className="text-[var(--color-text)] font-semibold">
            &ldquo;{pendingDelete?.title}&rdquo;
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost" size="sm"
            onClick={() => setPendingDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger" size="sm"
            isLoading={isDeleting}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}