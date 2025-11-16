import React, { useState } from 'react';
import { Globe, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuizGenerator } from '../hooks/useQuizGenerator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function GenerateQuiz() {
  const [url, setUrl] = useState('');
  const [questionCount, setQuestionCount] = useState(8);
  const [difficulty, setDifficulty] = useState('mixed');
  const { loading, error, quiz, generateQuiz, resetQuiz } = useQuizGenerator();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a Wikipedia URL');
      return;
    }

    if (!url.includes('wikipedia.org')) {
      toast.error('Please enter a valid Wikipedia URL');
      return;
    }

    try {
      const result = await generateQuiz(url, questionCount, difficulty);
      if (result) {
        toast.success('Quiz generated successfully!');
        setTimeout(() => {
          navigate(`/quiz/${result.id}`);
        }, 1000);
      }
    } catch (err) {
      toast.error('Failed to generate quiz. Please try again.');
    }
  };

  const sampleUrls = [
    'https://en.wikipedia.org/wiki/Alan_Turing',
    'https://en.wikipedia.org/wiki/Machine_learning',
    'https://en.wikipedia.org/wiki/Climate_change',
    'https://en.wikipedia.org/wiki/Artificial_intelligence',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generate AI-Powered Quiz
        </h1>
        <p className="text-lg text-gray-600">
          Transform any Wikipedia article into an interactive quiz with AI-generated questions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="wikipedia-url" className="block text-sm font-medium text-gray-700 mb-2">
              Wikipedia Article URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="wikipedia-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://en.wikipedia.org/wiki/Article_Title"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5 Questions</option>
                <option value={6}>6 Questions</option>
                <option value={7}>7 Questions</option>
                <option value={8}>8 Questions</option>
                <option value={9}>9 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mixed">Mixed Difficulty</option>
                <option value="easy">Easy Only</option>
                <option value="medium">Medium Only</option>
                <option value="hard">Hard Only</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating Quiz...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Generate Quiz</span>
              </div>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {quiz && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-700">
                Quiz generated successfully! <strong>{quiz.title}</strong> - {quiz.quiz.length} questions
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Popular Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleUrls.map((sampleUrl, index) => {
            const title = sampleUrl.split('/wiki/')[1]?.replace(/_/g, ' ') || 'Article';
            return (
              <button
                key={index}
                onClick={() => setUrl(sampleUrl)}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-600">{title}</div>
                <div className="text-sm text-gray-500 mt-1">Click to use this article</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Enter URL</h4>
            <p className="text-sm text-gray-600">Paste any Wikipedia article URL</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">AI Generation</h4>
            <p className="text-sm text-gray-600">Our AI analyzes the content and creates questions</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Take Quiz</h4>
            <p className="text-sm text-gray-600">Test your knowledge with interactive questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}