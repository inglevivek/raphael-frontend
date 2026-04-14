"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// --- VISUAL CONSTANTS (Linear Style) ---
const gridBackdrop = "absolute inset-0 z-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none bg-[grid:rgba(255,255,255,0.1)_40px_40px]";
const glowRadial = "absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-primary)] opacity-10 blur-[120px] pointer-events-none";

// --- ANIMATION VARIANTS (Premium Spring) ---
const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, type: "spring", stiffness: 100 },
    },
};

const fadeInItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// ============================================================================
// INTERNAL LANDING PAGE SUB-COMPONENTS
// ============================================================================

// 1. Navbar: Remastered as a floating glass pill (matches inspiration)
function FloatingNavbar() {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-[56px] bg-[rgba(26,25,24,0.7)] backdrop-blur-md border border-[var(--color-divider)] z-50 px-6 rounded-full flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-md" /> {/* Logo Icon */}
                <span className="font-display text-white font-bold text-lg tracking-tight">Raphael</span>
            </div>

            <div className="flex items-center gap-3">
                {/* Preserving Auth0 Links */}
                <Link href="/auth/login" className="hidden sm:block">
                    <Button variant="ghost" className="text-[var(--color-text-muted)] hover:text-white transition-colors">Sign in</Button>
                </Link>
                <Link href="/auth/login">
                    <Button variant="accent" className="rounded-full px-5 shadow-[0_0_15px_rgba(112,0,204,0.3)]">
                        Get started &rarr;
                    </Button>
                </Link>
            </div>
        </nav>
    );
}

// 2. Bento Grid Item (Matches Problem Section in Inspiration)
function BentoCard({ num, title, desc }: { num: number; title: string; desc: string }) {
    return (
        <motion.div
            variants={fadeInItem}
            className="group p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[var(--color-divider)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-inner"
        >
            <div className="text-[var(--color-primary)] font-mono text-sm mb-4 opacity-50 group-hover:opacity-100">0{num} —</div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-display">{title}</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-sm font-body">{desc}</p>
        </motion.div>
    );
}

// 3. How It Works Step
function StepItem({ num, title, desc, total }: { num: number; title: string; desc: string; total: number }) {
    return (
        <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -10 }}
            viewport={{ once: true }}
            className="relative pl-16 group"
        >
            {num < total && (
                <div className="absolute left-6 top-10 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-divider)] to-transparent group-hover:from-[var(--color-primary)] transition-colors" />
            )}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-xl bg-[var(--color-bg)] border border-[var(--color-divider)] flex items-center justify-center text-white font-bold z-10 group-hover:border-[var(--color-primary)] transition-colors shadow-2xl shadow-[var(--color-bg)] font-display">
                {num}
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-display">{title}</h3>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed font-body">{desc}</p>
        </motion.div>
    );
}


// ============================================================================
// MAIN UNIFIED LANDING PAGE COMPONENT
// ============================================================================

export default function UnifiedLandingPage() {
    const problems = [
        { title: "Shattered Context", desc: "YouTube lists miss theory. Articles miss practice. Nothing connects." },
        { title: "The Search Trap", desc: "2 hours lost comparing tutorials before you even read a line of code." },
        { title: "The LLM Wall", desc: "ChatGPT dumps raw text; it doesn't teach. You need curriculum, not a chat." },
    ];

    const steps = [
        { title: "Core Architecture", desc: "Raphael maps out a pedagogical curriculum based on your specific topic and level." },
        { title: "Node Expansion", desc: "Each module is broken into objectives and core concepts to ensure mastery." },
        { title: "Content Synthesis", desc: "Our engine generates rich, Markdown-formatted content acting as an expert tutor." },
        { title: "Resource Injection", desc: "Automated scraping of the best YouTube and academic references to back up the AI." },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="relative min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden"
        >
            {/* Visual Polish Layers */}
            <div className={gridBackdrop} />
            <div className={glowRadial} />

            <FloatingNavbar />

            <main className="relative z-10">
                {/* HERO SECTION */}
                <section className="min-h-[90dvh] flex flex-col items-center justify-center pt-28 px-4 text-center max-w-5xl mx-auto">
                    <motion.div variants={fadeInItem} className="mb-6">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] border border-[var(--color-primary-subtle)] bg-[var(--color-primary-subtle)] rounded-full">
                            The Knowledge Engine
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeInItem} className="text-6xl md:text-8xl font-display font-bold tracking-tight text-white mb-6 leading-[1.05]">
                        Learn anything.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-purple-400 to-pink-500">
                            Minus the noise.
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInItem} className="text-[var(--text-lg)] text-[var(--color-text-muted)] max-w-xl mb-12 leading-relaxed font-body">
                        Raphael synthesizes the chaos of the internet into structured, pedagogical paths. Tell it what you want—get a roadmap in seconds.
                    </motion.p>

                    <motion.div variants={fadeInItem} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        {/* Preserving Links */}
                        <Link href="/auth/login">
                            <Button variant="accent" size="lg" className="w-full sm:w-auto text-md px-10 py-7 rounded-xl font-bold shadow-lg shadow-[var(--color-primary-subtle)]">
                                Start Generating &rarr;
                            </Button>
                        </Link>
                        <a href="#how-it-works">
                            <Button variant="ghost" size="lg" className="w-full sm:w-auto border border-[var(--color-divider)] px-10 py-7 rounded-xl text-white">
                                See Engine &darr;
                            </Button>
                        </a>
                    </motion.div>
                </section>

                {/* PROBLEM/FEATURE SECTION (Bento Grid) */}
                <motion.section
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="py-24 px-6 max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {problems.map((p, i) => (
                            <BentoCard key={i} num={i + 1} title={p.title} desc={p.desc} />
                        ))}
                    </div>
                </motion.section>

                {/* HOW IT WORKS (Enhanced Step List) */}
                <section id="how-it-works" className="py-24 px-6 max-w-3xl mx-auto">
                    <h2 className="text-5xl font-display font-bold text-center text-white mb-20 tracking-tight">The Process</h2>
                    <div className="relative space-y-16">
                        {steps.map((step, i) => (
                            <StepItem key={i} num={i + 1} title={step.title} desc={step.desc} total={steps.length} />
                        ))}
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-32 px-6">
                    <motion.div
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[#4c008a] rounded-[2rem] p-16 text-center shadow-[0_0_60px_rgba(112,0,204,0.2)] border border-[var(--color-primary-subtle)]"
                    >
                        <h2 className="text-5xl font-display font-bold text-white mb-6 tracking-tight">Ready to learn smarter?</h2>
                        <p className="text-purple-100 text-lg mb-10 max-w-md mx-auto leading-relaxed font-body">Join Raphael and stop wasting time on 100-tab research sessions.</p>
                        <Link href="/auth/login">
                            <Button size="lg" className="bg-white text-[var(--color-primary)] hover:bg-gray-100 px-12 py-8 rounded-xl font-bold text-lg shadow-xl">
                                Get Started Free
                            </Button>
                        </Link>
                    </motion.div>
                </section>
            </main>

            {/* FOOTER: Minimal one-liner */}
            <footer className="h-20 border-t border-[var(--color-divider)] flex items-center justify-between px-8 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)] font-mono">
                <span>&copy; 2026 RAPHAEL</span>
                <a href="https://auth0.com" target="_blank" className="hover:text-white transition-colors">Security by Auth0</a>
                <span>BUILT BY VIVEK</span>
            </footer>

        </motion.div>
    );
}