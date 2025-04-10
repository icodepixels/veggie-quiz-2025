'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchCategorySamples } from '@/store/slices/quizzesSlice';

interface Quiz {
  id: number;
  name: string;
  description: string;
  difficulty: string;
}

interface CategorySamples {
  samples: {
    [key: string]: Quiz[];
  };
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { categorySamples, loading, error } = useSelector((state: RootState) => state.quizzes);

  useEffect(() => {
    dispatch(fetchCategorySamples());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Category Samples */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries((categorySamples as unknown as CategorySamples)?.samples || {}).map(([category, quizzes]) => {
            return (
              <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-emerald-200 transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                      <span className="text-emerald-600 text-xl">🌿</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {category}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {quizzes.map((quiz: Quiz) => (
                      <Link
                        key={quiz.id}
                        href={`/quiz/${quiz.id}`}
                        className="block p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {quiz.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {quiz.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                            {quiz.difficulty}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/${category}`}
                    className="mt-4 block text-center text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all {category} quizzes →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
