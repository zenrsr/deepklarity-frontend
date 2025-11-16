import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizTaker } from '../hooks/useQuizTaker';
import { quizAPI } from '../services/quizAPI';
import { SubmitQuizRequest } from '../types/quiz';
import { toast } from 'sonner';

interface QuizTakerProps {
  quiz: any;
}

export function QuizTaker({ quiz }: QuizTakerProps) {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    completed,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    resetQuiz,
  } = useQuizTaker(quiz?.quiz || []);

  const handleSubmit = async () => {
    try {
      const request: SubmitQuizRequest = {
        quiz_id: quizId!,
        answers: Object.entries(answers).map(([questionId, selected_option]) => ({
          question_id: questionId,
          selected_option,
        })),
      };

      const result = await quizAPI.submitQuiz(quizId!, request);
      
      navigate(`/results/${quizId}`, { state: { result, quiz } });
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
    }
  };

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Quiz not found</p>
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

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">You have answered all questions. Ready to see your results?</p>
          <div className="space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              View Results
            </button>
            <button
              onClick={resetQuiz}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {quiz.quiz.map((question: any, index: number) => (
            <button
              key={question.id}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[question.id]
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </span>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentQuestion.question}
          </h2>
          
          {currentQuestion.section_reference && (
            <p className="text-sm text-gray-500">
              From section: {currentQuestion.section_reference}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option: string, index: number) => (
            <label
              key={index}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                answers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={answers[currentQuestion.id] === option}
                onChange={() => selectAnswer(currentQuestion.id, option)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                answers[currentQuestion.id] === option
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {answers[currentQuestion.id] === option && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!answers[currentQuestion.id]}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Submit Quiz</span>
            <CheckCircle className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion.id]}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}