'use client';

import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import {
    CheckCircle2, Clock, BrainCircuit, ArrowRight, BarChart2, Sparkles
} from "lucide-react";

export default function DashboardPage() {
    const { user, isLoading } = useUser();
    const firstName = user?.name?.split(' ')[0] ?? 'Raphael';

    return (
        <div className="min-h-screen relative flex flex-col">

            {/* === DARKENING BACKDROP LAYER === */}
            {/* This ensures the Silk background is dimmed specifically on the dashboard, keeping it readable */}
            <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[-1] pointer-events-none"></div>

            {/* Detached Global Ribbon Navigation */}
            <TopNavBar />

            {/* Main Content Area - Pushed down to clear the ribbon */}
            <main className="flex-grow flex flex-col z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 relative pt-24 md:pt-32 pb-16">

                {/* HEADER */}
                <header className="flex flex-col gap-4 pb-8 sm:pb-12">
                    <div className="flex flex-col gap-3 max-w-3xl">
                        {isLoading ? (
                            <div className="w-64 sm:w-96 h-10 sm:h-12 bg-white/10 animate-pulse rounded-lg"></div>
                        ) : (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-on-surface tracking-tight">
                                Welcome back, <span className="text-primary text-glow">{firstName}</span>.
                            </h1>
                        )}
                        <p className="text-on-surface-variant text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                            Your learning path is evolving. We've synthesized 4 new modules based on your last interaction with Quantum Computing fundamentals.
                        </p>
                    </div>
                </header>

                <div className="flex flex-col gap-10 md:gap-14">

                    {/* STATS ROW */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <AcrylicGlass radius="rounded-3xl" className="p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:-translate-y-1 transition-transform duration-400">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Progress</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl sm:text-4xl font-manrope font-bold text-on-surface">12</span>
                                <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Courses Completed</span>
                            </div>
                        </AcrylicGlass>

                        <AcrylicGlass radius="rounded-3xl" className="p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:-translate-y-1 transition-transform duration-400">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-secondary" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Time</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl sm:text-4xl font-manrope font-bold text-on-surface">124</span>
                                <span className="text-xs sm:text-sm text-on-surface-variant font-medium">Hours Learned</span>
                            </div>
                        </AcrylicGlass>

                        <AcrylicGlass radius="rounded-3xl" className="p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:-translate-y-1 transition-transform duration-400 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center shrink-0">
                                    <BrainCircuit className="w-4 h-4 text-tertiary" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">AI Generation</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl sm:text-4xl font-manrope font-bold text-on-surface">842</span>
                                <span className="text-xs sm:text-sm text-on-surface-variant font-medium">AI Modules Generated</span>
                            </div>
                        </AcrylicGlass>
                    </section>

                    {/* IN PROGRESS */}
                    <section className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-manrope font-bold text-on-surface">In Progress</h2>
                            <Link href="/courses" className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Course Card 1 */}
                            <Link href="/courses/1" className="block group">
                                <AcrylicGlass radius="rounded-[24px]" className="flex flex-col h-full group-hover:border-white/20 transition-colors duration-400">
                                    {/* Relative Aspect Ratio Image Header */}
                                    <div className="w-full aspect-[2/1] sm:aspect-[21/9] relative bg-gradient-to-t from-surface-container-highest/50 to-[#081b29]/50 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent" style={{ backgroundSize: '10px 10px', backgroundImage: 'radial-gradient(circle, #a5cbe9 1px, transparent 1px)' }}></div>
                                        <div className="absolute bottom-4 left-6 px-2.5 py-1 rounded bg-background/50 backdrop-blur-md border border-white/10">
                                            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-secondary uppercase">Advanced</span>
                                        </div>
                                    </div>
                                    <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 flex-grow justify-between">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg sm:text-xl font-manrope font-bold text-on-surface group-hover:text-primary transition-colors">Neural Architectures for LLMs</h3>
                                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">A deep dive into transformer optimization and attention mechanism fine-tuning.</p>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                                <span>Completion</span>
                                                <span className="text-on-surface">74%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '74%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </AcrylicGlass>
                            </Link>

                            {/* Course Card 2 */}
                            <Link href="/courses/2" className="block group">
                                <AcrylicGlass radius="rounded-[24px]" className="flex flex-col h-full group-hover:border-white/20 transition-colors duration-400">
                                    {/* Relative Aspect Ratio Image Header */}
                                    <div className="w-full aspect-[2/1] sm:aspect-[21/9] relative bg-gradient-to-t from-surface-container-highest/50 to-[#2a0808]/50 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_10px,_#ea591f_10px,_#ea591f_20px)]"></div>
                                        <div className="absolute bottom-4 left-6 px-2.5 py-1 rounded bg-background/50 backdrop-blur-md border border-white/10">
                                            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-tertiary uppercase">Creative</span>
                                        </div>
                                    </div>
                                    <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 flex-grow justify-between">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg sm:text-xl font-manrope font-bold text-on-surface group-hover:text-tertiary transition-colors">Computational Aesthetics</h3>
                                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">Exploring the intersection of generative algorithms and classical art theory.</p>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                                <span>Completion</span>
                                                <span className="text-on-surface">32%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                                <div className="h-full bg-tertiary rounded-full transition-all duration-1000" style={{ width: '32%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </AcrylicGlass>
                            </Link>
                        </div>
                    </section>

                    {/* RECOMMENDED FOR YOU */}
                    <section className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <h2 className="text-xl sm:text-2xl font-manrope font-bold text-on-surface">Recommended for You</h2>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] sm:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border border-white/10 backdrop-blur-sm">AI Optimized</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Featured Recommendation (Takes 2 columns) */}
                            <AcrylicGlass radius="rounded-[24px]" className="lg:col-span-2 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
                                {/* Simulated 3D Globe Graphic - Aspect Ratio forces square-ish footprint gracefully */}
                                <div className="w-full md:w-1/2 aspect-video md:aspect-[4/3] rounded-2xl relative bg-gradient-to-br from-[#082a35]/40 to-[#000a10]/40 border border-white/5 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                                    <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-secondary/20 blur-xl absolute"></div>
                                    <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full border border-secondary/30 border-dashed animate-[spin_20s_linear_infinite]"></div>
                                    <div className="w-10 sm:w-16 h-10 sm:h-16 rounded-full border border-secondary/50 animate-[spin_15s_linear_infinite_reverse] absolute"></div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col gap-4 sm:gap-6">
                                    <div className="flex flex-col gap-2 sm:gap-3">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-manrope font-bold text-on-surface">Post-Digital Data Sovereignty</h3>
                                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                                            Based on your interest in privacy-preserving AI and global web decentralization, this module explores the next era of data ownership.
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <button className="w-full sm:w-auto bg-white text-background px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/90 transition-colors shadow-lg">
                                            Start Module
                                        </button>
                                    </div>
                                </div>
                            </AcrylicGlass>

                            {/* Secondary Recommendation */}
                            <Link href="/generator" className="block group h-full">
                                <AcrylicGlass radius="rounded-[24px]" className="h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 sm:gap-8 group-hover:border-white/20 transition-colors duration-400">
                                    <div className="flex flex-col gap-4 sm:gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center shrink-0">
                                            <BarChart2 className="w-5 h-5 text-tertiary" />
                                        </div>
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                            <h3 className="text-lg sm:text-xl font-manrope font-bold text-on-surface">Ethics in Latent Spaces</h3>
                                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                                                A short seminar on the bias detection in high-dimensional AI models.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors mt-auto pt-4">
                                        Explore Insights
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </AcrylicGlass>
                            </Link>

                        </div>
                    </section>

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