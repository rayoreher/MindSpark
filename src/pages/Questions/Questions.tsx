import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Brain, Clock, FileText, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface QuestionInfo {
  open_questions: number;
  multiple_choice_questions: number;
  fill_in_the_blank: number;
  flashcards: number;
  micro_reels: number;
}

interface QuestionSet {
  id: string;
  name: string;
  info: QuestionInfo;
  created_at: string;
}

export const Questions: React.FC = () => {
  const navigate = useNavigate();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('questions')
        .select('id, name, info, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setQuestionSets(data || []);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError(err.message || 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getQuestionCounts = (questionSet: QuestionSet) => {
    // Use info field for question counts
    if (questionSet.info) {
      return {
        openQuestions: questionSet.info.open_questions,
        multipleChoice: questionSet.info.multiple_choice_questions,
        fillInTheBlank: questionSet.info.fill_in_the_blank,
        flashcards: questionSet.info.flashcards,
        microReels: questionSet.info.micro_reels,
        total: questionSet.info.open_questions + 
               questionSet.info.multiple_choice_questions + 
               questionSet.info.fill_in_the_blank + 
               questionSet.info.flashcards + 
               questionSet.info.micro_reels
      };
    }
    
    // Fallback if info is missing (shouldn't happen with new uploads)
    return {
      openQuestions: 0,
      multipleChoice: 0,
      fillInTheBlank: 0,
      flashcards: 0,
      microReels: 0,
      total: 0
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleQuestionSetClick = (questionSetId: string) => {
    navigate(`/questions/${questionSetId}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Question Sets
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access your uploaded question sets and start interactive learning sessions
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 bg-error-50 border border-error-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-error-600 flex-shrink-0" />
                <div>
                  <h3 className="text-error-800 font-medium">Error Loading Questions</h3>
                  <p className="text-error-700 text-sm mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={fetchQuestions}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <LoadingSkeleton className="w-24 h-6" />
                      <LoadingSkeleton className="w-16 h-4" />
                    </div>
                    <LoadingSkeleton className="w-full h-4" />
                    <LoadingSkeleton className="w-3/4 h-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <LoadingSkeleton className="w-full h-4" />
                      <LoadingSkeleton className="w-full h-4" />
                      <LoadingSkeleton className="w-full h-4" />
                      <LoadingSkeleton className="w-full h-4" />
                    </div>
                    <LoadingSkeleton className="w-full h-10" />
                  </div>
                </div>
              ))}
            </div>
          ) : questionSets.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Question Sets Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't uploaded any question sets yet. Upload your first set to get started with interactive learning.
              </p>
              <Button
                onClick={() => navigate('/upload')}
                icon={FileText}
                size="lg"
              >
                Upload Questions
              </Button>
            </div>
          ) : (
            /* Question Sets Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionSets.map((questionSet) => {
                const counts = getQuestionCounts(questionSet);
                
                return (
                  <div
                    key={questionSet.id}
                    onClick={() => handleQuestionSetClick(questionSet.id)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
                          <Brain className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {questionSet.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Created {formatDateShort(questionSet.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm flex-shrink-0">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-xs">
                          {formatDate(questionSet.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Question Counts */}
                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Open Questions:</span>
                          <span className="font-medium text-gray-900">{counts.openQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Multiple Choice:</span>
                          <span className="font-medium text-gray-900">{counts.multipleChoice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fill in Blank:</span>
                          <span className="font-medium text-gray-900">{counts.fillInTheBlank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flashcards:</span>
                          <span className="font-medium text-gray-900">{counts.flashcards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Micro Reels:</span>
                          <span className="font-medium text-gray-900">{counts.microReels}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-100">
                          <span className="text-gray-900 font-medium">Total:</span>
                          <span className="font-bold text-primary-600">{counts.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full group-hover:bg-primary-700 transition-colors"
                      icon={Play}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuestionSetClick(questionSet.id);
                      }}
                    >
                      Start Quiz
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Refresh Button */}
          {!isLoading && questionSets.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={fetchQuestions}
              >
                Refresh Questions
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};