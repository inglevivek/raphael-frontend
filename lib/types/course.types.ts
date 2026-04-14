// lib/types/course.types.ts

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// 'generating' matches backend CourseStatusEnum — was incorrectly 'processing'
export type CourseStatus = 'pending' | 'generating' | 'completed' | 'failed';

// ── Backend course_json structure ────────────────────────────────────────────

export interface VideoResource {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  embed_url: string;
}

export interface TopicContent {
  topicId: string;
  title: string;
  keyPoints?: string[];
  explanation?: { text: string };
  sections?: Array<{ heading: string; content: string }>;
  resources?: { videos: VideoResource[] };
  metadata?: {
    status?: string;
    generatedAt?: string;
    tokenCount?: number;
  };
}

export interface TopicIndex {
  topicId: string;
  topicNumber: number;
  title: string;
}

export interface ChapterIndex {
  chapterId: string;
  chapterNumber: number;
  title: string;
  estimatedMinutes: number;
  topics: TopicIndex[];
}

export interface ModuleIndex {
  moduleId: string;
  moduleNumber: number;
  title: string;
  description: string;
  chapters: ChapterIndex[];
}

export interface CourseJson {
  metadata: Record<string, unknown>;
  index: { modules: ModuleIndex[] };
  content: Record<string, TopicContent>;   // keyed by topicId
}

// ── API response shapes ──────────────────────────────────────────────────────

export interface CourseMeta {
  id: string;
  title: string;
  level: CourseLevel;
  status: CourseStatus;
  total_modules: number | null;
  total_chapters: number | null;
  total_topics: number | null;
  estimated_minutes: number | null;
  error_message?: string;
  created_at: string;
  completed_at: string | null;
}

// GET /courses/{id} — full response including course_json
export interface CourseWithContent extends CourseMeta {
  course_json: CourseJson;   // was incorrectly typed as `course: CourseContent`
}

export interface CreateCoursePayload {
  title: string;
  level: CourseLevel;
}