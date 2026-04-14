import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <div className="min-h-[60dvh] flex flex-col items-center justify-center text-center px-[var(--space-4)]">
      <span className="font-display text-[var(--text-hero)] font-bold text-[var(--color-primary-subtle)] leading-none mb-[var(--space-6)] select-none">
        404
      </span>
      <h1 className="font-display text-[var(--text-2xl)] text-[var(--color-text)] font-semibold mb-[var(--space-3)]">
        Course not found
      </h1>
      <p className="text-[var(--color-text-muted)] mb-[var(--space-8)] max-w-sm text-sm">
        This course doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link href="/dashboard">
        <Button variant="accent" size="lg">Back to dashboard</Button>
      </Link>
    </div>
  );
}
