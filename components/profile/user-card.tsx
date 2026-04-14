'use client';

import * as React from 'react';
import { BookOpen, Clock, Layers, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { formatMinutes } from '@/lib/utils/format';
import type { User } from '@/lib/types/user.types';

interface UserCardProps {
  user: User;
  coursesCount: number;
  totalTopics: number;
  totalMinutes: number | null;
}

// ── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({
  icon: Icon, value, label,
}: {
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  value: string | number;
  label: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        padding: '1.25rem 0.75rem',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-offset)',
        border: '1px solid var(--color-border)',
        flex: 1,
      }}
    >
      <Icon size={14} style={{ color: 'var(--color-text-faint)' }} />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-text-faint)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function UserCard({ user, coursesCount, totalTopics, totalMinutes }: UserCardProps) {
  const [deleteHovered, setDeleteHovered] = React.useState(false);

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user.email?.[0] ?? 'U').toUpperCase();

  const provider = user.picture?.includes('google') ? 'Google' : 'Email';

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          padding: '2.5rem 2rem 4.5rem',
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%,
              rgba(112,0,204,0.12) 0%,
              transparent 70%
            ),
            var(--color-surface-2)
          `,
          borderBottom: '1px solid var(--color-divider)',
          // Decorative grid overlay
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px),
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(112,0,204,0.12) 0%, transparent 70%),
            var(--color-surface-2)
          `,
          backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
        }}
      >
        {/* Provider badge — top right */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2em 0.65em',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface-offset)',
            border: '1px solid var(--color-border)',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--color-text-faint)',
          }}
        >
          {provider === 'Google'
            ? <ShieldCheck size={10} />
            : <Mail size={10} />}
          {provider}
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ position: 'relative' }}>
            {/* Glow ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, var(--color-primary), var(--color-accent), var(--color-primary))',
                opacity: 0.5,
              }}
              aria-hidden
            />
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name ?? 'User'}
                width={80}
                height={80}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  position: 'relative',
                  border: '3px solid var(--color-surface)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  flexShrink: 0,
                  position: 'relative',
                  border: '3px solid var(--color-surface)',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name + email */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: 'var(--color-text)',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                marginBottom: '0.25rem',
              }}
            >
              {user.name || 'User'}
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <StatTile icon={BookOpen} value={coursesCount} label="Courses" />
        <StatTile icon={Layers} value={totalTopics} label="Topics" />
        <StatTile icon={Clock} value={formatMinutes(totalMinutes ?? null)} label="Learned" />
      </div>

      {/* ── Danger zone ──────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.15rem' }}>
            Sign out
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-text-faint)' }}>
            You'll be redirected to the login page.
          </p>
        </div>
        <a
          href="/auth/logout"
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            flexShrink: 0,
            transition: 'all 120ms cubic-bezier(0.16,1,0.3,1)',
            background: deleteHovered ? 'rgba(234,89,31,0.15)' : 'var(--color-surface-offset)',
            color: deleteHovered ? 'var(--color-error)' : 'var(--color-text-muted)',
            border: `1px solid ${deleteHovered ? 'rgba(234,89,31,0.25)' : 'var(--color-border)'}`,
          }}
        >
          <LogOut size={13} />
          Sign out
        </a>
      </div>
    </div>
  );
}