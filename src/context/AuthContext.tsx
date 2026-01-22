'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount - cookie is sent automatically
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // Just call the API - cookie is sent automatically by browser
      const response = await authAPI.getMe();
      console.log('✅ Auth check successful:', response.data);
      setUser(response.data);
    } catch (error: any) {
      // No valid cookie or session expired
      console.log('ℹ️ No active session');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Backend sets HTTP-only cookie in response
      const response = await authAPI.login({ email, password });
      console.log('✅ Login successful');
      setUser(response.data.user);
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Backend sets HTTP-only cookie in response
      const response = await authAPI.register({ email, password, name });
      console.log('✅ Registration successful');
      setUser(response.data.user);
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      // Backend clears the HTTP-only cookie
      await authAPI.logout();
      console.log('✅ Logout successful');
      setUser(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Clear user anyway on error
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};