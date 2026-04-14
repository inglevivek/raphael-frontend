'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useUserCourses } from '@/lib/hooks/use-courses';
import { UserCard } from '@/components/profile/user-card';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';
import { formatRelativeDate, formatMinutes } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="max-w-[600px] mx-auto flex flex-col gap-4 page-container">
      {/* Card skeleton */}
      <div className="glass rounded-[var(--radius-2xl)] overflow-hidden">
        {/* Hero area */}
        <div className="p-10 bg-[var(--color-surface-2)] flex flex-col items-center gap-3 border-b border-[var(--color-divider)]">
          <Skeleton width="80px" height="80px" className="rounded-full" />
          <Skeleton width="140px" height="18px" />
          <Skeleton width="200px" height="14px" />
        </div>
        {/* Stats */}
        <div className="flex gap-3 p-6 border-b border-[var(--color-divider)]">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} height="88px" className="flex-1 rounded-[var(--radius-xl)]" />
          ))}
        </div>
        {/* Footer */}
        <div className="p-5 px-6 flex justify-between items-center">
          <div className="flex flex-col gap-1.5">
            <Skeleton width="80px" height="14px" />
            <Skeleton width="200px" height="11px" />
          </div>
          <Skeleton width="90px" height="32px" className="rounded-[var(--radius-lg)]" />
        </div>
      </div>

      {/* Recent courses skeleton */}
      <div className="glass rounded-[var(--radius-2xl)] p-6">
        <Skeleton width="140px" height="16px" className="mb-4" />
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: i < 3 ? '1px solid var(--color-divider)' : 'none' }}
          >
            <Skeleton width="36px" height="36px" className="rounded-[var(--radius-md)] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton width="70%" height="13px" />
              <Skeleton width="40%" height="11px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent courses panel ─────────────────────────────────────────────────────
function RecentCourses({ courses }: { courses: Array<{ id: string; title: string; status: string; created_at: string; estimated_minutes?: number | null; total_topics?: number | null }> }) {
  const recent = courses
    .filter(c => c.status === 'completed')
    .slice(0, 5);

  if (!recent.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.15, ease: EASE }}
      className="glass rounded-[var(--radius-2xl)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-divider)] flex items-center justify-between">
        <span className="font-display text-sm font-bold text-[var(--color-text)] tracking-tight">
          Recent Courses
        </span>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-150"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* List */}
      <div>
        {recent.map((course, i) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="flex items-center gap-3.5 px-6 py-3.5 transition-colors duration-150 hover:bg-[var(--color-surface-offset)]"
            style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--color-divider)' : 'none' }}
          >
            <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary-subtle)] flex items-center justify-center flex-shrink-0">
              <BookOpen size={15} className="text-[var(--color-primary)]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate mb-0.5">
                {course.title}
              </p>
              <div className="flex items-center gap-2.5 text-[11px] text-[var(--color-text-faint)]">
                {course.total_topics != null && (
                  <span>{course.total_topics} topics</span>
                )}
                {course.estimated_minutes != null && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatMinutes(course.estimated_minutes)}
                  </span>
                )}
                <span>{formatRelativeDate(course.created_at)}</span>
              </div>
            </div>

            <ChevronRight size={14} className="text-[var(--color-text-faint)] flex-shrink-0" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user: auth0User, isLoading: userLoading } = useUser();
  const { data: courses, isPending: coursesLoading } = useUserCourses();

  const stats = useMemo(() => {
    if (!courses) return { count: 0, topics: 0, minutes: 0 };
    return {
      count: courses.length,
      topics: courses.reduce((a, c) => a + (c.total_topics ?? 0), 0),
      minutes: courses.reduce((a, c) => a + (c.estimated_minutes ?? 0), 0),
    };
  }, [courses]);

  if (userLoading || coursesLoading) return <ProfileSkeleton />;

  if (!auth0User) {
    return (
      <div className="flex items-center justify-center p-20 text-[var(--color-text-muted)] text-sm">
        Redirecting…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="max-w-[600px] mx-auto pb-16 page-container"
    >
      {/* Page title */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[var(--color-text)] tracking-tight leading-tight">
          Profile
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Manage your account and learning history.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <UserCard
          user={{
            id: auth0User.sub!,
            email: auth0User.email!,
            name: auth0User.name!,
            picture: auth0User.picture,
            email_verified: auth0User.email_verified ?? false,
            created_at: '',
          }}
          coursesCount={stats.count}
          totalTopics={stats.topics}
          totalMinutes={stats.minutes}
        />

        {courses && <RecentCourses courses={courses} />}
      </div>
    </motion.div>
  );
}