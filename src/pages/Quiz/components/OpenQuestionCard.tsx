import React, { useState, useEffect } from 'react';
import { CheckCircle, Eye, Edit3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { OpenQuestion } from '../../../types/supabaseQuestion';

interface OpenQuestionCardProps {
  question: OpenQuestion;
  onStateChange?: (questionId: string, state: {userAnswer: string, isSubmitted: boolean, showCorrectAnswer: boolean, isMarkedCorrect: boolean, isCorrect?: boolean}) => void;
}

export const OpenQuestionCard: React.FC<OpenQuestionCardProps> = ({ 
  question, 
  onStateChange 
}) => {
  // Each component instance has its own independent state
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isMarkedCorrect, setIsMarkedCorrect] = useState(false);

  // Reset state when question changes (new question instance)
  useEffect(() => {
    setUserAnswer('');
    setIsSubmitted(false);
    setShowCorrectAnswer(false);
    setIsMarkedCorrect(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      setIsSubmitted(true);
      onStateChange?.(question.id, {
        userAnswer: userAnswer.trim(),
        isSubmitted: true,
        showCorrectAnswer: false,
        isMarkedCorrect: false
      });
    }
  };

  const handleShowAnswer = () => {
    setShowCorrectAnswer(true);
    onStateChange?.(question.id, {
      userAnswer,
      isSubmitted,
      showCorrectAnswer: true,
      isMarkedCorrect
    });
  };

  const handleMarkCorrect = () => {
    setIsMarkedCorrect(true);
    onStateChange?.(question.id, {
      userAnswer,
      isSubmitted,
      showCorrectAnswer,
      isMarkedCorrect: true,
      isCorrect: true
    });
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    setShowCorrectAnswer(false);
    setIsMarkedCorrect(false);
    onStateChange?.(question.id, {
      userAnswer,
      isSubmitted: false,
      showCorrectAnswer: false,
      isMarkedCorrect: false
    });
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
    onStateChange?.(question.id, {
      userAnswer: e.target.value,
      isSubmitted,
      showCorrectAnswer,
      isMarkedCorrect
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          {question.question}
        </h3>
      </div>

      {/* User Answer Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <textarea
          value={userAnswer}
          onChange={handleAnswerChange}
          disabled={isSubmitted}
          placeholder="Type your answer here..."
          className={`w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            isSubmitted ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
          }`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="flex-1 sm:flex-none"
          >
            Submit Answer
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              icon={Edit3}
              onClick={handleEdit}
              size="sm"
            >
              Edit Answer
            </Button>
            
            {!showCorrectAnswer ? (
              <Button
                icon={Eye}
                onClick={handleShowAnswer}
                variant="secondary"
              >
                Show Correct Answer
              </Button>
            ) : (
              <Button
                icon={CheckCircle}
                onClick={handleMarkCorrect}
                variant={isMarkedCorrect ? 'outline' : 'primary'}
                disabled={isMarkedCorrect}
                className={isMarkedCorrect ? 'bg-success-50 border-success-300 text-success-700' : ''}
              >
                {isMarkedCorrect ? 'Marked as Correct ✓' : 'Mark as Correct'}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Correct Answer Display */}
      {showCorrectAnswer && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            Correct Answer:
          </h4>
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <p className="text-success-800">{question.answer}</p>
          </div>
          
          {!isMarkedCorrect && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                Compare your answer with the correct answer above. If they are similar in meaning, 
                click "Mark as Correct" to track your progress.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Status Indicator */}
      {isMarkedCorrect && (
        <div className="mt-4 flex items-center space-x-2 text-success-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Answer marked as correct!</span>
        </div>
      )}
    </div>
  );
};