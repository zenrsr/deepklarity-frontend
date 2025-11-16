import { useState } from 'react';
import { GenerateQuizResponse } from '../types/quiz';
import { quizAPI } from '../services/quizAPI';

export function useQuizGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);

  const generateQuiz = async (url: string, questionCount: number = 8, difficulty: string = 'mixed') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await quizAPI.generateQuiz({ 
        url, 
        question_count: questionCount, 
        difficulty 
      });
      setQuiz(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setError(null);
  };

  return {
    loading,
    error,
    quiz,
    generateQuiz,
    resetQuiz,
  };
}