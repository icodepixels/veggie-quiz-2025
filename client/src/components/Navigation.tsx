'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchCategories, selectCategories, selectCategoriesLoading } from '../store/slices/categoriesSlice';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCategories());
  }, [dispatch]);

  // Return a simplified navigation during SSR and before hydration
  if (!mounted) {
    return (
      <nav className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center text-xl font-bold text-emerald-600">
                  <span className="mr-2">🌱</span>
                  Veggie Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center text-xl font-bold text-emerald-600">
                <span className="mr-2">🌱</span>
                Veggie Quiz
              </Link>
            </div>
            {/* Categories in desktop view */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {!categoriesLoading && categories.map((category) => (
                <Link
                  key={category}
                  href={`/${category.toLowerCase()}`}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {token ? (
              <Link
                href="/profile"
                className="px-4 py-2 rounded-md text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-md text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {/* Categories in mobile view */}
            {!categoriesLoading && categories.map((category) => (
              <Link
                key={category}
                href={`/${category.toLowerCase()}`}
                className="block px-4 py-2 text-base font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            {token ? (
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="block px-4 py-2 text-base font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}