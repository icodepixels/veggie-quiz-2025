'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.push('/signin');
    }
  }, [token, router]);

  const handleSignOut = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!mounted || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
              <p className="mt-2 text-sm text-gray-600">Personal details and account information</p>
            </div>
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-emerald-700">Username</dt>
                  </div>
                  <div className="sm:col-span-2">
                    <dd className="text-sm text-gray-900">{user?.username}</dd>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-emerald-700">Email address</dt>
                  </div>
                  <div className="sm:col-span-2">
                    <dd className="text-sm text-gray-900">{user?.email}</dd>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-emerald-700">Member since</dt>
                  </div>
                  <div className="sm:col-span-2">
                    <dd className="text-sm text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSignOut}
                  className="px-6 py-3 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}