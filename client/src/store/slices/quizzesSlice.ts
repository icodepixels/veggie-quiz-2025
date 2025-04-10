import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

interface Question {
  id: number;
  question_text: string;
  choices: string[];
  correct_answer_index: number;
  explanation: string;
  category: string;
  difficulty: string;
  image: string;
}

interface Quiz {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  questions: Question[];
}

interface CategorySamples {
  [category: string]: Quiz[];
}

interface QuizzesState {
  quizzes: Quiz[];
  categorySamples: CategorySamples;
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  categorySamples: {},
  currentQuiz: null,
  loading: false,
  error: null,
};

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/quizzes`);
    return response.data;
  }
);

export const fetchQuizzesByCategory = createAsyncThunk(
  'quizzes/fetchQuizzesByCategory',
  async (category: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/quizzes`, {
      params: { category }
    });
    return response.data;
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchQuizById',
  async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/api/quizzes/${id}`);
    return response.data;
  }
);

export const fetchCategorySamples = createAsyncThunk(
  'quizzes/fetchCategorySamples',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/quizzes/category-samples`);
    return response.data;
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      })
      .addCase(fetchQuizzesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes by category';
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quiz';
      })
      .addCase(fetchCategorySamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorySamples.fulfilled, (state, action) => {
        state.loading = false;
        state.categorySamples = action.payload;
      })
      .addCase(fetchCategorySamples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category samples';
      });
  },
});

export default quizzesSlice.reducer;