'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import { Clock, Check, BrainCircuit, X, Sparkles } from "lucide-react";

export default function GenerationProgressPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    // Simulated Progress State (Replace with Celery backend polling logic later)
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Redirect to the actual course viewer when complete
                    setTimeout(() => router.push(`/courses/${courseId}`), 1000);
                    return 100;
                }
                return Math.min(prev + Math.random() * 4, 100);
            });
        }, 600);

        return () => clearInterval(interval);
    }, [courseId, router]);

    const getStepState = (threshold: number, nextThreshold: number) => {
        if (progress >= nextThreshold) return 'completed';
        if (progress >= threshold) return 'active';
        return 'pending';
    };

    const steps = [
        { title: "Topic Analysis", desc: "Identified core semantic entities", threshold: 0, next: 25 },
        { title: "Structure Mapping", desc: "Hierarchical content tree validated", threshold: 25, next: 50 },
        { title: "Content Synthesis", desc: "Generating specialized modules...", threshold: 50, next: 75 },
        { title: "Asset Generation", desc: "Synthesizing visual and interactive aids", threshold: 75, next: 95 },
        { title: "Final Assembly", desc: "Ready for deployment", threshold: 95, next: 101 },
    ];

    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen relative flex flex-col">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] pointer-events-none"></div>

            <TopNavBar />

            <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 relative pt-24 md:pt-32 pb-16 z-10">

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl font-black text-primary font-manrope tracking-tight">Generation Progress</h2>
                    <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/30"></div>
                    <span className="text-on-surface-variant text-xs sm:text-sm tracking-wide">Course ID: {courseId.slice(0, 8)}...</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left: Progress Cluster */}
                    <div className="lg:col-span-7 flex flex-col items-center text-center gap-10 lg:gap-12">
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90 transform origin-center">
                                <circle
                                    cx="50%" cy="50%" r={radius}
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-surface-container-highest/20"
                                />
                                <circle
                                    cx="50%" cy="50%" r={radius}
                                    fill="transparent"
                                    stroke="url(#violet-grad)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    className="drop-shadow-[0_0_15px_rgba(112,0,204,0.4)] transition-all duration-700 ease-out"
                                />
                                <defs>
                                    <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#dab9ff" />
                                        <stop offset="100%" stopColor="#7000cc" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="flex flex-col items-center">
                                <span className="text-6xl sm:text-8xl font-manrope font-extrabold tracking-tighter text-on-surface">
                                    {Math.round(progress)}<span className="text-primary-container text-3xl sm:text-4xl">%</span>
                                </span>
                                <span className="text-on-surface-variant font-inter uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-2 font-bold">
                                    Completion
                                </span>
                            </div>
                        </div>

                        <AcrylicGlass radius="rounded-3xl" className="p-6 sm:p-8 w-full max-w-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium">Estimated Time Remaining</p>
                                </div>
                                <span className="font-manrope font-bold text-lg sm:text-xl text-primary">
                                    {Math.max(0, Math.ceil(15 - (progress / 100) * 15))}s
                                </span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-container to-primary transition-all duration-700 ease-out relative"
                                    style={{ width: `${Math.min(100, progress + 10)}%` }}
                                >
                                    <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30"></div>
                                </div>
                            </div>
                        </AcrylicGlass>
                    </div>

                    {/* Right: AI Pipeline Overview */}
                    <div className="lg:col-span-5 w-full">
                        <AcrylicGlass radius="rounded-3xl" className="p-8 sm:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <BrainCircuit className="text-primary w-16 h-16 sm:w-20 sm:h-20" />
                            </div>

                            <h3 className="font-manrope text-xl sm:text-2xl font-bold mb-8 sm:mb-10 text-on-surface relative z-10">Pipeline Overview</h3>

                            <div className="space-y-6 sm:space-y-8 relative z-10">
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-container via-primary-container/40 to-surface-variant/20"></div>

                                {steps.map((step, idx) => {
                                    const state = getStepState(step.threshold, step.next);

                                    return (
                                        <div key={idx} className={`flex items-start gap-4 sm:gap-6 group transition-opacity duration-500 ${state === 'pending' ? 'opacity-40' : 'opacity-100'}`}>

                                            <div className="relative z-10 shrink-0">
                                                {state === 'completed' && (
                                                    <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center shadow-glow-violet-sm">
                                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                                    </div>
                                                )}
                                                {state === 'active' && (
                                                    <>
                                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-pulse shadow-glow-violet-sm">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                                        </div>
                                                        <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping scale-150 opacity-20"></div>
                                                    </>
                                                )}
                                                {state === 'pending' && (
                                                    <div className="w-6 h-6 rounded-full border-2 border-surface-variant bg-surface flex items-center justify-center"></div>
                                                )}
                                            </div>

                                            <div className={`flex-1 pb-4 ${idx !== steps.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                    <p className={`font-manrope font-bold ${state === 'active' ? 'text-primary' : 'text-on-surface'}`}>
                                                        {step.title}
                                                    </p>
                                                    {state === 'active' && (
                                                        <span className="self-start text-[9px] sm:text-[10px] bg-primary-container/20 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-on-surface-variant mt-1 font-inter font-medium">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AcrylicGlass>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center gap-8">
                    <button
                        onClick={() => router.push('/generator')}
                        className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-full text-on-surface-variant font-manrope font-bold hover:bg-error/10 hover:text-error hover:border-error/30 transition-all duration-300 flex items-center gap-3 active:scale-95 backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                        Cancel Generation
                    </button>

                    <div className="flex items-center gap-8 sm:gap-12 opacity-80">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-1 font-bold">Compute Load</span>
                            <span className="text-xs sm:text-sm font-manrope font-bold text-on-surface">High Intensity</span>
                        </div>
                        <div className="h-8 w-[1px] bg-outline-variant/20"></div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-1 font-bold">Neural Engine</span>
                            <span className="text-xs sm:text-sm font-manrope font-bold text-on-surface">Raphael-v4.2-Pro</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
                <AcrylicGlass radius="rounded-2xl" className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-2xl animate-bounce-slow border-white/20">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#dab9ff] to-[#ea591f] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="pr-2">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-primary/80">Insight</p>
                        <p className="text-xs sm:text-sm text-on-surface font-medium whitespace-nowrap">Synthesizing visual aids...</p>
                    </div>
                </AcrylicGlass>
            </div>

        </div>
    );
}