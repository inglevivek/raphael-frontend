// lib/api/client.ts
import axios, { AxiosHeaders } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const res = await fetch('/api/auth/token'); // /api/ prefix!
      if (res.ok) {
        const { token } = await res.json();
        if (token) {
          // Don't check if headers exist — just set it directly
          (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
        }
      }
    } catch (err) {
      console.error('Failed to get access token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const detail = err.response?.data?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg ?? String(d)).join(', ')
          : err.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);