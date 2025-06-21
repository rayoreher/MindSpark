import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { FillInTheBlank } from '../../../types/questions';

interface FillInTheBlankCardProps {
  question: FillInTheBlank;
  onStateChange?: (questionId: string, state: any) => void;
}

export const FillInTheBlankCard: React.FC<FillInTheBlankCardProps> = ({ 
  question, 
  onStateChange 
}) => {
  // Each component instance has its own independent state
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes (new question instance)
  useEffect(() => {
    setSelectedAnswer('');
    setIsSubmitted(false);
  }, [question.id]);

  // Parse the question to find blanks ({{word}} format)
  const parseQuestion = () => {
    const parts = question.question.split(/(\{\{[^}]+\}\})/);
    return parts.map((part, index) => {
      if (part.match(/\{\{[^}]+\}\}/)) {
        // This is a blank to fill
        return (
          <span
            key={index}
            className={`inline-block min-w-[120px] px-3 py-1 mx-1 border-b-2 text-center font-medium ${
              selectedAnswer
                ? isSubmitted
                  ? question.answers.find(a => a.text === selectedAnswer)?.is_correct
                    ? 'border-success-500 text-success-700 bg-success-50'
                    : 'border-error-500 text-error-700 bg-error-50'
                  : 'border-primary-500 text-primary-700 bg-primary-50'
                : 'border-gray-300 text-gray-400 bg-gray-50'
            }`}
          >
            {selectedAnswer || '___'}
          </span>
        );
      }
      return part;
    });
  };

  const handleAnswerSelect = (answerText: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerText);
      onStateChange?.(question.id, {
        selectedAnswer: answerText,
        isSubmitted: false
      });
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
      const isCorrect = question.answers.find(a => a.text === selectedAnswer)?.is_correct || false;
      onStateChange?.(question.id, {
        selectedAnswer,
        isSubmitted: true,
        isCorrect
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    onStateChange?.(question.id, {
      selectedAnswer: '',
      isSubmitted: false,
      isCorrect: null
    });
  };

  const getButtonStyle = (answerText: string) => {
    if (!isSubmitted) {
      return selectedAnswer === answerText
        ? 'border-primary-500 bg-primary-50 text-primary-700'
        : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50';
    }

    // After submission, show correct/incorrect
    const answer = question.answers.find(a => a.text === answerText);
    const isCorrect = answer?.is_correct || false;
    const isSelected = selectedAnswer === answerText;

    if (isCorrect) {
      return 'border-success-500 bg-success-50 text-success-700';
    } else if (isSelected && !isCorrect) {
      return 'border-error-500 bg-error-50 text-error-700';
    } else {
      return 'border-gray-200 bg-gray-50 text-gray-500';
    }
  };

  const getButtonIcon = (answerText: string) => {
    if (!isSubmitted) return null;

    const answer = question.answers.find(a => a.text === answerText);
    const isCorrect = answer?.is_correct || false;
    const isSelected = selectedAnswer === answerText;

    if (isCorrect) {
      return <CheckCircle className="w-4 h-4 text-success-600" />;
    } else if (isSelected && !isCorrect) {
      return <XCircle className="w-4 h-4 text-error-600" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-700 mb-6">
          Fill in the blank:
        </h3>
        <div className="text-2xl leading-relaxed text-gray-900">
          {parseQuestion()}
        </div>
      </div>

      {/* Answer Choices */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-4">
          Choose the correct word:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer.text)}
              disabled={isSubmitted}
              className={`p-3 text-center border-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${getButtonStyle(answer.text)} ${
                !isSubmitted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="font-medium">{answer.text}</span>
              {getButtonIcon(answer.text)}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
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
      {isSubmitted && selectedAnswer && (
        <div className="mt-6 p-4 rounded-lg border">
          {question.answers.find(a => a.text === selectedAnswer)?.is_correct ? (
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