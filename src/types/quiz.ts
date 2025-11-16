export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  evidence_span?: string;
  section_reference?: string;
}

export interface GenerateQuizRequest {
  url: string;
  questionCount?: number;
  difficulty?: string;
  question_count?: number;
  difficulty_distribution?: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface GenerateQuizResponse {
  id: string;
  url: string;
  title: string;
  summary: string;
  key_entities: {
    people: string[];
    organizations: string[];
    locations: string[];
  };
  sections: string[];
  quiz: QuizQuestion[];
  related_topics: string[];
  generated_at: string;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface SubmitQuizRequest {
  quiz_id: string;
  answers: {
    question_id: string;
    selected_option: string;
  }[];
  completed_at?: string;
}

export interface SubmitQuizResponse {
  quiz_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  results: {
    question_id: string;
    user_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation: string;
  }[];
  performance_feedback: string;
  suggested_topics: string[];
}

export interface QuizListResponse {
  quizzes: GenerateQuizResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}
