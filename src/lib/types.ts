
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'generating' | 'completed' | 'failed';

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================================================
// COURSE TYPES - Basic Course Info
// ============================================================================

export interface Course {
  id: string;
  title: string;
  level: CourseLevel;
  status: CourseStatus;
  created_at: string;
  completed_at: string | null;
  error_message?: string;
  total_modules?: number;
  total_chapters?: number;
  total_topics?: number;
  estimated_minutes?: number;
}

// ============================================================================
// COURSE WITH FULL CONTENT
// ============================================================================

export interface CourseWithContent extends Course {
  course_json: CourseData;  // ✅ Matches backend response
}

// ============================================================================
// COURSE DATA STRUCTURE - The actual JSON content
// ============================================================================

export interface CourseData {
  metadata: {
    title: string;
    level: CourseLevel;
    version: string;
    courseId?: string;
    createdAt?: string;
  };
  index: {
    modules: ModuleIndex[];
  };
  content: {
    [topicId: string]: TopicContent;  // ✅ Topics as keys, not modules!
  };
}

// ============================================================================
// INDEX STRUCTURES - For navigation/table of contents
// ============================================================================

export interface ModuleIndex {
  moduleId: string;        // ✅ camelCase
  moduleNumber: number;    // ✅ camelCase
  title: string;
  description: string;
  chapters: ChapterIndex[];
}

export interface ChapterIndex {
  chapterId: string;       // ✅ camelCase
  chapterNumber: number;   // ✅ camelCase
  title: string;
  estimatedMinutes: number;  // ✅ camelCase
  topics: TopicIndex[];
}

export interface TopicIndex {
  topicId: string;         // ✅ camelCase
  topicNumber: number;     // ✅ camelCase
  title: string;
  contentPath: string;     // ✅ camelCase
}

// ============================================================================
// TOPIC CONTENT - The actual lesson data
// ============================================================================

export interface TopicContent {
  topicId: string;
  title: string;
  keyPoints?: string[];    // ✅ camelCase (not key_points)
  explanation?: {
    text: string;
  };
  sections?: Array<{
    heading?: string;
    content?: string;
  }>;
  resources?: {
    videos?: Video[];
    articles?: any;
  };
  metadata?: {
    status?: string;
    tokenCount?: number;     // ✅ camelCase
    generatedAt?: string;    // ✅ camelCase
  };
}

// ============================================================================
// VIDEO RESOURCE
// ============================================================================

export interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  embed_url: string;        // ✅ camelCase (not embed_url)
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}