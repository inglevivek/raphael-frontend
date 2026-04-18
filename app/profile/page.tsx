
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { TopNavBar } from "@/components/landing/navigation";
import { AcrylicGlass } from "@/components/react-bits/acrylicGlass";
import {
    Edit2, Award, Zap, Sparkles, Gem, BookOpen, Settings
} from "lucide-react";

export default function ProfilePage() {
    const { user, isLoading } = useUser();

    // Fallbacks while loading or if data is missing
    const displayName = user?.name || "Loading...";
    const displayImage = user?.picture || "";

    return (
        <div className="min-h-screen relative flex flex-col">

            {/* === DARKENING BACKDROP LAYER === */}
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[-1] pointer-events-none"></div>

            {/* Detached Global Ribbon Navigation */}
            <TopNavBar />

            <main className="flex-grow flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-8 relative pt-24 md:pt-32 pb-16 z-10">

                {/* PROFILE HEADER */}
                <AcrylicGlass radius="rounded-[24px]" className="p-6 sm:p-10 mb-8 sm:mb-12 flex flex-col md:flex-row items-center text-center md:text-left gap-6 sm:gap-8 shadow-glow-violet-sm">
                    {/* Avatar Group */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-primary opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface-container-highest relative z-10 overflow-hidden bg-surface-container flex items-center justify-center">
                            {isLoading ? (
                                <div className="w-full h-full animate-pulse bg-white/10"></div>
                            ) : displayImage ? (
                                <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-bold text-on-surface-variant">{displayName.charAt(0)}</span>
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 sm:p-2.5 primary-gradient-btn text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform z-20">
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 flex flex-col gap-1">
                        <h1 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
                            {displayName}
                        </h1>
                        <p className="font-inter text-secondary text-xs sm:text-sm tracking-widest opacity-80 uppercase font-semibold">
                            Elite Curator • Joined Jan 2024
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mt-4 sm:mt-6">
                            <div className="bg-surface-container-low px-4 sm:px-5 py-2 sm:py-3 rounded-xl border border-outline-variant/10">
                                <span className="block text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Courses Completed</span>
                                <span className="text-xl sm:text-2xl font-manrope font-bold text-primary">24</span>
                            </div>
                            <div className="bg-surface-container-low px-4 sm:px-5 py-2 sm:py-3 rounded-xl border border-outline-variant/10">
                                <span className="block text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">AI Generations</span>
                                <span className="text-xl sm:text-2xl font-manrope font-bold text-primary">152</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Action (Desktop) */}
                    <div className="hidden md:flex gap-3 shrink-0">
                        <button className="px-6 py-3 primary-gradient-btn text-white font-bold rounded-xl shadow-violet-cta hover:scale-105 active:scale-95 transition-transform duration-400 text-sm">
                            Edit Profile
                        </button>
                    </div>
                </AcrylicGlass>

                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                    {/* Achievement Badges */}
                    <section className="lg:col-span-4 h-full">
                        <AcrylicGlass radius="rounded-[24px]" className="p-6 sm:p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6 sm:mb-8">
                                <h2 className="font-manrope text-lg sm:text-xl font-bold tracking-tight text-on-surface">Achievement Badges</h2>
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 flex-grow content-start">
                                <div className="group flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-outline-variant/10 group-hover:border-primary/30">
                                        <Zap className="w-6 h-6 text-primary fill-primary/20" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-on-surface-variant text-center">Fast Learner</span>
                                </div>
                                <div className="group flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-secondary/20 transition-colors border border-outline-variant/10 group-hover:border-secondary/30">
                                        <Sparkles className="w-6 h-6 text-secondary fill-secondary/20" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-on-surface-variant text-center">AI Pioneer</span>
                                </div>
                                <div className="group flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-tertiary/20 transition-colors border border-outline-variant/10 group-hover:border-tertiary/30">
                                        <Gem className="w-6 h-6 text-tertiary fill-tertiary/20" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-on-surface-variant text-center">Top 1%</span>
                                </div>
                                <div className="group flex flex-col items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10">
                                        <BookOpen className="w-6 h-6 text-on-surface-variant" />
                                    </div>
                                    <span className="text-[9px] sm:text-[10px] font-inter font-bold uppercase tracking-widest text-on-surface-variant text-center">Librarian</span>
                                </div>
                            </div>
                        </AcrylicGlass>
                    </section>

                    {/* Learning History */}
                    <section className="lg:col-span-8 h-full">
                        <AcrylicGlass radius="rounded-[24px]" className="p-6 sm:p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6 sm:mb-8">
                                <h2 className="font-manrope text-lg sm:text-xl font-bold tracking-tight text-on-surface">Learning History</h2>
                                <button className="text-secondary text-[10px] sm:text-xs font-inter font-bold uppercase tracking-widest hover:text-white transition-colors">View All</button>
                            </div>

                            <div className="flex flex-col gap-4 sm:gap-6 flex-grow justify-center">
                                {/* History Item 1 */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-black/20 p-4 sm:p-5 rounded-2xl border border-outline-variant/5 hover:bg-black/30 transition-colors">
                                    <div className="w-full sm:w-16 h-24 sm:h-16 rounded-xl bg-gradient-to-br from-[#082a35] to-[#000a10] shrink-0 border border-white/5 relative overflow-hidden">
                                        {/* Abstract placeholder thumbnail */}
                                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary to-transparent" style={{ backgroundSize: '4px 4px', backgroundImage: 'radial-gradient(circle, #a5cbe9 1px, transparent 1px)' }}></div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <h3 className="font-manrope text-sm sm:text-base font-bold text-on-surface">Neural Architectures 101</h3>
                                        <p className="text-xs text-on-surface-variant font-medium">Completed 2 days ago</p>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:items-end mt-2 sm:mt-0">
                                        <div className="text-[10px] font-inter text-primary font-bold uppercase tracking-widest">Grade: A+</div>
                                        <div className="w-full sm:w-24 h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-primary w-full rounded-full relative">
                                                <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* History Item 2 */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-black/20 p-4 sm:p-5 rounded-2xl border border-outline-variant/5 hover:bg-black/30 transition-colors">
                                    <div className="w-full sm:w-16 h-24 sm:h-16 rounded-xl bg-gradient-to-br from-[#2a0808] to-[#1a0505] shrink-0 border border-white/5 relative overflow-hidden">
                                        {/* Abstract placeholder thumbnail */}
                                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_5px,_#ea591f_5px,_#ea591f_10px)]"></div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <h3 className="font-manrope text-sm sm:text-base font-bold text-on-surface">Quantum Ethics in Design</h3>
                                        <p className="text-xs text-on-surface-variant font-medium">80% In Progress</p>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:items-end mt-2 sm:mt-0">
                                        <div className="text-[10px] font-inter text-secondary font-bold uppercase tracking-widest">Active</div>
                                        <div className="w-full sm:w-24 h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-secondary w-[80%] rounded-full relative">
                                                <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AcrylicGlass>
                    </section>

                    {/* Account Settings */}
                    <section className="lg:col-span-12">
                        <AcrylicGlass radius="rounded-[24px]" className="p-6 sm:p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8 sm:mb-10">
                                <h2 className="font-manrope text-xl sm:text-2xl font-bold tracking-tight text-on-surface">Account Settings</h2>
                                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-on-surface-variant" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 sm:gap-y-10">

                                {/* Toggle 1 */}
                                <div className="flex items-center justify-between group">
                                    <div className="pr-4">
                                        <p className="font-manrope font-bold text-sm sm:text-base text-on-surface">AI Learning Suggestions</p>
                                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">Receive personalized content based on your style.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline-variant/20 shadow-inner"></div>
                                    </label>
                                </div>

                                {/* Toggle 2 */}
                                <div className="flex items-center justify-between group">
                                    <div className="pr-4">
                                        <p className="font-manrope font-bold text-sm sm:text-base text-on-surface">Dark Mesh Interface</p>
                                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">Enable the animated ethereal curator background.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline-variant/20 shadow-inner"></div>
                                    </label>
                                </div>

                                {/* Toggle 3 */}
                                <div className="flex items-center justify-between group">
                                    <div className="pr-4">
                                        <p className="font-manrope font-bold text-sm sm:text-base text-on-surface">Public Profile Portfolio</p>
                                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">Allow others to view your achievement gallery.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline-variant/20 shadow-inner"></div>
                                    </label>
                                </div>

                                {/* Toggle 4 */}
                                <div className="flex items-center justify-between group">
                                    <div className="pr-4">
                                        <p className="font-manrope font-bold text-sm sm:text-base text-on-surface">Biometric Security</p>
                                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">Enable face/touch ID for premium vault access.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline-variant/20 shadow-inner"></div>
                                    </label>
                                </div>

                            </div>

                            <div className="mt-10 sm:mt-12 flex flex-wrap gap-4 pt-8 border-t border-outline-variant/10">
                                <button className="w-full sm:w-auto px-6 py-3 rounded-xl border border-outline-variant/30 text-xs font-inter font-bold uppercase tracking-widest text-on-surface hover:bg-white/5 transition-colors">
                                    Reset Preferences
                                </button>
                                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-error/20 border border-error/30 text-error text-xs font-inter font-bold uppercase tracking-widest hover:bg-error hover:text-white transition-colors shadow-[0_0_20px_rgba(255,180,171,0.1)]">
                                    Delete Account
                                </button>
                            </div>
                        </AcrylicGlass>
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
