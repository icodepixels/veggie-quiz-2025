import { configureStore, Middleware } from '@reduxjs/toolkit';
import { Action } from 'redux';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import quizzesReducer from './slices/quizzesSlice';

// Middleware to save auth state to localStorage
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if ((action as Action).type?.startsWith('auth/')) {
    const state = store.getState();
    localStorage.setItem('auth', JSON.stringify(state.auth));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    quizzes: quizzesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;