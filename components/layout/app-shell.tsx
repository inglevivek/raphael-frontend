'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { UniversalHeader } from './navigation';
import { PageTransition } from './page-transition';

// Force Silk to be client-only to avoid the React 19 SSR crash
const Silk = dynamic(() => import('@/components/layout/Silk'), {
  ssr: false,
});

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide the global header when inside the course viewer for a focused reading experience
  const isCourseViewer = pathname.startsWith('/courses/');

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-bg)] overflow-x-hidden">

      {/* 1. Global Shader Backdrop — fixed behind everything */}
      <Silk color="#1a0033" speed={1.2} noiseIntensity={0.3} />

      {/* 2. Universal Header — hidden in course viewer */}
      {!isCourseViewer && <UniversalHeader />}

      {/* 3. Content Area */}
      <main
        className={`flex-1 flex flex-col items-center z-10 ${
          isCourseViewer
            ? 'pt-0 px-0 pb-0'
            : 'pt-[100px] px-6 pb-20'
        }`}
      >
        <div className={isCourseViewer ? 'w-full flex-1 flex flex-col' : 'w-full max-w-5xl flex-1 flex flex-col'}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* 4. Global Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('/noise.svg')] z-[999]" />
    </div>
  );
}