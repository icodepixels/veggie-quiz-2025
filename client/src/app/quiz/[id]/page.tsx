'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchQuizById } from '../../../store/slices/quizzesSlice';
import { signIn, signUp } from '../../../store/slices/authSlice';
import AuthModal from '@/components/AuthModal';

export default function QuizPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuiz, loading, error } = useSelector((state: RootState) => state.quizzes);
  const { token } = useSelector((state: RootState) => state.auth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    // Show auth modal if user completes quiz but isn't signed in
    if (showResults && !token) {
      setShowAuthModal(true);
    }
  }, [showResults, token]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (!currentQuiz) {
      setSaveError('Quiz information not available');
      return;
    }

    if (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct_answer_index) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate final score including the last question
      const finalScore = score + (selectedAnswer === currentQuiz.questions[currentQuestionIndex].correct_answer_index ? 1 : 0);
      setScore(finalScore);
      setShowResults(true);

      // Save results to database if user is authenticated
      if (token && currentQuiz) {
        saveQuizResult(finalScore, currentQuiz.questions.length);
      }
    }
  };

  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError(null);

      try {
        // First attempt to sign in
        const result = await dispatch(signIn(email)).unwrap();

        if (result && result.token) {
          // Instead of saving immediately, wait for Redux state to update with token
          setTimeout(() => {
            // Get fresh token from Redux store after login
            const currentToken = localStorage.getItem('auth')
              ? JSON.parse(localStorage.getItem('auth') || '{}').token
              : null;

            if (currentToken) {
              // Successfully signed in and token is available, now save quiz result
              if (currentQuiz) {
                saveQuizResult(score, currentQuiz.questions.length, currentToken);
              }
            } else {
              console.error('Token not available after sign in');
              setAuthError('Authentication succeeded but token is not available. Please try again.');
            }
            setShowAuthModal(false);
          }, 500); // Give Redux a moment to update the store
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('401')) {
          console.log('Sign-in failed with 401, attempting to sign up');

          try {
            // Extract username from email (everything before @)
            const username = email.split('@')[0];

            // Call sign up with username and email
            await dispatch(signUp({ username, email })).unwrap();

            // If signup succeeds, try signing in again
            const signInResult = await dispatch(signIn(email)).unwrap();

            if (signInResult && signInResult.token) {
              setTimeout(() => {
                const currentToken = localStorage.getItem('auth')
                  ? JSON.parse(localStorage.getItem('auth') || '{}').token
                  : null;

                if (currentToken) {
                  if (currentQuiz) {
                    saveQuizResult(score, currentQuiz.questions.length, currentToken);
                  }
                } else {
                  console.error('Token not available after sign up and sign in');
                  setAuthError('Account created but authentication failed. Please try again.');
                }
                setShowAuthModal(false);
              }, 500);
            }
          } catch (signUpError) {
            console.error('Sign up error:', signUpError);
            setAuthError('Failed to create an account. The username might already be taken.');
          }
        } else {
          // Handle other errors
          console.error('Authentication error:', error);
          setAuthError('Failed to authenticate. Please try again.');
        }
      }
    } catch (error) {
      console.error('Unexpected error in authentication flow:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, currentQuiz, score, dispatch]);

  const saveQuizResult = async (finalScore: number, totalQuestions: number, overrideToken?: string) => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      setSaveError(null);

      // Use provided token override or fall back to Redux store token
      const authToken = overrideToken || token;

      if (!authToken) {
        console.error('No token available for API request');
        setSaveError('You must be logged in to save your results');
        setIsSaving(false);
        return;
      }

      if (!currentQuiz) {
        setSaveError('Quiz information not available');
        setIsSaving(false);
        return;
      }

      // Calculate score percentage
      const scorePercentage = (finalScore / totalQuestions) * 100;

      console.log('Saving quiz result:', {
        quiz_id: currentQuiz.id,
        score: scorePercentage,
        correct_answers: finalScore,
        total_questions: totalQuestions
      });

      // Use fallback URL if NEXT_PUBLIC_API_URL is not defined
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Using API URL:', apiUrl);

      // Correct endpoint from backend code: /api/quizzes/user-results
      const endpoint = '/api/quizzes/user-results';
      console.log('Making request to:', `${apiUrl}${endpoint}`);

      // Prepare request payload
      const payload = {
        quiz_id: currentQuiz.id,
        score: scorePercentage,
        correct_answers: finalScore,
        total_questions: totalQuestions
      };

      console.log('Request payload:', payload);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.substring(0, 10)}...`
      });

      // Send result to API
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      console.log('API response status:', response.status, response.statusText);

      if (!response.ok) {
        // Standard error messages based on status code
        const errorStatusMessages: {[key: number]: string} = {
          400: 'Bad request - please check your data',
          401: 'Authentication failed - please log in again',
          403: 'You do not have permission to submit results',
          404: 'Quiz not found on server',
          409: 'You have already taken this quiz',
          500: 'Server error - please try again later'
        };

        // Try to get the response body for more details
        const errorText = await response.text();
        console.log('Raw error response:', errorText);

        let errorData = { detail: errorStatusMessages[response.status] || 'Unknown error occurred' };

        try {
          // Only try to parse if there's actual content
          if (errorText && errorText.trim() !== '' && errorText.includes('{')) {
            errorData = JSON.parse(errorText);
            console.log('Parsed error response:', errorData);
          } else {
            console.log('Non-JSON error response or empty response body');
            // Use status-based message for empty responses
            if (!errorData.detail && response.status in errorStatusMessages) {
              errorData.detail = errorStatusMessages[response.status];
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorData = {
            detail: errorText || errorStatusMessages[response.status] || `Error ${response.status}: ${response.statusText}`
          };
        }

        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });

        // Handle specific error cases
        if (response.status === 401) {
          console.error('Authentication failed. Token might be invalid or expired.');
          setSaveError('Your session has expired. Please log in again to save your results.');
        } else if (response.status === 409) {
          setSaveError("You've already taken this quiz before.");
        } else if (response.status === 404) {
          setSaveError("Quiz not found on the server.");
        } else {
          setSaveError(errorData.detail || 'Failed to save your results. Please try again.');
        }

        setIsSaving(false);
        setSaveStatus('error');
        return;
      }

      // Try to parse the successful response
      const result = await response.json().catch(() => null);
      console.log('Quiz result saved successfully:', result);

      setSaveStatus('success');
      setIsSaving(false);
    } catch (error) {
      console.error('Error in saveQuizResult:', error);
      setSaveError('An unexpected error occurred. Please try again.');
      setSaveStatus('error');
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error || 'Quiz not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 text-4xl">
                  {percentage >= 80 ? '🎉' : percentage >= 60 ? '🌱' : '🌿'}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-lg text-gray-600">
                You scored {score} out of {currentQuiz.questions.length} questions correctly
              </p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-emerald-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{percentage}%</p>
              </div>

              {/* Show result save status */}
              {!token && !showAuthModal && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm">
                  <p className="text-yellow-700">Sign in to save your quiz results</p>
                </div>
              )}

              {isSaving && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-emerald-600 rounded-full border-t-transparent mr-2"></div>
                    <p className="text-emerald-700 text-sm">Saving your results...</p>
                  </div>
                </div>
              )}

              {saveStatus === 'success' && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-emerald-700 text-sm">✓ Your results have been saved!</p>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">{saveError}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setShowResults(false);
                setSaveStatus('idle');
                setSaveError(null);
              }}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-200"
            >
              Try Again
            </button>
          </div>
        </div>

        {/* Render auth modal if showing results and not signed in */}
        {showAuthModal &&
          <AuthModal
            initialEmail={email}
            onEmailChange={setEmail}
            authError={authError}
            isSubmitting={isSubmitting}
            handleSignIn={handleSignIn}
          />
        }
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
              <span className="text-emerald-600 text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.name}</h1>
              <p className="text-gray-600">{currentQuiz.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
              <span className="text-emerald-600 font-medium">
                {Math.round((currentQuestionIndex / currentQuiz.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentQuestionIndex / currentQuiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question_text}
            </h2>
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-green-50'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-3 px-6 rounded-full text-white font-medium transition-all duration-200 ${
              selectedAnswer === null
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200'
            }`}
          >
            {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}