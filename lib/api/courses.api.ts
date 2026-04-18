"use client";

import { apiClient } from "./client";
import type { CourseMeta, CourseWithContent, CreateCoursePayload } from "@/lib/types/course.types";

export const CoursesAPI = {
  async create(payload: CreateCoursePayload): Promise<CourseMeta> {
    const res = await apiClient.post<CourseMeta>("/courses/", payload);
    return res.data;
  },

  async list(): Promise<CourseMeta[]> {
    const res = await apiClient.get<CourseMeta[]>("/courses/");
    return res.data;
  },

  async getStatus(id: string): Promise<CourseMeta> {
    const res = await apiClient.get<CourseMeta>(`/courses/${id}`);
    return res.data;
  },

  async getContent(id: string): Promise<CourseWithContent> {
    const res = await apiClient.get<CourseWithContent>(`/courses/${id}/content`);
    return res.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/courses/${id}`);
    return res.data;
  },
};