'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CoursesAPI } from '@/lib/api/courses.api';
import type { CourseMeta, TopicContent } from '@/lib/types/course.types';
import { formatRelativeDate, formatMinutes } from '@/lib/utils/format';
import {
    ChevronRight,
    ArrowLeft,
    Play,
    CheckCircle2,
    BookOpen,
    Code,
    Copy,
    Check,
    BrainCircuit,
    HelpCircle,
    Cpu,
    Sparkles,
    LayoutDashboard,
    Clock,
    ListTree,
    GraduationCap,
    List
} from 'lucide-react';
import { AcrylicGlass } from '@/components/react-bits/acrylicGlass';

// ============================================================================
// TYPES
// ============================================================================

interface TopicIndex {
    topicId: string;
    topicNumber: number;
    title: string;
    contentPath: string;
}

interface ChapterIndex {
    chapterId: string;
    chapterNumber: number;
    title: string;
    estimatedMinutes: number;
    topics: TopicIndex[];
}

interface ModuleIndex {
    moduleId: string;
    moduleNumber: number;
    title: string;
    description: string;
    chapters: ChapterIndex[];
}

interface CourseJson {
    index: { modules: ModuleIndex[] };
    content: Record<string, TopicContent>;
    metadata: Record<string, unknown>;
}

// ============================================================================
// CODE BLOCK COMPONENT
// ============================================================================

