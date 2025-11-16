import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import { Toaster } from 'sonner';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { GenerateQuiz } from "@/components/GenerateQuiz";
import { QuizHistory } from "@/components/QuizHistory";
import { QuizTaker } from "@/components/QuizTaker";
import { QuizResults } from "@/components/QuizResults";
import { useEffect, useState } from 'react';
import { quizAPI } from './services/quizAPI';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <GenerateQuiz />
    </div>
  );
}

function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <QuizHistory />
    </div>
  );
}

function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError('No quiz ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const quizData = await quizAPI.getQuiz(quizId);
        setQuiz(quizData);
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading quiz: {error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <QuizTaker quiz={quiz} />
    </div>
  );
}

function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <QuizResults />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/results/:quizId" element={<ResultsPage />} />
        <Route path="/leaderboard" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Leaderboard - Coming Soon</div>} />
        <Route path="/learn" element={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Learn More - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
