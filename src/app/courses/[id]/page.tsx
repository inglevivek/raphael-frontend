'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { courseAPI } from '@/lib/api';
import { Course, CourseData, TopicContent } from '@/lib/types';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Clock,
  Play,
  FileText,
  CheckCircle2,
  Book,
  Code,
  Copy,
  Check,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

// ============================================================================
// TYPES - Matching Backend Structure Exactly
// ============================================================================

interface TopicIndex {
  topicId: string;  // Changed from topic_id
  topicNumber: number;  // Changed from topic_number
  title: string;
  contentPath: string;  // Changed from content_path
}

interface ChapterIndex {
  chapterId: string;  // Changed from chapter_id
  chapterNumber: number;  // Changed from chapter_number
  title: string;
  estimatedMinutes: number;  // Changed from estimated_minutes
  topics: TopicIndex[];
}

interface ModuleIndex {
  moduleId: string;  // Changed from module_id
  moduleNumber: number;  // Changed from module_number
  title: string;
  description: string;
  chapters: ChapterIndex[];
}

interface CourseMetadata {
  level: string;
  title: string;
  version: string;
  courseId: string;
  createdAt: string;
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

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      python: 'bg-blue-500',
      javascript: 'bg-yellow-500',
      typescript: 'bg-blue-600',
      bash: 'bg-gray-700',
      shell: 'bg-gray-700',
      terraform: 'bg-purple-600',
      hcl: 'bg-purple-600',
      yaml: 'bg-red-500',
      json: 'bg-green-600',
      go: 'bg-cyan-500',
      rust: 'bg-orange-600',
    };
    return colors[lang.toLowerCase()] || 'bg-gray-600';
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code className="h-4 w-4 text-gray-400" />
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getLanguageColor(language)} text-white`}>
            {language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors text-sm"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-900 p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CourseViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicContent | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const pollCourseRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const pollCourse = async () => {
      try {
        // ✅ FIXED: Use params.id directly (already a UUID string)
        const response = await courseAPI.getContent(params.id as string);
        const courseInfo = response.data;
        setCourse(courseInfo);

        if (courseInfo.status === 'completed') {
          // ✅ FIXED: Get content and access course_json
          const contentResponse = await courseAPI.getContent(params.id as string);
          const data = contentResponse.data.course_json as unknown as CourseData;

          setCourseData(data);

          // Auto-expand first module, chapter, and select first topic
          if (data.index?.modules?.length > 0) {
            const firstModule = data.index.modules[0];
            setExpandedModules(new Set([firstModule.moduleId]));

            if (firstModule.chapters?.length > 0) {
              const firstChapter = firstModule.chapters[0];
              setExpandedChapters(new Set([`${firstModule.moduleId}-${firstChapter.chapterId}`]));

              if (firstChapter.topics?.length > 0) {
                const firstTopicId = firstChapter.topics[0].topicId;
                const topicContent = data.content[firstTopicId];
                if (topicContent) {
                  setSelectedTopic(topicContent);
                }
              }
            }
          }
        } else if (courseInfo.status === 'generating') {
          setTimeout(() => pollCourseRef.current?.(), 5000);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      }
    };

    pollCourseRef.current = pollCourse;

    if (!user) {
      router.push('/login');
      return;
    }

    pollCourse();
  }, [user, router, params.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(moduleId)) {
        newExpanded.delete(moduleId);
      } else {
        newExpanded.add(moduleId);
      }
      return newExpanded;
    });
  };

  const toggleChapter = (chapterKey: string) => {
    setExpandedChapters((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(chapterKey)) {
        newExpanded.delete(chapterKey);
      } else {
        newExpanded.add(chapterKey);
      }
      return newExpanded;
    });
  };

  const handleTopicSelect = (topicId: string) => {
    if (courseData?.content[topicId]) {
      setSelectedTopic(courseData.content[topicId]);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (course.status === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Course...</h2>
          <p className="text-gray-600">This usually takes 1-2 minutes. Please wait.</p>
        </div>
      </div>
    );
  }

  if (course.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generation Failed</h2>
          <p className="text-gray-600 mb-4">{course.error_message}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <div className="flex-1">
              {/* ✅ FIXED: Use course.title instead of course.topic */}
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600 capitalize">
                {course.level} • Completed {course.completed_at && formatDateTime(course.completed_at)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Course Content
            </h2>
            {courseData && (
              <CourseSidebar
                courseData={courseData}
                selectedTopic={selectedTopic}
                onTopicSelect={handleTopicSelect}
                expandedModules={expandedModules}
                expandedChapters={expandedChapters}
                onToggleModule={toggleModule}
                onToggleChapter={toggleChapter}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {selectedTopic ? (
            <TopicViewer topic={selectedTopic} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a topic to view content</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// COURSE SIDEBAR
// ============================================================================

function CourseSidebar({
  courseData,
  selectedTopic,
  onTopicSelect,
  expandedModules,
  expandedChapters,
  onToggleModule,
  onToggleChapter,
}: {
  courseData: CourseData;
  selectedTopic: TopicContent | null;
  onTopicSelect: (topicId: string) => void;
  expandedModules: Set<string>;
  expandedChapters: Set<string>;
  onToggleModule: (moduleId: string) => void;
  onToggleChapter: (chapterKey: string) => void;
}) {
  if (!courseData?.index?.modules) {
    return <div className="text-gray-500">No content available</div>;
  }

  return (
    <div className="space-y-2">
      {courseData.index.modules.map((module) => {
        const isModuleExpanded = expandedModules.has(module.moduleId);

        return (
          <div key={module.moduleId} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Module Header */}
            <button
              onClick={() => onToggleModule(module.moduleId)}
              className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 transition"
            >
              {isModuleExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
              )}
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">
                  Module {module.moduleNumber}: {module.title}
                </div>
                <div className="text-xs text-gray-500 truncate">{module.description}</div>
              </div>
            </button>

            {/* Chapters */}
            {isModuleExpanded && (
              <div className="pb-2 px-2 space-y-1 bg-gray-50">
                {module.chapters.map((chapter) => {
                  const chapterKey = `${module.moduleId}-${chapter.chapterId}`;
                  const isChapterExpanded = expandedChapters.has(chapterKey);

                  return (
                    <div key={chapter.chapterId}>
                      {/* Chapter Header */}
                      <button
                        onClick={() => onToggleChapter(chapterKey)}
                        className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded transition"
                      >
                        {isChapterExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-700 text-sm">
                            {chapter.chapterNumber}. {chapter.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {chapter.estimatedMinutes} min
                          </div>
                        </div>
                      </button>

                      {/* Topics */}
                      {isChapterExpanded && (
                        <div className="ml-6 space-y-1 mt-1">
                          {chapter.topics.map((topic) => {
                            const isSelected = selectedTopic?.topicId === topic.topicId;

                            return (
                              <button
                                key={topic.topicId}
                                onClick={() => onTopicSelect(topic.topicId)}
                                className={`w-full text-left p-2 rounded text-sm transition ${
                                  isSelected
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <CheckCircle2
                                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                      isSelected ? 'text-blue-600' : 'text-gray-400'
                                    }`}
                                  />
                                  <span className="line-clamp-2">
                                    {topic.topicNumber}. {topic.title}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// TOPIC VIEWER
// ============================================================================

function TopicViewer({ topic }: { topic: TopicContent }) {
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
        parsed.push({
          type: 'code',
          content: part.content,
          language: part.language,
        });
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
            parsed.push({
              type: 'heading',
              content: trimmed.replace(/^####\s*/, '').replace(/#/g, ''),
              level: 4,
            });
          } else if (trimmed.startsWith('###')) {
            if (currentParagraph) {
              parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
              currentParagraph = '';
            }
            if (listItems.length > 0) {
              parsed.push({ type: 'list', content: '', items: [...listItems] });
              listItems = [];
            }
            parsed.push({
              type: 'heading',
              content: trimmed.replace(/^###\s*/, '').replace(/#/g, ''),
              level: 3,
            });
          } else if (trimmed) {
            currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
          } else if (currentParagraph) {
            parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
            currentParagraph = '';
          }
        });

        if (currentParagraph) {
          parsed.push({ type: 'paragraph', content: currentParagraph.trim() });
        }

        if (listItems.length > 0) {
          parsed.push({ type: 'list', content: '', items: listItems });
        }
      }
    });

    return parsed;
  };

  const parsedContent = parseExplanation(explanationText);

  const formatInlineText = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/([A-Za-z]+[A-Za-z ]+):/g, '<strong class="font-bold text-indigo-700">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-600">$1</em>');
  };

  return (
    <article className="max-w-5xl mx-auto p-8 bg-white">
      {/* Topic Title */}
      <header className="mb-10 pb-6 border-b-2 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{topic.title}</h1>
        {topic.metadata?.status && (
          <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4" />
            {topic.metadata.status}
          </span>
        )}
      </header>

      {/* Key Learning Points */}
      {keyPoints.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Key Learning Points</h2>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-lg p-6">
            <ul className="space-y-4">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-gray-800 leading-relaxed pt-1">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Main Content */}
      {explanationText && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 text-white rounded-lg p-2">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Main Content</h2>
          </div>
          <div className="space-y-6">
            {parsedContent.map((block, idx) => {
              if (block.type === 'heading') {
                if (block.level === 3) {
                  return (
                    <h3
                      key={idx}
                      className="text-2xl font-bold text-indigo-700 mt-10 mb-5 flex items-center gap-2"
                    >
                      <span className="text-indigo-600">▸</span> {block.content}
                    </h3>
                  );
                } else if (block.level === 4) {
                  return (
                    <h4 key={idx} className="text-xl font-bold text-gray-800 mt-8 mb-4">
                      {block.content}
                    </h4>
                  );
                }
              } else if (block.type === 'code') {
                return (
                  <CodeBlock
                    key={idx}
                    code={block.content}
                    language={block.language || 'plaintext'}
                  />
                );
              } else if (block.type === 'list') {
                return (
                  <ul key={idx} className="space-y-3 ml-6">
                    {block.items?.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                        <span className="text-indigo-600 font-bold mt-1 flex-shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{ __html: formatInlineText(item) }} />
                      </li>
                    ))}
                  </ul>
                );
              } else if (block.type === 'paragraph') {
                const formattedContent = formatInlineText(block.content);
                return (
                  <p
                    key={idx}
                    className="text-gray-700 leading-relaxed text-[17px]"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                );
              }
              return null;
            })}
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {sections.length > 0 && (
        <section className="mb-12">
          <div className="space-y-8">
            {sections.map((section, i) =>
              section.heading && section.content ? (
                <div key={i} className="border-l-4 border-purple-500 pl-6 py-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-purple-600">▸</span> {section.heading}
                  </h3>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Video Resources */}
      {videos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-600 text-white rounded-lg p-2">
              <Play className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Video Resources ({videos.length})
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* Metadata Footer */}
      {topic.metadata && (
        <footer className="mt-16 pt-6 border-t-2 border-gray-200">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {topic.metadata.generatedAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Generated: {formatDateTime(topic.metadata.generatedAt)}</span>
              </div>
            )}
            {topic.metadata.tokenCount && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{topic.metadata.tokenCount.toLocaleString()} tokens</span>
              </div>
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

// ============================================================================
// VIDEO CARD
// ============================================================================

function VideoCard({
  video,
}: {
  video: {
    id: string;
    title: string;
    channel: string;
    thumbnail: string;
    embed_url: string;
  };
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getPlayableUrl = (url: string | undefined) => {
    if (!url) return '';
    
    // Since YouTube URLs already have ?si= parameter, use & to append
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1&mute=1`;
  };

  return (
    <div className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-red-500 hover:shadow-2xl transition-all duration-300">
      {isPlaying ? (
        <div className="aspect-video">
          <iframe
            width="560"
            height="315"
            src={getPlayableUrl(video.embed_url)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div
          className="aspect-video relative cursor-pointer"
          onClick={() => video.embed_url && setIsPlaying(true)}
        >
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-4 group-hover:scale-125 transition-transform shadow-2xl">
              <Play className="h-10 w-10 text-white fill-white" />
            </div>
          </div>
        </div>
      )}
  
      <div className="p-4 bg-white">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
          {video.title}
        </h4>
  
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <Play className="h-3 w-3 text-red-600" />
          </div>
          <span>{video.channel}</span>
        </div>
      </div>
    </div>
  );
}