"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CoursesAPI } from "@/lib/api/courses.api";
import type { CourseMeta, CreateCoursePayload } from "@/lib/types/course.types";

export function useUserCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: CoursesAPI.list,
    staleTime: 60_000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) => CoursesAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CoursesAPI.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });
      const previous = queryClient.getQueryData<CourseMeta[]>(["courses"]);
      queryClient.setQueryData<CourseMeta[]>(["courses"], (old) =>
        old ? old.filter((c) => c.id !== id) : []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["courses"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
