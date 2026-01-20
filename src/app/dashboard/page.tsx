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

  const handleDelete = async (id: number) => {
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Raphael</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Create Course Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            Create New Course
          </button>
        </div>

        {/* Course Library */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Courses ({courses.length})
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-blue-600 hover:underline"
              >
                Create your first course
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </main>

      {/* Create Course Modal */}
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
  onDelete: (id: number) => void;
  onClick: () => void;
}) {
  const statusConfig = {
    generating: {
      icon: <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />,
      text: 'Generating...',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    },
    completed: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'Completed',
      color: 'bg-green-50 border-green-200 text-green-700',
    },
    failed: {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      text: 'Failed',
      color: 'bg-red-50 border-red-200 text-red-700',
    },
  };

  const status = statusConfig[course.status];

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {course.topic}
          </h3>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            {course.level}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(course.id);
          }}
          className="text-gray-400 hover:text-red-600 transition"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${status.color}`}>
        {status.icon}
        <span className="text-sm font-medium">{status.text}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        Created {formatDate(course.created_at)}
      </div>

      {course.error_message && (
        <p className="mt-2 text-sm text-red-600">{course.error_message}</p>
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
    topic: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await courseAPI.create(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Topic
            </label>
            <input
              type="text"
              required
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Deep Learning with TensorFlow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: e.target.value as any,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
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
