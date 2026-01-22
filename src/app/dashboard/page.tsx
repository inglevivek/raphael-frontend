// File: src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { courseAPI } from '@/lib/api';
import { Course } from '@/lib/types';
import {
  BookOpen,
  Plus,
  LogOut,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AxiosError } from 'axios';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.list();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseAPI.delete(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Raphael AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Your Courses ({courses.length})</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first AI-generated course
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 hover:underline"
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onDelete={handleDelete}
                onClick={() => router.push(`/courses/${course.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadCourses();
          }}
        />
      )}
    </div>
  );
}

function CourseCard({
  course,
  onDelete,
  onClick,
}: {
  course: Course;
  onDelete: (id: string) => void;
  onClick: () => void;
}) {
  const statusConfig = {
    generating: {
      icon: <Clock className="w-4 h-4" />,
      text: 'Generating...',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4" />,
      text: 'Completed',
      color: 'bg-green-50 border-green-200 text-green-700',
    },
    failed: {
      icon: <XCircle className="w-4 h-4" />,
      text: 'Failed',
      color: 'bg-red-50 border-red-200 text-red-700',
    },
  };

  const status = statusConfig[course.status];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(course.id);
          }}
          className="text-gray-400 hover:text-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {course.level}
        </span>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${status.color}`}>
        {status.icon}
        <span className="text-sm font-medium">{status.text}</span>
      </div>

      <p className="text-sm text-gray-500 mt-3">Created {formatDate(course.created_at)}</p>

      {course.error_message && (
        <p className="text-sm text-red-600 mt-2">{course.error_message}</p>
      )}
    </div>
  );
}

function CreateCourseModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || formData.title.trim().length === 0) {
      setError('Title cannot be empty');
      return;
    }

    if (formData.title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      await courseAPI.create(formData);
      onSuccess();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Deep Learning with TensorFlow"
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || formData.title.length > 200}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}