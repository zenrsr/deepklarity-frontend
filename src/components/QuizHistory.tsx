import React, { useState } from 'react';
import { useQuizHistory } from '../hooks/useQuizHistory';
import { GenerateQuizResponse } from '../types/quiz';
import { Search, Filter, Calendar, Brain, Clock, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function QuizHistory() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<GenerateQuizResponse | null>(null);
  
  const { quizzes, loading, error, total } = useQuizHistory(page, 10, search, difficulty);
  const navigate = useNavigate();

  const totalPages = Math.ceil(total / 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); 
  };

  const handleQuizClick = (quiz: GenerateQuizResponse) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyBadge = (quiz: GenerateQuizResponse) => {
    const { easy, medium, hard } = quiz.difficulty_distribution;
    if (hard > 0) return { label: 'Hard', color: 'bg-red-100 text-red-800' };
    if (medium > easy) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Easy', color: 'bg-green-100 text-green-800' };
  };

  if (loading && quizzes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading quiz history</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
        <p className="text-gray-600">Review your previously generated quizzes and track your progress</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes by title or topic..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-500 mb-4">
            {search || difficulty 
              ? "Try adjusting your search criteria"
              : "Generate your first quiz to get started!"
            }
          </p>
          {!search && !difficulty && (
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const difficultyBadge = getDifficultyBadge(quiz);
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleQuizClick(quiz)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyBadge.color}`}>
                        {difficultyBadge.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{quiz.summary}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Brain className="h-4 w-4" />
                        <span>{quiz.quiz.length} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(quiz.generated_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-green-600">{quiz.difficulty_distribution.easy} easy</span>
                        <span className="text-yellow-600">{quiz.difficulty_distribution.medium} medium</span>
                        <span className="text-red-600">{quiz.difficulty_distribution.hard} hard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuizClick(quiz);
                      }}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      title="Take Quiz"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuiz(quiz);
                      }}
                      className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedQuiz.summary}</p>
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quiz Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Questions:</span>
                      <span className="ml-2 font-medium">{selectedQuiz.quiz.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Generated:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(selectedQuiz.generated_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Easy:</span>
                      <span className="ml-2 font-medium text-green-600">{selectedQuiz.difficulty_distribution.easy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Medium:</span>
                      <span className="ml-2 font-medium text-yellow-600">{selectedQuiz.difficulty_distribution.medium}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hard:</span>
                      <span className="ml-2 font-medium text-red-600">{selectedQuiz.difficulty_distribution.hard}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuiz.related_topics.map((topic, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setSelectedQuiz(null);
                      handleQuizClick(selectedQuiz);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}