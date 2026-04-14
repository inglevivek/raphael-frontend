import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-10 border-b border-[var(--color-divider)]',
        className
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        {/* Updated Title: Larger, better tracking, and balance */}
        <h1
          className="font-display font-bold text-white tracking-tight text-balance"
          style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', lineHeight: 1.1 }}
        >
          {title}
        </h1>

        {/* Updated Subtitle: Finer typography */}
        {subtitle && (
          <p className="text-[var(--color-text-muted)] text-sm max-w-[600px] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action: Pinned to right/bottom on desktop */}
      {action && (
        <div className="flex-shrink-0 flex items-center md:pb-1">
          {action}
        </div>
      )}
    </div>
  );
}