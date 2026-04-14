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


import PillNav from '@/components/layout/pill-nav';
// ── Constants ────────────────────────────────────────────────────────────────
export const SIDEBAR_EXPANDED = 256;
export const SIDEBAR_COLLAPSED = 60;
const EASE = [0.16, 1, 0.3, 1] as const;

const ROUTE_LABELS: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/generate': 'Generate',
    '/profile': 'Profile',
};

// ── Context ──────────────────────────────────────────────────────────────────
type NavCtx = { collapsed: boolean; toggle: () => void };
const NavContext = React.createContext<NavCtx>({ collapsed: false, toggle: () => { } });
export const useNav = () => React.useContext(NavContext);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = React.useState(false);
    const toggle = React.useCallback(() => setCollapsed(c => !c), []);
    return (
        <NavContext.Provider value={{ collapsed, toggle }}>
            {children}
        </NavContext.Provider>
    );
}

// ── Shared ───────────────────────────────────────────────────────────────────
type NavItem = { href: string; label: string; icon: LucideIcon; accent?: true };

const NAV_ITEMS: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/generate', label: 'Generate', icon: Sparkles, accent: true },
    { href: '/profile', label: 'Profile', icon: User },
];

function RaphaelMark({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M9 8h8a5 5 0 0 1 0 10H9V8Z"
                stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
            <path d="M17 18l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function useActiveRoute() {
    const pathname = usePathname();
    const isActive = (href: string) =>
        href === '/generate'
            ? pathname.startsWith(href)
            : pathname === href || pathname.startsWith(href + '/');
    const pageLabel =
        Object.entries(ROUTE_LABELS).find(
            ([route]) => pathname === route || pathname.startsWith(route + '/')
        )?.[1] ?? 'Raphael';
    return { isActive, pageLabel };
}


// ── Mobile Nav ───────────────────────────────────────────────────────────────
export function UniversalHeader() {
    const { user } = useUser();
    const { isActive } = useActiveRoute();

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : (user?.email?.[0] ?? 'U').toUpperCase();

    const pillItems = NAV_ITEMS.map(({ href, label }) => ({ href, label }));
    const activePillHref = NAV_ITEMS.find(({ href }) => isActive(href))?.href;

    return (
        /* The "Invisible Bar": 
          h-[80px] creates the height, pointer-events-none ensures you can still 
          click things "behind" the empty spaces of the header.
        */
        <header className="fixed top-0 left-0 w-full h-[80px] z-[100] flex items-center justify-center px-6 pointer-events-none">

            {/* 1. Raphael Logo/Pill Nav - Centered */}
            <div className="pointer-events-auto">
                <PillNav
                    logoNode={<RaphaelMark size={22} />}
                    items={pillItems}
                    activeHref={activePillHref}
                    initialLoadAnimation={false}
                    ease="power3.out"
                    baseColor="var(--color-surface-offset)"
                    pillColor="var(--color-surface-2)"
                    hoveredPillTextColor="var(--color-text)"
                    pillTextColor="var(--color-text-muted)"
                />
            </div>

            {/* 2. Avatar - Absolutely Pinned to the Right */}
            <div className="absolute right-8 pointer-events-auto">
                <Link href="/profile" className="active:scale-95 transition-transform block">
                    <UserAvatar user={user} size={38} initials={initials} ring />
                </Link>
            </div>
        </header>
    );
}

// ── Shared avatar helper ─────────────────────────────────────────────────────
function UserAvatar({
    user, size, initials, ring,
}: {
    user: ReturnType<typeof useUser>['user'];
    size: number;
    initials: string;
    ring?: boolean;
}) {
    const ringClass = ring ? 'ring-1 ring-[var(--color-border)]' : '';
    return user?.picture ? (
        <img
            src={user.picture}
            alt={user.name ?? 'User'}
            width={size}
            height={size}
            className={cn('rounded-full object-cover flex-shrink-0', ringClass)}
            style={{ width: size, height: size }}
        />
    ) : (
        <div
            className={cn('rounded-full flex-shrink-0 flex items-center justify-center font-bold', ringClass)}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.36,
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
            }}
        >
            {initials}
        </div>
    );
}