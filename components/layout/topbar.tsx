'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Menu } from 'lucide-react';

// Page title from route
const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/generate': 'Generate',
  '/profile': 'Profile',
};

function RaphaelMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path d="M9 8h8a5 5 0 0 1 0 10H9V8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M17 18l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  // Resolve page label from pathname
  const pageLabel = Object.entries(ROUTE_LABELS).find(
    ([route]) => pathname === route || pathname.startsWith(route + '/')
  )?.[1] ?? 'Raphael';

  return (
    <header
      className="md:hidden sticky top-0 z-30 flex items-center h-[52px] px-3 gap-3"
      style={{
        background: 'rgba(24,23,23,0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        // Gradient bottom border — more distinctive than a solid line
        borderBottom: '1px solid transparent',
        backgroundImage: `
          linear-gradient(rgba(24,23,23,0.9), rgba(24,23,23,0.9)),
          linear-gradient(90deg, transparent, rgba(112,0,204,0.4) 50%, transparent)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-8 h-8 -ml-1 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-offset)] active:scale-95 transition-all duration-[120ms]"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Page title + mark */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <RaphaelMark size={18} />
        <span
          className="font-display font-bold text-sm text-[var(--color-text)] truncate"
          style={{ letterSpacing: '-0.02em' }}
        >
          {pageLabel}
        </span>
      </div>

      {/* Avatar → profile link */}
      <a href="/profile" className="flex-shrink-0 active:scale-95 transition-transform duration-[120ms]">
        {user?.picture ? (
          <img
            src={user.picture} alt={user.name ?? ''}
            width={28} height={28}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-[var(--color-border)]"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-[var(--color-border)]"
            style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
          >
            {initials}
          </div>
        )}
      </a>
    </header>
  );
}