'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import { ElasticSlider } from "@/components/ui/elastic-slider";
import { Sparkles, ArrowRight, Settings, Loader2 } from "lucide-react";

export default function GeneratorPage() {
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [depth, setDepth] = useState(50);
    const [time, setTime] = useState(50);
    const [isGenerating, setIsGenerating] = useState(false);

    const getDepthLabel = (val: number) => {
        if (val < 33) return "Academic Survey";
        if (val < 66) return "Specialist Deep-Dive";
        return "Expert Synthesis";
    };

    const getTimeLabel = (val: number) => {
        if (val < 33) return "1-2 Weeks";
        if (val < 66) return "4-6 Weeks";
        return "Comprehensive Path";
    };

    const handleCurate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);

        try {
            const level = depth < 33 ? "beginner" : depth < 66 ? "intermediate" : "advanced";

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: topic,
                    level: level
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect to the dynamic progress page using the UUID
                router.push(`/generator/${data.id}`);
            } else {
                console.error("Failed to curate course");
            }
        } catch (error) {
            console.error("Error connecting to backend API", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] pointer-events-none"></div>
            <TopNavBar />

            <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-8 relative pt-32 pb-16 z-10">
                <div className="w-full flex flex-col items-center text-center">

                    <div className="space-y-4 animate-fadeInUp">
                        <span className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-primary uppercase font-bold">
                            AI Powered Curator
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-manrope font-extrabold tracking-tight text-on-surface leading-[1.1]">
                            What do you want to <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary text-glow">
                                learn today?
                            </span>
                        </h1>
                    </div>

                    <div className="w-full mt-10 sm:mt-14 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div className="relative group w-full">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-20 group-focus-within:opacity-60 transition duration-700 pointer-events-none"></div>

                            <AcrylicGlass radius="rounded-[2rem]" className="relative p-2 sm:p-3 flex items-center shadow-2xl transition-colors duration-300 group-focus-within:border-primary/30 group-focus-within:bg-white/[0.05]">
                                <div className="pl-4 sm:pl-6 pr-2 sm:pr-4 shrink-0">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>

                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCurate()}
                                    disabled={isGenerating}
                                    placeholder="Quantum Physics for Beginners..."
                                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-base sm:text-lg lg:text-xl font-medium placeholder:text-on-surface-variant/50 text-on-surface py-3 px-2 disabled:opacity-50"
                                />

                                <button
                                    onClick={handleCurate}
                                    disabled={isGenerating || !topic.trim()}
                                    className="primary-gradient-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-[1.5rem] font-bold hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shrink-0 shadow-glow-violet-sm disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="hidden sm:block text-sm lg:text-base">Curate</span>
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </>
                                    )}
                                </button>
                            </AcrylicGlass>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                            <button onClick={() => setTopic("Advanced UX Strategy")} className="px-4 sm:px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-all backdrop-blur-md">
                                "Advanced UX Strategy"
                            </button>
                            <button onClick={() => setTopic("History of the Renaissance")} className="px-4 sm:px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-all backdrop-blur-md">
                                "History of the Renaissance"
                            </button>
                        </div>
                    </div>

                    <div className="pt-10 sm:pt-14 mt-10 sm:mt-14 w-full flex flex-col items-center border-t border-outline-variant/10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <button className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 sm:mb-8 group">
                            <Settings className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                            <span className="font-inter text-[10px] uppercase tracking-[0.2em] font-bold">Refine Generation</span>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">

                            <AcrylicGlass radius="rounded-2xl" className="p-6 sm:p-8 flex flex-col gap-2 sm:gap-3 text-left group transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="font-inter text-[10px] text-primary font-bold uppercase tracking-widest">Course Depth</span>
                                    <span className="text-xs text-on-surface-variant font-medium">{getDepthLabel(depth)}</span>
                                </div>
                                <ElasticSlider
                                    defaultValue={50}
                                    onChange={setDepth}
                                    activeColor="bg-primary"
                                    className="w-full"
                                />
                                <div className="flex justify-between text-[9px] sm:text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-tighter mt-1">
                                    <span className={depth < 33 ? 'text-primary' : ''}>Survey</span>
                                    <span className={depth >= 33 && depth < 66 ? 'text-primary' : ''}>Specialist</span>
                                    <span className={depth >= 66 ? 'text-primary' : ''}>Expert</span>
                                </div>
                            </AcrylicGlass>

                            <AcrylicGlass radius="rounded-2xl" className="p-6 sm:p-8 flex flex-col gap-2 sm:gap-3 text-left group transition-colors">
                                <div className="flex justify-between items-center">
                                    <span className="font-inter text-[10px] text-secondary font-bold uppercase tracking-widest">Time Commitment</span>
                                    <span className="text-xs text-on-surface-variant font-medium">{getTimeLabel(time)}</span>
                                </div>
                                <ElasticSlider
                                    defaultValue={50}
                                    onChange={setTime}
                                    activeColor="bg-secondary"
                                    className="w-full"
                                />
                                <div className="flex justify-between text-[9px] sm:text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-tighter mt-1">
                                    <span className={time < 33 ? 'text-secondary' : ''}>Crash</span>
                                    <span className={time >= 33 && time < 66 ? 'text-secondary' : ''}>Standard</span>
                                    <span className={time >= 66 ? 'text-secondary' : ''}>Full Path</span>
                                </div>
                            </AcrylicGlass>

                        </div>
                    </div>

                    <div className={`mt-16 sm:mt-24 flex flex-col items-center gap-4 sm:gap-5 transition-opacity duration-500 ${isGenerating ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-secondary' : 'bg-primary'} animate-pulse`}></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-secondary' : 'bg-primary/60'} animate-pulse`} style={{ animationDelay: '75ms' }}></div>
                            <div className={`w-3.5 h-3.5 rounded-full ${isGenerating ? 'bg-secondary' : 'bg-primary/40'} animate-pulse`} style={{ animationDelay: '150ms' }}></div>
                            <div className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-secondary' : 'bg-primary/60'} animate-pulse`} style={{ animationDelay: '75ms' }}></div>
                            <div className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-secondary' : 'bg-primary'} animate-pulse`}></div>
                        </div>
                        <p className="font-inter text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black">
                            {isGenerating ? "Synthesizing Neural Curriculum..." : "Raphael Engine Ready"}
                        </p>
                    </div>

                </div>
            </main>

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