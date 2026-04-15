'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

export type PillNavItem = {
    label: string;
    href: string;
};

export interface PillNavProps {
    items: PillNavItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
}

export const PillNav: React.FC<PillNavProps> = ({
    items,
    className = '',
    ease = 'power3.easeOut',
    baseColor = 'rgba(255, 255, 255, 0.1)', // Subtle white hover fill
    pillColor = 'transparent',               // Flush with acrylic ribbon
    hoveredPillTextColor = '#ffffff',        // Bright white on hover
    pillTextColor = 'var(--md-on-surface-variant)', // Grayed out by default
}) => {
    const pathname = usePathname();
    const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
    const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach((circle) => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement as HTMLElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector<HTMLElement>('.pill-label');
                const white = pill.querySelector<HTMLElement>('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                const index = circleRefs.current.indexOf(circle);
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.4, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 0.4, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 0.4, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();
        window.addEventListener('resize', layout);
        if (document.fonts) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        return () => window.removeEventListener('resize', layout);
    }, [items, ease]);

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const cssVars = {
        '--base': baseColor,
        '--pill-bg': pillColor,
        '--hover-text': hoveredPillTextColor,
        '--pill-text': pillTextColor,
    } as React.CSSProperties;

    return (
        <ul
            role="menubar"
            className={`list-none flex items-stretch m-0 p-0 h-12 gap-1 ${className}`}
            style={cssVars}
        >
            {items.map((item, i) => {
                // Simple active check
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                const pillStyle: React.CSSProperties = {
                    background: 'var(--pill-bg)',
                    color: isActive ? 'var(--hover-text)' : 'var(--pill-text)',
                };

                const basePillClasses =
                    'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-medium text-sm transition-colors cursor-pointer px-4';

                return (
                    <li key={item.href} role="none" className="flex h-full py-1.5">
                        <Link
                            role="menuitem"
                            href={item.href}
                            className={basePillClasses}
                            style={pillStyle}
                            onMouseEnter={() => handleEnter(i)}
                            onMouseLeave={() => handleLeave(i)}
                        >
                            <span
                                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                                style={{ background: 'var(--base)', willChange: 'transform' }}
                                aria-hidden="true"
                                ref={(el) => { circleRefs.current[i] = el; }}
                            />
                            <span className="label-stack relative inline-block leading-[1] z-[2] overflow-hidden h-[1em]">
                                <span
                                    className="pill-label relative z-[2] block leading-[1]"
                                    style={{ willChange: 'transform' }}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className="pill-label-hover absolute left-0 top-0 z-[3] block"
                                    style={{ color: 'var(--hover-text)', willChange: 'transform, opacity' }}
                                    aria-hidden="true"
                                >
                                    {item.label}
                                </span>
                            </span>
                            {isActive && (
                                <span
                                    className="absolute left-1/2 bottom-[4px] -translate-x-1/2 w-1 h-1 rounded-full z-[4]"
                                    style={{ background: 'var(--hover-text)' }}
                                    aria-hidden="true"
                                />
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};