'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  LayoutDashboard, Sparkles, User, LogOut,
  PanelLeftClose, PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

// ── Sidebar context ──────────────────────────────────────────────────────────
type SidebarCtx = { collapsed: boolean; toggle: () => void };
const SidebarContext = React.createContext<SidebarCtx>({
  collapsed: false,
  toggle: () => { },
});
export const useSidebar = () => React.useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggle = React.useCallback(() => setCollapsed(c => !c), []);
  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const SIDEBAR_EXPANDED = 256;
export const SIDEBAR_COLLAPSED = 60;

// ── Logo mark ────────────────────────────────────────────────────────────────
function RaphaelMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path
        d="M9 8h8a5 5 0 0 1 0 10H9V8Z"
        stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"
      />
      <path d="M17 18l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Nav items ────────────────────────────────────────────────────────────────
type NavItem = { href: string; label: string; icon: LucideIcon; accent?: true };

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/generate', label: 'Generate', icon: Sparkles, accent: true },
  { href: '/profile', label: 'Profile', icon: User },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { collapsed, toggle } = useSidebar();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <motion.aside
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
      initial={false}
      transition={{ duration: 0.22, ease: EASE }}
      className={cn(
        'flex flex-col h-full overflow-hidden flex-shrink-0',
        'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
        className
      )}
    >
      {/* ── Logo row ────────────────────────────────────────────────── */}
      <div
        className="flex items-center h-[57px] flex-shrink-0 border-b border-[var(--color-divider)]"
        style={{
          padding: collapsed ? '0 0.5rem' : '0 0.625rem 0 1.25rem',
          gap: '0.625rem',
        }}
      >
        <RaphaelMark size={24} />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="wordmark"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15, ease: EASE }}
              className="font-display font-bold text-[17px] text-[var(--color-text)] whitespace-nowrap overflow-hidden flex-1 tracking-tight"
            >
              Raphael
            </motion.span>
          )}
        </AnimatePresence>

        {/* Toggle — always lives in the header row */}
        <button
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex items-center justify-center flex-shrink-0',
            'rounded-[var(--radius-md)]',
            'text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)]',
            'hover:bg-[var(--color-surface-offset)]',
            'transition-colors duration-[120ms]',
            // when expanded it's right-flush; when collapsed it fills the row naturally
            collapsed ? 'ml-auto' : '',
          )}
          style={{ width: '26px', height: '26px' }}
        >
          {collapsed
            ? <PanelLeftOpen size={14} />
            : <PanelLeftClose size={14} />
          }
        </button>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 py-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
        style={{ padding: '0.75rem 0.5rem' }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon, accent }) => {
          const isActive =
            href === '/generate'
              ? pathname.startsWith(href)
              : pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'relative flex items-center rounded-[var(--radius-lg)]',
                'text-sm font-medium transition-colors duration-[120ms]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]',
                isActive
                  ? 'bg-[var(--color-primary-subtle)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] hover:text-[var(--color-text)]',
              )}
              style={{
                height: '38px',
                padding: collapsed ? '0' : '0 0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? '0' : '0.625rem',
              }}
            >
              {/* Left accent bar — expanded active */}
              {isActive && !collapsed && (
                <span
                  className="absolute left-0 top-[22%] bottom-[22%] w-[2.5px] rounded-full bg-[var(--color-primary)]"
                  aria-hidden
                />
              )}
              {/* Dot below icon — collapsed active */}
              {isActive && collapsed && (
                <span
                  className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]"
                  aria-hidden
                />
              )}

              <Icon
                size={collapsed ? 18 : 15}
                className="flex-shrink-0 transition-[color,width] duration-[120ms]"
                style={{
                  color: isActive
                    ? 'var(--color-primary)'
                    : accent
                      ? 'var(--color-accent)'
                      : 'currentColor',
                }}
              />

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.14, ease: EASE }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── User ────────────────────────────────────────────────────── */}
      <div
        className="border-t border-[var(--color-divider)] flex-shrink-0"
        style={{ padding: collapsed ? '0.75rem 0.5rem' : '0.625rem 0.5rem' }}
      >
        {collapsed ? (
          /* Collapsed — stacked avatar + logout */
          <div className="flex flex-col items-center gap-1.5">
            <Link href="/profile" title={user?.name ?? 'Profile'}>
              {user?.picture ? (
                <img
                  src={user.picture} alt=""
                  width={32} height={32}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ring-1 ring-[var(--color-border)] hover:ring-[var(--color-primary)] transition-all"
                  style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
                >
                  {initials}
                </div>
              )}
            </Link>
            <a
              href="/auth/logout"
              title="Sign out"
              className="p-1 rounded-[var(--radius-md)] text-[var(--color-text-faint)] hover:text-[var(--color-error)] hover:bg-[rgba(234,89,31,0.08)] transition-all duration-[120ms]"
            >
              <LogOut size={13} />
            </a>
          </div>
        ) : (
          /* Expanded — full user row */
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-lg)] group hover:bg-[var(--color-surface-offset)] transition-colors duration-[120ms]">
            {user?.picture ? (
              <img
                src={user.picture} alt={user.name ?? 'User'}
                width={28} height={28}
                className="w-7 h-7 rounded-full flex-shrink-0 object-cover ring-1 ring-[var(--color-border)]"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}
              >
                {initials}
              </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[var(--color-text)] truncate leading-tight">
                {user?.name ?? 'User'}
              </span>
              <span className="text-[10px] text-[var(--color-text-faint)] truncate leading-tight mt-[1px]">
                {user?.email}
              </span>
            </div>

            <a
              href="/auth/logout"
              title="Sign out"
              aria-label="Sign out"
              className="flex-shrink-0 p-[5px] rounded-[var(--radius-md)] text-[var(--color-text-faint)] opacity-0 group-hover:opacity-100 hover:text-[var(--color-error)] hover:bg-[rgba(234,89,31,0.08)] transition-all duration-[120ms]"
            >
              <LogOut size={13} />
            </a>
          </div>
        )}
      </div>
    </motion.aside>
  );
}