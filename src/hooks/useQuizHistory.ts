import { useState, useEffect } from 'react';
import { GenerateQuizResponse, QuizListResponse } from '../types/quiz';
import { quizAPI } from '../services/quizAPI';

export function useQuizHistory(page: number = 1, limit: number = 10, search?: string, difficulty?: string) {
  const [quizzes, setQuizzes] = useState<GenerateQuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await quizAPI.getQuizzes(page, limit, search, difficulty);
        setQuizzes(response.quizzes);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, limit, search, difficulty]);

  return { quizzes, loading, error, total };
}