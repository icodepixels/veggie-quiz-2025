'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { signIn } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '../../store/store';
import { useState, useEffect } from 'react';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-3xl">🌱</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-emerald-700 text-sm mb-8">
              Sign in to continue your plant journey
            </p>
          </div>
          <div className="mt-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="mb-4">
                <div className="rounded-md">
                  <input
                    type="email"
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Sign in
              </button>
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-500">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-3xl">🌱</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-emerald-700 text-sm mb-8">
            Sign in to continue your plant journey
          </p>
        </div>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={SignInSchema}
          onSubmit={async (values) => {
            const resultAction = await dispatch(signIn(values.email));
            if (signIn.fulfilled.match(resultAction)) {
              router.push('/profile');
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="bg-white p-8 rounded-xl shadow-md">
              <div className="mb-4">
                <div className="mb-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm"
                    placeholder="you@example.com"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Signing in...' : 'Sign in'}
              </button>

              {error && (
                <div className="mt-3 text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">{error}</div>
              )}

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-500">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign up
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}