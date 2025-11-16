import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ExternalLink, BookOpen, Award, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { SubmitQuizResponse } from '../types/quiz';

export function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { result, quiz } = location.state as { result: SubmitQuizResponse; quiz: any };

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">No results found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { score, correct_answers, total_questions, performance_feedback, results, suggested_topics } = result;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 70) return 'Great job! 👏';
    if (score >= 50) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>
        <button
          onClick={() => navigate(`/quiz/${result.quiz_id}`)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Retake Quiz</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
        <div className="mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}%
          </div>
          <div className="text-xl text-gray-600 mb-2">
            {getScoreMessage(score)}
          </div>
          <div className="text-gray-500">
            {correct_answers} out of {total_questions} questions correct
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium">{performance_feedback}</p>
        </div>

        <div className="flex justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{correct_answers}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{total_questions - correct_answers}</div>
            <div className="text-sm text-gray-500">Incorrect</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{total_questions}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Detailed Results</span>
        </h2>

        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                  {result.is_correct ? (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Correct
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      Incorrect
                    </div>
                  )}
                </div>
                {result.is_correct ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Your Answer:</p>
                  <p className={`p-2 rounded border ${
                    result.is_correct 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {result.user_answer || 'Not answered'}
                  </p>
                </div>

                {!result.is_correct && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Correct Answer:</p>
                    <p className="p-2 rounded border bg-green-50 border-green-200 text-green-800">
                      {result.correct_answer}
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-medium text-gray-900 mb-1">Explanation:</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {suggested_topics.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Suggested Topics for Further Learning</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggested_topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => {
                  const searchQuery = topic.replace(/\s+/g, '_');
                  navigate(`/?search=${searchQuery}`);
                }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-gray-900">{topic}</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}