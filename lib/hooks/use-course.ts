"use client";

import { useQuery } from "@tanstack/react-query";
import { CoursesAPI } from "@/lib/api/courses.api";

export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => CoursesAPI.getStatus(id!),
    enabled: id !== null,
  });
}

export function useCourseContent(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ["course-content", id],
    queryFn: () => CoursesAPI.getContent(id!),
    enabled: enabled && id !== null,
  });
}
