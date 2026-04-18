'use client';

import React from "react";
import Link from "next/link";
import { Bell, Settings, LogOut } from "lucide-react";
import { UserAvatar } from "../ui/avatar";
import { useUser } from "@auth0/nextjs-auth0";
import { AcrylicGlass } from "../react-bits/acrylicGlass";
import { PillNav } from "../ui/pill-nav"; // <-- Import the new component

export function TopNavBar() {
    const { user, isLoading } = useUser();
    const initials = user?.name?.charAt(0).toUpperCase() ?? 'U';

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Courses', href: '/courses' },
        { label: 'Generator', href: '/generator' },
        { label: 'Profile', href: '/profile' }
    ];

    return (
        <div className="fixed top-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-center w-full">
            <AcrylicGlass
                radius="rounded-[16px]"
                className="pointer-events-auto w-full max-w-5xl flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 shadow-xl"
            >
                {/* Left Side: Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link href="/" className="font-manrope font-bold text-lg sm:text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
                        Raphael
                    </Link>
                </div>

                {/* Center Links (Using the new PillNav) */}
                {(!isLoading && user) && (
                    <div className="hidden md:flex flex-grow justify-center items-center h-8">
                        <PillNav items={navItems} />
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0">
                    {isLoading ? (
                        <div className="w-20 sm:w-24 py-4 rounded-lg bg-white/10 animate-pulse"></div>
                    ) : user ? (
                        <>
                            <button className="text-on-surface-variant hover:text-on-surface transition-colors hidden sm:flex p-1">
                                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <button className="text-on-surface-variant hover:text-on-surface transition-colors hidden sm:flex p-1">
                                <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <Link href="/profile" className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center ml-1 sm:ml-2">
                                <UserAvatar user={user} size={32} initials={initials} ring />
                            </Link>

                            <Link href="/auth/logout" className="group ml-1 sm:ml-2 flex items-center">
                                <div className="py-1.5 px-2 sm:px-3 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold text-on-surface/80 hover:bg-white/5 hover:text-error transition-colors gap-1.5 border border-transparent hover:border-white/10">
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:block">Out</span>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link href="/features" className="hidden sm:block text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                                Features
                            </Link>
                            <Link href="/about" className="hidden sm:block text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                                About
                            </Link>
                            <Link href="/auth/login?returnTo=/dashboard" className="py-1.5 sm:py-2 px-4 sm:px-5 bg-white hover:bg-white/90 text-background rounded-lg transition-colors flex items-center justify-center">
                                <span className="text-xs sm:text-sm font-bold">Sign In</span>
                            </Link>
                        </div>
                    )}
                </div>
            </AcrylicGlass>
        </div>
    );
}