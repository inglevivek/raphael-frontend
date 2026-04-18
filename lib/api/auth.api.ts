"use client";

import { apiClient } from "./client";
import type { User } from "@/lib/types/user.types";

export const AuthAPI = {
  async me(): Promise<{ user: User }> {
    const res = await apiClient.get<{ user: User }>("/auth/me");
    return res.data;
  },

  async refresh(): Promise<{ user: User; message: string }> {
    const res = await apiClient.post<{ user: User; message: string }>("/auth/refresh");
    return res.data;
  },
};