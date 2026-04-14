"use client";

import { useQuery } from "@tanstack/react-query";
import { CoursesAPI } from "@/lib/api/courses.api";

export function useGeneratePoll(courseId: string | null) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => CoursesAPI.getStatus(courseId!),
    enabled: courseId !== null,
    refetchInterval: (query) => {
      if (!courseId) return false;
      const status = query.state.data?.status;
      if (status === "pending" || status === "generating") return 2000;
      return false;
    },
  });
}
