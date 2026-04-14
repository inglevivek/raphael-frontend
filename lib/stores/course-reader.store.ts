import { create } from "zustand";

interface CourseReaderState {
  activeModuleIndex: number;
  activeChapterIndex: number;
  activeTopicIndex: number;
  completedTopics: Set<string>;
  sidebarOpen: boolean;

  setActiveTopic: (m: number, c: number, t: number) => void;
  markTopicComplete: (topicTitle: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  resetReader: () => void;
}

export const useCourseReaderStore = create<CourseReaderState>((set) => ({
  activeModuleIndex: 0,
  activeChapterIndex: 0,
  activeTopicIndex: 0,
  completedTopics: new Set<string>(),
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 768 : false,

  setActiveTopic: (m, c, t) =>
    set({ activeModuleIndex: m, activeChapterIndex: c, activeTopicIndex: t }),

  markTopicComplete: (topicTitle) =>
    set((state) => ({
      completedTopics: new Set([...state.completedTopics, topicTitle]),
    })),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  resetReader: () =>
    set({
      activeModuleIndex: 0,
      activeChapterIndex: 0,
      activeTopicIndex: 0,
    }),
}));

export const selectActiveIndices = (s: CourseReaderState) => ({
  m: s.activeModuleIndex,
  c: s.activeChapterIndex,
  t: s.activeTopicIndex,
});
