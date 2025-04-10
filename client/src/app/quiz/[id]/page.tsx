'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchQuizById } from '../../../store/slices/quizzesSlice';

export default function QuizPage() {
  const params = useParams();
  const quizId = parseInt(params.id as string);
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuiz, loading, error } = useSelector((state: RootState) => state.quizzes);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, quizId]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuiz?.questions[currentQuestionIndex].correct_answer_index) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
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
            </div>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setShowResults(false);
              }}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-200"
            >
              Try Again
            </button>
          </div>
        </div>
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