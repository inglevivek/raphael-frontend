// File: src/lib/api.ts
import axios, { AxiosError } from 'axios';
import type { AuthResponse, Course, User } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// JWT interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data),
  getMe: () => api.get<User>('/api/auth/me'),
};

export const courseAPI = {
  create: (data: { topic: string; level: string }) =>
    api.post<Course>('/api/courses', data),
  list: () => api.get<Course[]>('/api/courses'),
  get: (id: number) => api.get<Course>(`/api/courses/${id}`),
  getContent: (id: number) => api.get<{ content: unknown }>(`/api/courses/${id}/content`),
  delete: (id: number) => api.delete(`/api/courses/${id}`),
};

export default api;
