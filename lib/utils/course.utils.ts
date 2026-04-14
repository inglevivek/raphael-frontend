// lib/utils/course.utils.ts

import type { CourseJson, ModuleIndex, TopicContent } from "../types/course.types";

// ── Flat topic entry for prev/next navigation ────────────────────────────────

export interface FlatTopic {
  mIdx: number;
  cIdx: number;
  tIdx: number;
  moduleId: string;
  chapterId: string;
  topicId: string;
  title: string;
}

// Ordered list of every topic across all modules/chapters
export function flattenTopics(courseJson: CourseJson): FlatTopic[] {
  const flat: FlatTopic[] = [];
  courseJson.index.modules.forEach((m, mIdx) =>
    m.chapters.forEach((c, cIdx) =>
      c.topics.forEach((t, tIdx) =>
        flat.push({
          mIdx, cIdx, tIdx,
          moduleId: m.moduleId,
          chapterId: c.chapterId,
          topicId: t.topicId,
          title: t.title,
        })
      )
    )
  );
  return flat;
}

// Resolve active indices → actual TopicContent from the content map
export function getTopicByIndices(
  courseJson: CourseJson,
  m: number,
  c: number,
  t: number
): TopicContent | null {
  const module = courseJson.index.modules[m];
  if (!module) return null;
  const chapter = module.chapters[c];
  if (!chapter) return null;
  const topicIndex = chapter.topics[t];
  if (!topicIndex) return null;
  return courseJson.content[topicIndex.topicId] ?? null;
}

// Total topic count across the whole course
export function getTotalTopics(courseJson: CourseJson): number {
  return courseJson.index.modules.reduce(
    (sum, m) => sum + m.chapters.reduce(
      (s, c) => s + c.topics.length, 0
    ), 0
  );
}

// Total estimated minutes across all chapters
export function getTotalMinutes(courseJson: CourseJson): number {
  return courseJson.index.modules.reduce(
    (sum, m) => sum + m.chapters.reduce(
      (s, c) => s + (c.estimatedMinutes ?? 0), 0
    ), 0
  );
}

// Check if a specific topicId is completed (for sidebar indicators)
export function getCompletionPercent(
  courseJson: CourseJson,
  completedTopics: Set<string>
): number {
  const total = getTotalTopics(courseJson);
  if (total === 0) return 0;
  const done = flattenTopics(courseJson).filter(t => completedTopics.has(t.topicId)).length;
  return Math.round((done / total) * 100);
}