function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl bg-surface-container-lowest">
            <div className="bg-surface-container/50 px-4 py-3 flex items-center justify-between border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                    <Code className="h-4 w-4 text-outline" />
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/10 text-primary uppercase tracking-widest">
                        {language || 'CODE'}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-on-surface-variant rounded-lg transition-colors text-xs font-semibold"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-green-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <div className="p-6 overflow-x-auto custom-scrollbar">
                <pre className="text-sm text-on-surface-variant font-mono leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CourseViewerPage() {
    const params = useParams();
    const router = useRouter();

    const [course, setCourse] = useState<CourseMeta | null>(null);
    const [courseData, setCourseData] = useState<CourseJson | null>(null);

    // Navigation State
    // If selectedTopic is null, we show the Overview
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<TopicContent | null>(null);

    const pollCourseRef = useRef<(() => Promise<void>) | null>(null);

    useEffect(() => {
        const pollCourse = async () => {
            try {
                const courseId = params.id as string;
                const statusInfo = await CoursesAPI.getStatus(courseId);
                setCourse(statusInfo);

                if (statusInfo.status === 'completed') {
                    const contentInfo = await CoursesAPI.getContent(courseId);
                    const data = contentInfo.course_json as unknown as CourseJson;
                    setCourseData(data);

                    // Auto-expand the first module in the sidebar, but DO NOT auto-select a topic
                    // so the user sees the Overview page first.
                    if (data?.index?.modules?.length > 0) {
                        setActiveModuleId(data.index.modules[0].moduleId);
                    }
                } else if (statusInfo.status === 'generating' || statusInfo.status === 'pending') {
                    setTimeout(() => pollCourseRef.current?.(), 5000);
                }
            } catch (error) {
                console.error('Failed to load course:', error);
            }
        };

        pollCourseRef.current = pollCourse;
        pollCourse();
    }, [router, params.id]);

    const handleTopicSelect = (topicId: string, moduleId: string) => {
        if (courseData?.content[topicId]) {
            setActiveModuleId(moduleId);
            setSelectedTopic(courseData.content[topicId]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const showOverview = () => {
        setSelectedTopic(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const startCourse = () => {
        if (courseData?.index?.modules?.[0]?.chapters?.[0]?.topics?.[0]) {
            const firstModule = courseData.index.modules[0];
            handleTopicSelect(firstModule.chapters[0].topics[0].topicId, firstModule.moduleId);
        }
    };

    // --------------------------------------------------------------------------
    // Loading & Error States
    // --------------------------------------------------------------------------
    if (!course || course.status === 'generating' || course.status === 'pending') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative bg-surface">
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1b1c1c_0%,_#131313_100%)] opacity-80 z-[-1]" />
                <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,_rgba(112,0,204,0.15)_0%,_transparent_70%)] blur-[80px] z-[-1]" />

                <div className="flex items-center gap-5 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '75ms' }}></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '75ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-manrope font-bold text-on-surface mb-2">
                    {course?.status === 'generating' ? 'Synthesizing Neural Architecture...' : 'Initializing...'}
                </h2>
                <p className="text-on-surface-variant text-sm font-inter">This usually takes 1-2 minutes. Please wait.</p>
            </div>
        );
    }

    if (course.status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface relative">
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1b1c1c_0%,_#131313_100%)] opacity-80 z-[-1]" />
                <div className="text-center bg-surface-container-low/40 p-12 rounded-3xl border border-outline-variant/10 backdrop-blur-md shadow-2xl">
                    <div className="bg-error/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 border border-error/30">
                        <span className="text-3xl text-error font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-manrope font-bold text-on-surface mb-3">Generation Failed</h2>
                    <p className="text-on-surface-variant mb-8 max-w-md mx-auto">{course.error_message}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-8 py-3.5 primary-gradient-btn text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-glow-violet-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const activeModule = courseData?.index?.modules.find((m: ModuleIndex) => m.moduleId === activeModuleId);
    const activeModuleIndex = courseData?.index?.modules.findIndex((m: ModuleIndex) => m.moduleId === activeModuleId) ?? 0;

    return (
        <div className="min-h-screen font-inter text-on-surface selection:bg-primary-container selection:text-white relative">

            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1b1c1c_0%,_#131313_100%)] opacity-80 z-[-1]"></div>
            <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,_rgba(112,0,204,0.15)_0%,_transparent_70%)] blur-[80px] z-[-1]"></div>

            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-surface-container-low">
                <div className="h-full w-[65%] bg-gradient-to-r from-tertiary-container via-primary-container to-primary shadow-glow-violet-sm"></div>
            </div>

            <aside className="fixed left-0 top-0 h-full flex flex-col p-6 z-40 bg-[#0e0e0e]/60 backdrop-blur-2xl w-64 border-r border-outline-variant/15">

                <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => router.push('/dashboard')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-glow-violet-sm group-hover:scale-105 transition-transform">
                        <ArrowLeft className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="font-manrope font-bold text-xl text-primary tracking-tighter">Raphael</h1>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest line-clamp-1 truncate w-40">{course.title}</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">

                    <div>
                        <span className="text-[10px] text-outline-variant font-bold uppercase tracking-[0.2em] px-2 block mb-4">Course</span>
                        <ul className="space-y-1">
                            <li className="group">
                                <button
                                    onClick={showOverview}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-400 ease-out text-left
                      ${selectedTopic === null ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                                    <span className="text-sm font-semibold truncate">Overview</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <span className="text-[10px] text-outline-variant font-bold uppercase tracking-[0.2em] px-2 block mb-4">Curriculum</span>
                        <ul className="space-y-1">
                            {courseData?.index?.modules.map((module: ModuleIndex) => {
                                const isActiveModule = module.moduleId === activeModuleId;
                                return (
                                    <li key={module.moduleId} className="group">
                                        <button
                                            onClick={() => setActiveModuleId(module.moduleId)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-400 ease-out text-left
                        ${isActiveModule ? 'bg-white/10 text-on-surface' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}
                                        >
                                            <BookOpen className="w-4 h-4 shrink-0" />
                                            <span className="text-sm font-semibold truncate">{module.title}</span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {activeModule && (
                        <div>
                            <span className="text-[10px] text-outline-variant font-bold uppercase tracking-[0.2em] px-2 block mb-4">Lessons</span>
                            <ul className="space-y-4 px-2 border-l border-outline-variant/20 ml-4">
                                {activeModule.chapters.flatMap((c: ChapterIndex) => c.topics).map((topic: TopicIndex, tIdx: number) => {
                                    const isSelected = selectedTopic?.topicId === topic.topicId;
                                    return (
                                        <li key={topic.topicId} className="relative group">
                                            <div className={`absolute -left-[17px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300
                        ${isSelected ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'bg-surface-variant group-hover:bg-outline'}`}
                                            ></div>
                                            <button
                                                onClick={() => handleTopicSelect(topic.topicId, activeModule.moduleId)}
                                                className={`text-left w-full text-sm block transition-colors duration-300
                          ${isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                                            >
                                                {String(tIdx + 1).padStart(2, '0')}. {topic.title}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}

                </nav>

                <div className="mt-auto pt-6 border-t border-outline-variant/10">
                    <button className="w-full flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                        <span className="text-on-surface-variant group-hover:text-on-surface text-sm font-semibold">Help</span>
                        <HelpCircle className="text-on-surface-variant w-4 h-4 group-hover:text-on-surface" />
                    </button>
                </div>
            </aside>

            <main className="ml-64 pt-12 pb-24 px-8 lg:px-24 w-[calc(100%-16rem)]">

                {/* RENDER OVERVIEW OR TOPIC */}
                {selectedTopic && activeModule && courseData ? (
                    <TopicViewer
                        topic={selectedTopic}
                        moduleTitle={`Module ${String(activeModuleIndex + 1).padStart(2, '0')}`}
                    />
                ) : courseData ? (
                    <CourseOverview
                        course={course}
                        courseData={courseData}
                        onStart={startCourse}
                        onSelectTopic={handleTopicSelect}
                    />
                ) : null}

                <footer className="mt-24 pt-8 flex flex-col sm:flex-row justify-between items-center bg-transparent opacity-70 hover:opacity-100 transition-opacity border-t border-outline-variant/10">
                    <p className="font-inter text-xs tracking-widest uppercase text-on-surface-variant">© 2024 Raphael AI. The Digital Curator.</p>
                    <div className="flex gap-8 mt-4 sm:mt-0">
                        <a href="/privacy" className="font-inter text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">Privacy</a>
                        <a href="/terms" className="font-inter text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">Terms</a>
                        <a href="/api-docs" className="font-inter text-xs tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">API</a>
                    </div>
                </footer>
            </main>

        </div>
    );
}

// ============================================================================
// COURSE OVERVIEW COMPONENT (The Entry Screen)
// ============================================================================

function CourseOverview({
    course,
    courseData,
    onStart,
    onSelectTopic
}: {
    course: CourseMeta;
    courseData: CourseJson;
    onStart: () => void;
    onSelectTopic: (topicId: string, moduleId: string) => void;
}) {

    // Placeholder for progress logic (Future feature)
    const placeholderProgress = 0;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (placeholderProgress / 100) * circumference;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fadeInUp">

            {/* Hero Header */}
            <header className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase">
                        {course.level} Level
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
                        Synthesized {formatRelativeDate(course.created_at)}
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-manrope font-extrabold tracking-tight text-on-surface leading-tight">
                    {course.title}
                </h1>
                <p className="text-base sm:text-lg text-on-surface-variant font-light leading-relaxed max-w-3xl">
                    {courseData.index.modules[0]?.description || "A deep dive curated specifically for your learning profile. Explore the fundamental concepts, advanced theories, and practical applications within this domain."}
                </p>
                <div className="pt-4">
                    <button onClick={onStart} className="primary-gradient-btn px-8 py-4 rounded-xl font-bold tracking-tight shadow-glow-violet-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Play className="w-5 h-5 fill-white" />
                        Start Learning
                    </button>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <AcrylicGlass radius="rounded-2xl" className="p-6 flex flex-col justify-center items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                        <span className="block text-2xl font-manrope font-bold text-on-surface">{formatMinutes(course.estimated_minutes)}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Est. Time</span>
                    </div>
                </AcrylicGlass>

                <AcrylicGlass radius="rounded-2xl" className="p-6 flex flex-col justify-center items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <ListTree className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <span className="block text-2xl font-manrope font-bold text-on-surface">{course.total_modules}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Modules</span>
                    </div>
                </AcrylicGlass>

                <AcrylicGlass radius="rounded-2xl" className="p-6 flex flex-col justify-center items-center text-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                        <GraduationCap className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                        <span className="block text-2xl font-manrope font-bold text-on-surface">{course.total_topics}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Lessons</span>
                    </div>
                </AcrylicGlass>

                <AcrylicGlass radius="rounded-2xl" className="p-6 flex items-center justify-center gap-4">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 transform origin-center">
                            <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="currentColor" strokeWidth="4" className="text-surface-container-highest/50" />
                            <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="url(#violet-grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="drop-shadow-[0_0_10px_rgba(112,0,204,0.4)]" />
                            <defs>
                                <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#dab9ff" />
                                    <stop offset="100%" stopColor="#7000cc" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="text-lg font-manrope font-extrabold text-on-surface">{placeholderProgress}%</span>
                    </div>
                    <div className="text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">Progress</span>
                        <span className="text-xs text-primary font-medium">Pending</span>
                    </div>
                </AcrylicGlass>
            </div>

            {/* Curriculum Breakdown */}
            <section className="pt-8">
                <div className="flex items-center gap-3 mb-8">
                    <List className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-manrope font-bold text-on-surface">Curriculum Breakdown</h2>
                </div>

                <div className="space-y-6">
                    {courseData.index.modules.map((module, mIdx) => (
                        <AcrylicGlass key={module.moduleId} radius="rounded-2xl" className="p-6 sm:p-8 overflow-hidden">
                            <div className="mb-6 border-b border-outline-variant/10 pb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">Module {String(mIdx + 1).padStart(2, '0')}</span>
                                <h3 className="text-xl font-manrope font-bold text-on-surface">{module.title}</h3>
                                <p className="text-sm text-on-surface-variant mt-2 font-light">{module.description}</p>
                            </div>

                            <div className="space-y-8">
                                {module.chapters.map((chapter, cIdx) => (
                                    <div key={chapter.chapterId}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-on-surface font-inter">Chapter {cIdx + 1}: {chapter.title}</h4>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                                                {formatMinutes(chapter.estimatedMinutes)}
                                            </span>
                                        </div>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {chapter.topics.map((topic, tIdx) => (
                                                <li key={topic.topicId}>
                                                    <button
                                                        onClick={() => onSelectTopic(topic.topicId, module.moduleId)}
                                                        className="w-full text-left p-3 rounded-xl bg-black/20 border border-outline-variant/5 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-start gap-3"
                                                    >
                                                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary mt-0.5">
                                                            {String(tIdx + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="text-sm text-on-surface-variant group-hover:text-on-surface font-medium leading-snug">
                                                            {topic.title}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </AcrylicGlass>
                    ))}
                </div>
            </section>

        </div>
    );
}

// ============================================================================
// TOPIC VIEWER (The Article Content)
// ============================================================================

function TopicViewer({ topic, moduleTitle }: { topic: TopicContent, moduleTitle: string }) {
    const keyPoints = Array.isArray(topic.keyPoints) ? topic.keyPoints : [];
    const sections = Array.isArray(topic.sections) ? topic.sections : [];
    const videos = Array.isArray(topic.resources?.videos) ? topic.resources.videos : [];
    const explanationText = topic.explanation?.text || '';

    const parseExplanation = (text: string) => {
        const parsed: Array<{
            type: 'heading' | 'paragraph' | 'code' | 'list';
            content: string;
            level?: number;
            language?: string;
            items?: string[];
        }> = [];

        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];

        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
            }
            parts.push({
                type: 'code',
                content: match[2].trim(),
                language: match[1] || 'plaintext',
            });
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({ type: 'text', content: text.slice(lastIndex) });
        }

        parts.forEach((part) => {
            if (part.type === 'code') {
                parsed.push({ type: 'code', content: part.content, language: part.language });
            } else {
                const lines = part.content.split('\n');
                let currentParagraph = '';
                let listItems: string[] = [];

                lines.forEach((line, idx) => {
                    const trimmed = line.trim();

                    if (trimmed.match(/^[\*\-•]/)) {
                        if (currentParagraph) {
                            parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
                            currentParagraph = '';
                        }
                        listItems.push(trimmed.replace(/^[\*\-•]\s*/, ''));

                        const nextLine = lines[idx + 1]?.trim();
                        if (!nextLine?.match(/^[\*\-•]/) || !nextLine) {
                            if (listItems.length > 0) {
                                parsed.push({ type: 'list', content: '', items: [...listItems] });
                                listItems = [];
                            }
                        }
                    } else if (trimmed.startsWith('####')) {
                        if (currentParagraph) {
                            parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
                            currentParagraph = '';
                        }
                        if (listItems.length > 0) {
                            parsed.push({ type: 'list', content: '', items: [...listItems] });
                            listItems = [];
                        }
                        parsed.push({ type: 'heading', content: trimmed.replace(/^####\s*/, '').replace(/#/g, ''), level: 4 });
                    } else if (trimmed.startsWith('###')) {
                        if (currentParagraph) {
                            parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
                            currentParagraph = '';
                        }
                        if (listItems.length > 0) {
                            parsed.push({ type: 'list', content: '', items: [...listItems] });
                            listItems = [];
                        }
                        parsed.push({ type: 'heading', content: trimmed.replace(/^###\s*/, '').replace(/#/g, ''), level: 3 });
                    } else if (trimmed) {
                        currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
                    } else if (currentParagraph) {
                        parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
                        currentParagraph = '';
                    }
                });

                if (currentParagraph) parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
                if (listItems.length > 0) parsed.push({ type: 'list', content: '', items: listItems });
            }
        });

        return parsed;
    };

    const parsedContent = parseExplanation(explanationText);

    const formatInlineText = (text: string) => {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
            .replace(/([A-Za-z]+[A-Za-z ]+):/g, '<strong class="font-bold text-primary">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic text-on-surface-variant opacity-80">$1</em>');
    };

    const heroVideo = videos.length > 0 ? videos[0] : null;
    const remainingVideos = videos.length > 1 ? videos.slice(1) : [];
    const readTime = topic.metadata?.tokenCount ? Math.max(3, Math.round(topic.metadata.tokenCount / 200)) : 12;

    return (
        <div className="max-w-4xl mx-auto">

            <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div className="space-y-3 animate-fadeInUp">
                    <div className="flex items-center gap-3 text-primary font-inter text-[10px] tracking-widest uppercase font-bold">
                        <span className="w-8 h-px bg-primary/50"></span>
                        {moduleTitle} • {topic.topicId ? `Topic` : 'Lesson'}
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-manrope font-extrabold tracking-tight text-on-surface leading-tight">
                        {topic.title}
                    </h2>
                </div>
                <div className="text-left md:text-right shrink-0 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <p className="text-[10px] text-outline-variant font-inter uppercase tracking-widest font-bold mb-1">Est. Reading Time</p>
                    <p className="text-xl sm:text-2xl font-manrope font-bold text-secondary">{readTime} Minutes</p>
                </div>
            </header>

            {heroVideo && (
                <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <VideoCard video={heroVideo} isHero={true} />
                </div>
            )}

            <article className="bg-surface-container-low/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 space-y-8 border border-outline-variant/10 shadow-2xl relative animate-fadeInUp" style={{ animationDelay: '0.3s' }}>

                {parsedContent.map((block, idx) => {
                    if (block.type === 'heading') {
                        if (block.level === 3) {
                            return (
                                <h3 key={idx} className="text-2xl sm:text-3xl font-manrope font-bold text-on-surface mt-12 mb-6">
                                    {block.content}
                                </h3>
                            );
                        } else if (block.level === 4) {
                            return (
                                <h4 key={idx} className="text-xl sm:text-2xl font-manrope font-bold text-on-surface mt-10 mb-4">
                                    {block.content}
                                </h4>
                            );
                        }
                    } else if (block.type === 'code') {
                        return (
                            <CodeBlock key={idx} code={block.content} language={block.language || 'plaintext'} />
                        );
                    } else if (block.type === 'list') {
                        return (
                            <ul key={idx} className="space-y-4 ml-2">
                                {block.items?.map((item: string, itemIdx: number) => (
                                    <li key={itemIdx} className="flex items-start gap-4 text-on-surface-variant leading-relaxed">
                                        <span className="text-primary font-bold mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-violet-sm"></span>
                                        <span dangerouslySetInnerHTML={{ __html: formatInlineText(item) }} />
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (block.type === 'paragraph') {
                        const isFirstParagraph = parsedContent.findIndex(b => b.type === 'paragraph') === idx;
                        const formattedContent = formatInlineText(block.content);
                        return (
                            <p key={idx} className={`text-base sm:text-lg text-on-surface-variant font-light leading-relaxed 
                ${isFirstParagraph ? 'first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-manrope first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:leading-none mt-2' : ''}`}
                                dangerouslySetInnerHTML={{ __html: formattedContent }}
                            />
                        );
                    }
                    return null;
                })}

                {keyPoints.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-16">
                        {keyPoints.map((kp: string, i: number) => {
                            const colorClasses = [
                                'text-secondary bg-secondary/10 border-secondary/20',
                                'text-tertiary bg-tertiary/10 border-tertiary/20',
                                'text-primary bg-primary/10 border-primary/20'
                            ];
                            const cClass = colorClasses[i % colorClasses.length];

                            let title = `Key Insight 0${i + 1}`;
                            let desc = kp;
                            if (kp.includes(':')) {
                                const parts = kp.split(':');
                                title = parts[0].trim();
                                desc = parts.slice(1).join(':').trim();
                            }

                            return (
                                <div key={i} className="bg-surface-container/30 p-6 sm:p-8 rounded-2xl hover:bg-surface-container/50 transition-colors border border-outline-variant/5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 border ${cClass}`}>
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-manrope font-bold text-on-surface mb-3">{title}</h4>
                                    <p className="text-sm text-on-surface-variant/80 leading-relaxed font-inter">{desc}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {sections.length > 0 && (
                    <div className="space-y-12 mt-16 pt-12 border-t border-outline-variant/10">
                        {sections.map((section: { heading?: string; content?: string }, i: number) => section.heading && section.content ? (
                            <div key={i} className="border-l-2 border-primary/50 pl-6 sm:pl-8 py-2">
                                <h3 className="text-xl sm:text-2xl font-manrope font-bold text-on-surface mb-6 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-primary" /> {section.heading}
                                </h3>
                                <div
                                    className="text-on-surface-variant font-light leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{ __html: formatInlineText(section.content) }}
                                />
                            </div>
                        ) : null)}
                    </div>
                )}

                {remainingVideos.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-outline-variant/10">
                        <h3 className="text-xl font-manrope font-bold text-on-surface mb-6">Supplementary Media</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {remainingVideos.map((video: any) => (
                                <VideoCard key={video.id} video={video} isHero={false} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-12 sm:pt-16 mt-12 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-outline-variant/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
                            <BrainCircuit className="w-6 h-6 text-primary/80" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-surface font-manrope">Raphael AI Engine</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">Primary Synthesis</p>
                        </div>
                    </div>

                    <button className="w-full sm:w-auto primary-gradient-btn text-white px-8 py-4 rounded-xl font-bold tracking-tight shadow-glow-violet-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                        Mark as Complete
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                </div>

            </article>

            <div className="mt-12 flex justify-between items-center px-2 sm:px-4">
                <button className="flex items-center gap-2 text-outline-variant hover:text-on-surface transition-colors font-inter text-[10px] sm:text-xs font-bold uppercase tracking-widest group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Previous
                </button>
                <div className="flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-glow-violet-sm"></div>
                    <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
                    <div className="w-2 h-2 rounded-full bg-outline-variant/30"></div>
                </div>
                <button className="flex items-center gap-2 text-outline-variant hover:text-on-surface transition-colors font-inter text-[10px] sm:text-xs font-bold uppercase tracking-widest group">
                    Next Lesson
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </div>
    );
}

// ============================================================================
// VIDEO CARD COMPONENT
// ============================================================================

function VideoCard({ video, isHero = false }: { video: { id: string; title: string; channel: string; thumbnail: string; embed_url: string; }, isHero?: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const getPlayableUrl = (url: string | undefined) => {
        if (!url) return '';
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}autoplay=1&mute=0`;
    };

    if (isPlaying) {
        return (
            <div className={`w-full bg-black overflow-hidden shadow-2xl border border-white/10 ${isHero ? 'aspect-video rounded-2xl sm:rounded-3xl' : 'aspect-video rounded-xl'}`}>
                <iframe
                    width="100%"
                    height="100%"
                    src={getPlayableUrl(video.embed_url)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        );
    }

    return (
        <div
            className={`relative group cursor-pointer w-full overflow-hidden border border-white/5 bg-surface-container-highest/40 backdrop-blur-xl shadow-2xl transition-all duration-500
      ${isHero ? 'aspect-video rounded-2xl sm:rounded-3xl hover:border-primary/30' : 'aspect-video rounded-xl hover:border-primary/30'}`}
            onClick={() => video.embed_url && setIsPlaying(true)}
        >
            <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className={`object-cover transition-all duration-700 ${isHero ? 'opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80 group-hover:scale-105' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center">
                <button className={`rounded-full bg-primary/90 text-white flex items-center justify-center hover:scale-110 transition-transform duration-400 group-active:scale-95 shadow-[0_0_30px_rgba(112,0,204,0.6)] ${isHero ? 'w-20 h-20' : 'w-14 h-14'}`}>
                    <Play className={`${isHero ? 'w-8 h-8 ml-1.5' : 'w-6 h-6 ml-1'} fill-white`} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 pointer-events-none">
                <h3 className={`font-manrope font-bold text-white drop-shadow-md line-clamp-2 ${isHero ? 'text-2xl sm:text-3xl mb-2' : 'text-sm mb-1'}`}>
                    {video.title}
                </h3>
                <p className={`text-white/80 font-medium drop-shadow-md ${isHero ? 'text-sm' : 'text-xs'}`}>
                    {video.channel}
                </p>
            </div>
        </div>
    );
}