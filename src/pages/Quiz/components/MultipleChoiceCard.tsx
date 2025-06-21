import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { MultipleChoiceQuestion } from '../../../types/questions';

interface MultipleChoiceCardProps {
  question: MultipleChoiceQuestion;
  onStateChange?: (questionId: string, state: any) => void;
}

export const MultipleChoiceCard: React.FC<MultipleChoiceCardProps> = ({ 
  question, 
  onStateChange 
}) => {
  // Each component instance has its own independent state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes (new question instance)
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
      onStateChange?.(question.id, {
        selectedAnswer: index,
        isSubmitted: false
      });
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
      onStateChange?.(question.id, {
        selectedAnswer,
        isSubmitted: true,
        isCorrect: question.answers[selectedAnswer].is_correct
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    onStateChange?.(question.id, {
      selectedAnswer: null,
      isSubmitted: false,
      isCorrect: null
    });
  };

  const getAnswerStyle = (index: number) => {
    if (!isSubmitted) {
      return selectedAnswer === index
        ? 'border-primary-500 bg-primary-50 text-primary-700'
        : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50';
    }

    // After submission, show correct/incorrect
    const isCorrect = question.answers[index].is_correct;
    const isSelected = selectedAnswer === index;

    if (isCorrect) {
      return 'border-success-500 bg-success-50 text-success-700';
    } else if (isSelected && !isCorrect) {
      return 'border-error-500 bg-error-50 text-error-700';
    } else {
      return 'border-gray-200 bg-gray-50 text-gray-500';
    }
  };

  const getAnswerIcon = (index: number) => {
    if (!isSubmitted) return null;

    const isCorrect = question.answers[index].is_correct;
    const isSelected = selectedAnswer === index;

    if (isCorrect) {
      return <CheckCircle className="w-5 h-5 text-success-600" />;
    } else if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5 text-error-600" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          {question.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isSubmitted}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 flex items-center justify-between ${getAnswerStyle(index)} ${
              !isSubmitted ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <span className="font-medium">{answer.text}</span>
            {getAnswerIcon(index)}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="flex-1 sm:flex-none"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Try Again
          </Button>
        )}
      </div>

      {/* Result Message */}
      {isSubmitted && selectedAnswer !== null && (
        <div className="mt-6 p-4 rounded-lg border">
          {question.answers[selectedAnswer].is_correct ? (
            <div className="flex items-center space-x-2 text-success-700 bg-success-50 border-success-200">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Correct! Well done.</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-error-700 bg-error-50 border-error-200">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">
                Incorrect. The correct answer is highlighted above.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};