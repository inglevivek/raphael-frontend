'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeft, Play, CheckCircle2, Code, Copy, Check,
  Clock, Loader2, ChevronDown, ChevronRight,
  ArrowLeft, BookOpen, Zap, AlertTriangle,
} from 'lucide-react';

import { useGeneratePoll } from '@/lib/hooks/use-generate-poll';
import { useCourseContent } from '@/lib/hooks/use-course';
import { useCourseReaderStore, selectActiveIndices } from '@/lib/stores/course-reader.store';

// ============================================================================
// TYPES (UNCHANGED)
// ============================================================================

interface TopicIndex {
  topicId: string;
  topicNumber: number;
  title: string;
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

interface TopicContent {
  topicId: string;
  title: string;
  keyPoints?: string[];
  explanation?: { text: string };
  sections?: Array<{ heading: string; content: string }>;
  resources?: { videos: VideoResource[] };
  metadata?: { status?: string; generatedAt?: string; tokenCount?: number };
}

interface VideoResource {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  embed_url: string;
}

interface CourseJson {
  metadata: Record<string, unknown>;
  index: { modules: ModuleIndex[] };
  content: Record<string, TopicContent>;
}

// ============================================================================
// HELPERS (UNCHANGED — PARSING LOGIC IS SACRED)
// ============================================================================

type ParsedBlock =
  | { type: 'h3' | 'h4'; content: string }
  | { type: 'code'; content: string; language: string }
  | { type: 'list'; items: string[] }
  | { type: 'p'; content: string };

function parseExplanation(text: string): ParsedBlock[] {
  if (!text) return [];

  const result: ParsedBlock[] = [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] || 'plaintext' });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });

  for (const part of parts) {
    if (part.type === 'code') {
      result.push({ type: 'code', content: part.content, language: part.language! });
      continue;
    }
    const lines = part.content.split('\n');
    let currentParagraph = '';
    let listItems: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        result.push({ type: 'p', content: currentParagraph.trim() });
        currentParagraph = '';
      }
    };
    const flushList = () => {
      if (listItems.length > 0) {
        result.push({ type: 'list', items: [...listItems] });
        listItems = [];
      }
    };

    for (const line of lines) {
      const t = line.trim();
      if (!t) { flushParagraph(); flushList(); continue; }
      if (t.startsWith('####')) {
        flushParagraph(); flushList();
        result.push({ type: 'h4', content: t.replace(/^####\s*/, '') });
      } else if (t.startsWith('###')) {
        flushParagraph(); flushList();
        result.push({ type: 'h3', content: t.replace(/^###\s*/, '') });
      } else if (/^[\*\-•]/.test(t)) {
        flushParagraph();
        listItems.push(t.replace(/^[\*\-•]\s*/, ''));
      } else {
        flushList();
        currentParagraph += (currentParagraph ? ' ' : '') + t;
      }
    }
    flushParagraph();
    flushList();
  }
  return result;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:var(--color-text)">$1</strong>')
    .replace(/`(.+?)`/g, '<code style="background:var(--color-surface-offset);padding:0.1em 0.4em;border-radius:4px;color:var(--color-primary);font-family:var(--font-mono);font-size:0.85em">$1</code>')
    .replace(/\*(.+?)\*/g, '<em style="color:var(--color-text-muted)">$1</em>');
}

function flattenIndex(modules: ModuleIndex[]) {
  const flat: { moduleId: string; chapterId: string; topicId: string; mIdx: number; cIdx: number; tIdx: number }[] = [];
  modules.forEach((m, mIdx) =>
    m.chapters.forEach((c, cIdx) =>
      c.topics.forEach((t, tIdx) =>
        flat.push({ moduleId: m.moduleId, chapterId: c.chapterId, topicId: t.topicId, mIdx, cIdx, tIdx })
      )
    )
  );
  return flat;
}

function getTotalTopics(modules: ModuleIndex[]): number {
  return modules.reduce((s, m) => s + m.chapters.reduce((cs, c) => cs + c.topics.length, 0), 0);
}

// ============================================================================
// ANIMATION
// ============================================================================

const EASE = [0.16, 1, 0.3, 1] as const;

// ============================================================================
// INLINE SUB-COMPONENTS (RESTYLED)
// ============================================================================

function RaphaelLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Raphael">
      <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
      <path
        d="M9 8h8a5 5 0 0 1 0 10h-8V8Z"
        stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none"
      />
      <path d="M17 18l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Topbar navbar ────────────────────────────────────────────────────────────
function CourseNavbar({
  courseTitle, completedCount, totalCount, sidebarOpen, onToggleSidebar,
}: {
  courseTitle: string;
  completedCount: number;
  totalCount: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="h-14 glass flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-50 border-b border-[var(--color-border)]">
      {/* Back */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm transition-colors duration-150 flex-shrink-0 hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      <div className="w-px h-5 bg-[var(--color-border)] flex-shrink-0" />

      {/* Logo + brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <RaphaelLogo size={22} />
        <span className="hidden md:inline font-display font-bold text-sm text-[var(--color-text)] tracking-tight">
          Raphael
        </span>
      </div>

      <div className="w-px h-5 bg-[var(--color-border)] flex-shrink-0" />

      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        className="p-1 rounded-[var(--radius-md)] transition-colors duration-150 flex-shrink-0 hover:text-[var(--color-text)] cursor-pointer"
        style={{ color: sidebarOpen ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
      >
        <PanelLeft size={18} />
      </button>

      {/* Course title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text)] truncate">
          {courseTitle}
        </p>
      </div>

      {/* Progress pill */}
      <div className="flex items-center gap-2 bg-[var(--color-surface-offset)] border border-[var(--color-border)] rounded-full px-3 py-1 flex-shrink-0">
        <div className="w-12 h-1 bg-[var(--color-surface-dynamic)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-[400ms] ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? 'var(--color-success)' : 'var(--color-primary)',
            }}
          />
        </div>
        <span className="text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap tabular-nums">
          {completedCount}/{totalCount}
        </span>
      </div>
    </header>
  );
}

// ── Generation progress (inlined) ────────────────────────────────────────────
const STAGES = [
  { key: 'outline', label: 'Building outline', icon: BookOpen },
  { key: 'keypoints', label: 'Extracting key points', icon: Zap },
  { key: 'content', label: 'Writing content', icon: Code },
  { key: 'resources', label: 'Finding resources', icon: Play },
] as const;

function GenerationProgress({ onComplete }: { onComplete: () => void }) {
  const [stageIdx, setStageIdx] = React.useState(0);
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const dotTimer = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    const stageTimer = setInterval(() => setStageIdx(i => Math.min(i + 1, STAGES.length - 1)), 18000);
    return () => { clearInterval(dotTimer); clearInterval(stageTimer); };
  }, []);

  return (
    <div className="glass rounded-[var(--radius-xl)] p-8 mt-4">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center">
          <Loader2 size={28} className="text-[var(--color-primary)] animate-spin" />
        </div>
      </div>

      <p className="text-center font-display font-bold text-xl text-[var(--color-text)] mb-1">
        Generating your course{dots}
      </p>
      <p className="text-center text-[var(--color-text-muted)] text-sm mb-8">
        This takes 1–2 minutes. Hang tight.
      </p>

      <div className="flex flex-col gap-3">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const done = i < stageIdx;
          const active = i === stageIdx;
          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i > stageIdx ? 0.4 : 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }}
              className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] transition-all duration-300"
              style={{
                background: active ? 'var(--color-primary-subtle)' : done ? 'var(--color-surface-offset)' : 'transparent',
                border: `1px solid ${active ? 'var(--color-primary-border, rgba(112,0,204,0.3))' : 'transparent'}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: done ? 'rgba(76,175,125,0.15)' : active ? 'var(--color-primary-subtle)' : 'var(--color-surface-dynamic)',
                }}
              >
                {done
                  ? <CheckCircle2 size={16} className="text-[var(--color-success)]" />
                  : <Icon size={16} style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-faint)' }} />
                }
              </div>
              <span
                className="text-sm"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--color-text)' : done ? 'var(--color-text-muted)' : 'var(--color-text-faint)',
                }}
              >
                {stage.label}
              </span>
              {active && (
                <Loader2 size={14} className="ml-auto text-[var(--color-primary)] animate-spin flex-shrink-0" />
              )}
              {done && (
                <span className="ml-auto text-xs text-[var(--color-success)] font-semibold">Done</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const langColor: Record<string, string> = {
    python: '#3b82f6', javascript: '#eab308', typescript: '#2563eb',
    bash: '#6b7280', shell: '#6b7280', yaml: '#ef4444',
    json: '#22c55e', go: '#06b6d4', rust: '#f97316',
  };
  const color = langColor[language.toLowerCase()] ?? '#6b7280';

  return (
    <div className="my-6 rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-md)]">
      {/* Header bar */}
      <div className="bg-[var(--color-surface-2)] px-4 py-2 flex items-center justify-between border-b border-[var(--color-divider)]">
        <div className="flex items-center gap-2">
          <Code size={13} className="text-[var(--color-text-faint)]" />
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ background: color, color: 'white' }}
          >
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs transition-colors duration-150 cursor-pointer"
          style={{ color: copied ? 'var(--color-success)' : 'var(--color-text-muted)' }}
        >
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="bg-[var(--color-surface-offset)] p-4 overflow-x-auto text-sm font-mono leading-relaxed text-[var(--color-text)] m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Video card ───────────────────────────────────────────────────────────────
function VideoCard({ video }: { video: VideoResource }) {
  const [playing, setPlaying] = React.useState(false);
  const embed = video.embed_url || `https://www.youtube.com/embed/${video.id}`;
  return (
    <div className="glass glass-hover rounded-[var(--radius-xl)] overflow-hidden group">
      {playing ? (
        <div style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`${embed}?autoplay=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          style={{ aspectRatio: '16/9' }}
          className="relative cursor-pointer"
          onClick={() => setPlaying(true)}
        >
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            style={{ objectFit: 'cover', opacity: 0.85 }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[var(--color-primary)] rounded-full p-3 shadow-[var(--shadow-glow)] transition-transform duration-200 group-hover:scale-110">
              <Play size={22} className="text-white" style={{ fill: 'white' }} />
            </div>
          </div>
        </div>
      )}
      <div className="p-3 px-4">
        <h4 className="text-sm font-medium text-[var(--color-text)] line-clamp-2">
          {video.title}
        </h4>
        <p className="text-xs text-[var(--color-text-faint)] mt-1">
          {video.channel}
        </p>
      </div>
    </div>
  );
}

// ── Sidebar module section ───────────────────────────────────────────────────
function ModuleSection({
  module, mIdx, activeIndices, completedTopics, onSelect,
}: {
  module: ModuleIndex;
  mIdx: number;
  activeIndices: { m: number; c: number; t: number };
  completedTopics: Set<string>;
  onSelect: (m: number, c: number, t: number) => void;
}) {
  const [expanded, setExpanded] = React.useState(mIdx === 0);

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] text-left text-[var(--color-text-muted)] transition-colors duration-150 cursor-pointer hover:bg-[var(--color-surface-offset)]"
        style={{ background: expanded ? 'var(--color-surface-offset)' : 'transparent' }}
      >
        {expanded
          ? <ChevronDown size={13} className="text-[var(--color-text-faint)] flex-shrink-0" />
          : <ChevronRight size={13} className="text-[var(--color-text-faint)] flex-shrink-0" />}
        <span className="text-xs font-bold text-[var(--color-text)] truncate">
          {module.moduleNumber}. {module.title}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="overflow-hidden"
          >
            {module.chapters.map((chapter, cIdx) => (
              <div key={chapter.chapterId} className="ml-3 mt-1 mb-1">
                <div className="flex items-center gap-1.5 px-3 py-0.5 mb-0.5">
                  <Clock size={10} className="text-[var(--color-text-faint)] flex-shrink-0" />
                  <span className="text-[10px] text-[var(--color-text-faint)] font-medium">
                    {chapter.title} · {chapter.estimatedMinutes}m
                  </span>
                </div>

                <div className="flex flex-col gap-px">
                  {chapter.topics.map((topic, tIdx) => {
                    const isActive = activeIndices.m === mIdx && activeIndices.c === cIdx && activeIndices.t === tIdx;
                    const isDone = completedTopics.has(topic.topicId);
                    return (
                      <button
                        key={topic.topicId}
                        onClick={() => onSelect(mIdx, cIdx, tIdx)}
                        className="w-full text-left px-3 py-1.5 rounded-[var(--radius-md)] text-xs flex items-center gap-2 transition-all duration-150 cursor-pointer hover:bg-[var(--color-surface-offset)]"
                        style={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          background: isActive ? 'var(--color-primary-highlight)' : undefined,
                          border: isActive ? '1px solid var(--color-primary-border, rgba(112,0,204,0.25))' : '1px solid transparent',
                        }}
                      >
                        <CheckCircle2
                          size={12}
                          className="flex-shrink-0"
                          style={{
                            color: isDone ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--color-text-faint)',
                          }}
                        />
                        <span className="truncate">
                          {topic.topicNumber}. {topic.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN PAGE (DATA ACCESS PATTERN UNCHANGED)
// ============================================================================

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string'
    ? params.id
    : Array.isArray(params.id) ? params.id[0] : null;

  const { data: course, isPending: metaPending, refetch } = useGeneratePoll(id);
  const isCompleted = course?.status === 'completed';
  const { data: content, isPending: contentPending } = useCourseContent(id, isCompleted);

  const {
    completedTopics, sidebarOpen,
    setActiveTopic, markTopicComplete,
    toggleSidebar, resetReader,
  } = useCourseReaderStore();
  const activeIndices = useCourseReaderStore(selectActiveIndices);

  // Reset when navigating between courses
  React.useEffect(() => {
    resetReader();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ──────────────────────────────────────────────────────────────
  if (metaPending || (isCompleted && contentPending)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-20 text-center text-[var(--color-text-muted)]">
        Course not found.
      </div>
    );
  }

  // ── Generating ───────────────────────────────────────────────────────────
  if (course.status === 'generating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="w-full max-w-[480px]"
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <RaphaelLogo size={24} />
            <span className="font-display font-bold text-lg text-[var(--color-text)]">Raphael</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-text)] text-center mb-2 tracking-tight">
            {course.title}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm text-center mb-1">
            Your course is being generated
          </p>
          <GenerationProgress onComplete={() => refetch()} />
        </motion.div>
      </div>
    );
  }

  // ── Failed ───────────────────────────────────────────────────────────────
  if (course.status === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-[rgba(234,89,31,0.12)] flex items-center justify-center">
            <AlertTriangle size={26} className="text-[var(--color-error)]" />
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--color-text)]">Generation Failed</h2>
          <p className="text-[var(--color-text-muted)] text-sm max-w-[360px]">
            {course.error_message ?? 'Something went wrong during course generation.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full font-semibold text-sm cursor-pointer transition-all duration-150 hover:bg-[var(--color-primary-hover)] active:scale-[0.97]"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Reader ───────────────────────────────────────────────────────────────
  if (!isCompleted || !content) return null;

  const courseJson: CourseJson = content.course_json;
  const modules = courseJson.index.modules;
  const topicMap = courseJson.content;
  const flat = flattenIndex(modules);
  const total = getTotalTopics(modules);

  const activeModule = modules[activeIndices.m];
  const activeChapter = activeModule?.chapters[activeIndices.c];
  const activeTopicIdx = activeChapter?.topics[activeIndices.t];
  const activeTopic: TopicContent | undefined = activeTopicIdx
    ? topicMap[activeTopicIdx.topicId]
    : undefined;

  const currentFlatIdx = flat.findIndex(
    f => f.mIdx === activeIndices.m && f.cIdx === activeIndices.c && f.tIdx === activeIndices.t
  );

  const blocks = parseExplanation(activeTopic?.explanation?.text ?? '');
  const keyPoints = Array.isArray(activeTopic?.keyPoints) ? activeTopic.keyPoints : [];
  const videos = activeTopic?.resources?.videos ?? [];
  const isDone = activeTopic ? completedTopics.has(activeTopic.topicId) : false;

  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg)]">

      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <CourseNavbar
        courseTitle={course.title}
        completedCount={completedTopics.size}
        totalCount={total}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* ── Body row ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 272, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col overflow-hidden"
            >
              {/* Sidebar header */}
              <div className="p-4 pb-3 border-b border-[var(--color-divider)]">
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)] font-bold mb-1">
                  Course Content
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {completedTopics.size} of {total} topics completed
                </p>
                <div className="mt-2 h-0.5 bg-[var(--color-surface-dynamic)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-[400ms] ease-out"
                    style={{
                      width: `${total > 0 ? Math.round((completedTopics.size / total) * 100) : 0}%`,
                      background: 'var(--color-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Module list */}
              <div className="flex-1 overflow-y-auto p-2">
                {modules.map((m, mIdx) => (
                  <ModuleSection
                    key={m.moduleId}
                    module={m}
                    mIdx={mIdx}
                    activeIndices={activeIndices}
                    completedTopics={completedTopics}
                    onSelect={(m, c, t) => setActiveTopic(m, c, t)}
                  />
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main reading area */}
        <main className="flex-1 overflow-y-auto">
          {activeTopic ? (
            <motion.article
              key={activeTopic.topicId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="max-w-[760px] mx-auto px-8 pt-12 pb-20"
            >
              {/* Breadcrumb */}
              {activeModule && activeChapter && (
                <p className="text-xs text-[var(--color-text-faint)] mb-5 flex items-center gap-1.5">
                  <span>{activeModule.title}</span>
                  <ChevronRight size={11} />
                  <span>{activeChapter.title}</span>
                </p>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl font-bold text-[var(--color-text)] tracking-tight leading-tight mb-6">
                {activeTopic.title}
              </h1>

              {/* Mark done button */}
              <button
                onClick={() => markTopicComplete(activeTopic.topicId)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150 mb-10 active:scale-[0.97]"
                style={{
                  background: isDone ? 'rgba(76,175,125,0.12)' : 'var(--color-primary)',
                  color: isDone ? 'var(--color-success)' : 'white',
                  border: isDone ? '1px solid rgba(76,175,125,0.3)' : 'none',
                }}
              >
                <CheckCircle2 size={13} />
                {isDone ? 'Completed' : 'Mark as done'}
              </button>

              {/* Key Learning Points */}
              {keyPoints.length > 0 && (
                <section className="mb-10 glass rounded-[var(--radius-xl)] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      Key Learning Points
                    </span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-[22px] h-[22px] rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Content blocks */}
              {blocks.length > 0 && (
                <section className="mb-10 prose">
                  {blocks.map((block, idx) => {
                    if (block.type === 'h3') return (
                      <h3
                        key={idx}
                        className="font-display text-xl font-bold text-[var(--color-text)] mt-10 mb-3 flex items-center gap-2"
                      >
                        <span className="text-[var(--color-primary)] text-[0.85em]">▸</span>
                        {block.content}
                      </h3>
                    );
                    if (block.type === 'h4') return (
                      <h4
                        key={idx}
                        className="font-display text-lg font-semibold text-[var(--color-text)] mt-7 mb-2"
                      >
                        {block.content}
                      </h4>
                    );
                    if (block.type === 'code') return (
                      <CodeBlock key={idx} code={block.content} language={block.language} />
                    );
                    if (block.type === 'list') return (
                      <ul key={idx} className="flex flex-col gap-2.5 my-3 pl-1">
                        {block.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[var(--color-text-muted)] text-base leading-relaxed">
                            <span className="text-[var(--color-primary)] font-bold mt-0.5 flex-shrink-0">•</span>
                            <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
                          </li>
                        ))}
                      </ul>
                    );
                    return (
                      <p
                        key={idx}
                        className="text-[var(--color-text-muted)] leading-relaxed text-base my-3"
                        dangerouslySetInnerHTML={{ __html: formatInline(block.content) }}
                      />
                    );
                  })}
                </section>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <section className="mt-12 pt-8 border-t border-[var(--color-divider)]">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-[var(--color-text)] mb-5">
                    <Play size={16} style={{ color: '#ef4444' }} />
                    Video Resources
                  </h3>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
                    {videos.map((v, i) => <VideoCard key={v.id ?? i} video={v} />)}
                  </div>
                </section>
              )}

              {/* Prev / Next */}
              <footer className="mt-16 pt-6 border-t border-[var(--color-divider)] flex justify-between gap-4">
                <button
                  disabled={currentFlatIdx <= 0}
                  onClick={() => {
                    const p = flat[currentFlatIdx - 1];
                    setActiveTopic(p.mIdx, p.cIdx, p.tIdx);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium border border-[var(--color-border)] transition-all duration-150 cursor-pointer hover:border-[var(--color-text-faint)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--color-border)]"
                  style={{ color: currentFlatIdx <= 0 ? 'var(--color-text-faint)' : 'var(--color-text-muted)' }}
                >
                  ← Previous
                </button>

                <button
                  disabled={currentFlatIdx >= flat.length - 1}
                  onClick={() => {
                    if (!isDone) markTopicComplete(activeTopic.topicId);
                    const n = flat[currentFlatIdx + 1];
                    setActiveTopic(n.mIdx, n.cIdx, n.tIdx);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: currentFlatIdx >= flat.length - 1 ? 'var(--color-surface-offset)' : 'var(--color-primary)',
                    color: currentFlatIdx >= flat.length - 1 ? 'var(--color-text-faint)' : 'white',
                    boxShadow: currentFlatIdx < flat.length - 1 ? 'var(--shadow-glow)' : 'none',
                  }}
                >
                  Next Topic →
                </button>
              </footer>

            </motion.article>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-[var(--color-text-faint)]">
              <BookOpen size={36} style={{ opacity: 0.4 }} />
              <p className="text-sm">Select a topic to begin reading</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}