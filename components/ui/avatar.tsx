import Avatar from '@mui/material/Avatar';
import { useUser } from '@auth0/nextjs-auth0/client';
import { cn } from '@/lib/utils/cn';
import { UserCircle2 } from 'lucide-react';

// ── Shared avatar helper ─────────────────────────────────────────────────────
export function UserAvatar({
    user, size, initials, ring,
}: {
    user: ReturnType<typeof useUser>['user'];
    size: number;
    initials: string;
    ring?: boolean;
}) {
    const ringClass = ring ? 'ring-2 ring-outline-variant/30 ring-offset-2 ring-offset-background' : '';

    // If user has a profile picture
    if (user?.picture) {
        return (
            <Avatar
                alt={user.name ?? 'User Avatar'}
                src={user.picture}
                sx={{ width: size, height: size }}
                className={cn('shadow-sm', ringClass)}
            />
        );
    }

    // If no picture, but we have an initial
    if (initials) {
        return (
            <Avatar
                sx={{
                    width: size,
                    height: size,
                    bgcolor: 'var(--md-primary-container)',
                    color: 'var(--md-on-primary-container)',
                    fontSize: size * 0.45 // Dynamically scale font size relative to avatar size
                }}
                className={cn('font-manrope font-bold', ringClass)}
            >
                {initials}
            </Avatar>
        );
    }

    // Ultimate fallback if nothing else is available
    return (
        <UserCircle2
            style={{ width: size, height: size }}
            className={cn("text-on-surface-variant", ringClass)}
        />
    );
}