// File: src/lib/types.ts
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'generating' | 'completed' | 'failed';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Course {
  id: number;
  topic: string;
  level: CourseLevel;
  status: CourseStatus;
  created_at: string;
  completed_at: string | null;
  error_message?: string;
}

export interface CourseContent {
  [moduleKey: string]: {
    [chapterKey: string]: {
      [topicKey: string]: Topic;
    };
  };
}

export interface Topic {
  topicId: string;
  title: string;
  keyPoints: string[];
  explanation: { text: string };
  sections?: Section[];
  resources: {
    videos: Video[];
    articles: Article[];
  };
  metadata: {
    tokenCount: number;
    generatedAt: string;
    status: string;
  };
}

export interface Section {
  heading: string;
  content: string;
}

export interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  embedUrl: string;
}

export interface Article {
  id?: string;
  title?: string;
  url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
