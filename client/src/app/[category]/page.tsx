'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchQuizzesByCategory } from '../../store/slices/quizzesSlice';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading, error } = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    if (category) {
      dispatch(fetchQuizzesByCategory(category));
    }
  }, [dispatch, category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-emerald-600 text-3xl">🌱</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {category} Quizzes
          </h1>
        </div>
        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No quizzes found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="block bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-emerald-200 transform hover:scale-105 transition-all duration-200 h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-emerald-600 text-xl">🌿</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {quiz.name}
                    </h2>
                  </div>
                  <p className="mt-2 text-gray-600 flex-grow">{quiz.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      {quiz.difficulty}
                    </span>
                    <span className="text-emerald-600 hover:translate-x-1 transition-transform">Start Quiz →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}