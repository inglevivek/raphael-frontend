// File: src/lib/api.ts

import axios from 'axios';
import type { AuthResponse, Course, CourseWithContent, User } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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

  getMe: () => 
    api.get<User>('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),  
  refresh: () => api.post('/api/auth/refresh'), 
};

export const courseAPI = {
  create: (data: { title: string; level: string }) =>
    api.post<Course>('/api/courses', data),

  list: () => 
    api.get<Course[]>('/api/courses'),

  get: (id: string) =>
    api.get<Course>(`/api/courses/${id}`),

  getContent: (id: string) =>
    api.get<CourseWithContent>(`/api/courses/${id}/content`),

  delete: (id: string) =>
    api.delete(`/api/courses/${id}`),
};

export default api;