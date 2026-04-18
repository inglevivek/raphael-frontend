'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import { CoursesAPI } from "@/lib/api/courses.api";
import type { CourseMeta } from "@/lib/types/course.types";
import {
    Search, Play, Plus, Loader2, ArrowRight, Zap
} from "lucide-react";

export default function CoursesLibraryPage() {
    const { user, isLoading: authLoading } = useUser();

    const [courses, setCourses] = useState<CourseMeta[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user) {
            CoursesAPI.list()
                .then((data) => {
                    // Sort newest first
                    const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    setCourses(sorted);
                })
                .catch((err) => console.error("Failed to load courses:", err))
                .finally(() => setIsFetching(false));
        } else if (!authLoading) {
            setIsFetching(false);
        }
    }, [user, authLoading]);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen relative flex flex-col">

            {/* === DARKENING BACKDROP LAYER === */}
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] pointer-events-none"></div>

            {/* Detached Global Ribbon Navigation */}
            <TopNavBar />

            <main className="flex-grow flex flex-col z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 relative pt-24 md:pt-32 pb-16">

                {/* HEADER & SEARCH BAR */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-outline-variant/10">
                    <div className="flex flex-col gap-3 max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-manrope font-extrabold text-on-surface tracking-tight">
                            Your <span className="text-primary text-glow">Courses</span>
                        </h1>
                        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                            Explore your curated AI pathways. Each course is a living architecture of intelligence designed specifically for your growth.
                        </p>
                    </div>

                    <div className="w-full lg:w-80 shrink-0">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search knowledge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-full py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:bg-surface-container-low transition-all"
                            />
                        </div>
                    </div>
                </header>

                {/* COURSE GRID */}
                <div className="pt-10">
                    {isFetching || authLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-full aspect-[4/5] bg-white/5 animate-pulse rounded-[24px]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                            {/* Map through fetched courses */}
                            {filteredCourses.map((course) => {
                                // Design Mappings based on Level
                                const styleMap = {
                                    advanced: { color: 'primary', hex: '#dab9ff', bg: 'from-[#2a0053]', border: 'border-primary/30' },
                                    intermediate: { color: 'tertiary', hex: '#ffb59c', bg: 'from-[#5c1900]', border: 'border-tertiary/30' },
                                    beginner: { color: 'secondary', hex: '#a5cbe9', bg: 'from-[#05344c]', border: 'border-secondary/30' },
                                };
                                const style = styleMap[course.level] || styleMap.beginner;

                                // Placeholder progress logic (0% for new/generating, 45% visually for others)
                                const progress = course.status === 'completed' ? 45 : 0;
                                const targetLink = course.status === 'completed' ? `/courses/${course.id}` : `/generator/${course.id}`;

                                return (
                                    <Link key={course.id} href={targetLink} className="block group h-full">
                                        <AcrylicGlass radius="rounded-[24px]" className="flex flex-col h-full group-hover:border-white/20 transition-all duration-400 overflow-hidden shadow-2xl">

                                            {/* Image/Gradient Header */}
                                            <div className={`w-full h-40 sm:h-48 relative bg-gradient-to-t ${style.bg} to-surface-container-highest flex items-start justify-end p-4 overflow-hidden border-b border-white/5`}>
                                                {/* Abstract Pattern Overlay */}
                                                <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{ backgroundSize: '8px 8px', backgroundImage: `radial-gradient(circle, ${style.hex} 1px, transparent 1px)` }}></div>

                                                {/* Level Badge */}
                                                <div className="relative z-10 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                                    <span className={`text-[9px] font-bold tracking-widest text-${style.color} uppercase`}>{course.level}</span>
                                                </div>

                                                {/* Generating Overlay */}
                                                {course.status !== 'completed' && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                                                        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10">
                                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Generating</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between bg-surface-container-lowest/50">
                                                <div className="mb-8">
                                                    <h3 className="text-xl sm:text-2xl font-manrope font-bold text-on-surface line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {course.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col gap-4 mt-auto">
                                                    {/* Progress Bar (Placeholder) */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                                            <span>Progress</span>
                                                            <span className="text-on-surface">{progress}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full bg-gradient-to-r from-${style.color}/50 to-${style.color} rounded-full transition-all duration-1000 relative`} style={{ width: `${progress}%` }}>
                                                                <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Button */}
                                                    <button className="w-full mt-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold text-sm text-on-surface transition-colors flex items-center justify-center gap-2 group-hover:border-white/20">
                                                        {progress > 0 ? (
                                                            <>Resume <Play className="w-4 h-4 fill-current" /></>
                                                        ) : course.status === 'completed' ? (
                                                            <>Start <Zap className="w-4 h-4 fill-current" /></>
                                                        ) : (
                                                            <>View Status <ArrowRight className="w-4 h-4" /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </AcrylicGlass>
                                    </Link>
                                );
                            })}

                            {/* CREATE NEW PATH CARD */}
                            <Link href="/generator" className="block group h-full">
                                <div className="h-full min-h-[400px] p-6 sm:p-8 rounded-[24px] border-2 border-dashed border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest/30 hover:bg-primary/5 transition-all duration-400 flex flex-col items-center justify-center text-center gap-6 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform duration-400 border border-outline-variant/20 shadow-xl">
                                        <Plus className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-manrope font-bold text-on-surface mb-3">Create New Path</h3>
                                        <p className="text-sm text-on-surface-variant leading-relaxed max-w-[250px] mx-auto">
                                            Prompt Raphael to architect a unique learning experience tailored for you.
                                        </p>
                                    </div>
                                    <button className="mt-4 primary-gradient-btn px-8 py-3.5 rounded-xl font-bold text-sm shadow-glow-violet-sm group-hover:shadow-[0_0_30px_rgba(112,0,204,0.4)] transition-all">
                                        Generate Now
                                    </button>
                                </div>
                            </Link>

                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER */}
            <footer className="w-full py-8 text-center text-[10px] sm:text-xs text-on-surface-variant/60 font-inter border-t border-white/5 bg-background/20 backdrop-blur-md relative z-10 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>&copy; 2024 RAPHAEL AI. THE DIGITAL CURATOR.</p>
                    <div className="flex gap-6 sm:gap-8">
                        <Link href="/privacy" className="hover:text-on-surface transition-colors">PRIVACY</Link>
                        <Link href="/terms" className="hover:text-on-surface transition-colors">TERMS</Link>
                        <Link href="/api-docs" className="hover:text-on-surface transition-colors">API</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}