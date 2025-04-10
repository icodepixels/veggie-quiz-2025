import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import { setAuthToken } from '../../utils/axios';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Load initial state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

const initialState: AuthState = loadState() || {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (email: string) => {
    const response = await api.post('/auth/token', { email });
    const token = response.data.access_token;
    setAuthToken(token);
    const userResponse = await api.get('/users/me');
    return {
      token: response.data.access_token,
      user: userResponse.data
    };
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ username, email }: { username: string; email: string }) => {
    const response = await api.post('/users/', { username, email });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        // Save to localStorage when login is successful
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          status: 'succeeded',
          error: null,
        }));
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to sign up';
      });
  },
});

export const { logout, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;