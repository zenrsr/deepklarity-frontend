import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  GenerateQuizRequest, 
  GenerateQuizResponse, 
  SubmitQuizRequest, 
  SubmitQuizResponse,
  QuizListResponse,
  ApiError 
} from '../types/quiz';

class QuizAPI {
  private client: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002/api';
    
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error('API Response Error:', error.response?.data || error.message);
        
        if (error.response?.data?.error) {
          const apiError = error.response.data.error;
          throw new Error(apiError.message || 'An error occurred');
        }
        
        throw new Error(error.message || 'Network error');
      }
    );
  }

  async generateQuiz(request: GenerateQuizRequest): Promise<GenerateQuizResponse> {
    try {
      const response = await this.client.post<GenerateQuizResponse>('/quizzes/generate', request);
      return response.data;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      throw error;
    }
  }

  async getQuizzes(page: number = 1, limit: number = 10, search?: string, difficulty?: string): Promise<QuizListResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (search) params.append('search', search);
      if (difficulty) params.append('difficulty', difficulty);

      const response = await this.client.get<QuizListResponse>(`/quizzes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      throw error;
    }
  }

  async getQuiz(quizId: string): Promise<GenerateQuizResponse> {
    try {
      const response = await this.client.get<GenerateQuizResponse>(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      throw error;
    }
  }

  async submitQuiz(quizId: string, request: SubmitQuizRequest): Promise<SubmitQuizResponse> {
    try {
      const response = await this.client.post<SubmitQuizResponse>(`/quizzes/${quizId}/submit`, request);
      return response.data;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      throw error;
    }
  }

  async getRelatedTopics(quizId: string): Promise<{ related_topics: string[] }> {
    try {
      const response = await this.client.get<{ related_topics: string[] }>(`/quizzes/${quizId}/related`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch related topics:', error);
      throw error;
    }
  }
}

export const quizAPI = new QuizAPI();