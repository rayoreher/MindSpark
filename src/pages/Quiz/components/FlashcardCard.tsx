import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Flashcard } from '../../../types/questions';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onStateChange?: (flashcardId: string, state: any) => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({ 
  flashcard, 
  onStateChange 
}) => {
  // Each component instance has its own independent state
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Reset state when flashcard changes (new flashcard instance)
  useEffect(() => {
    setIsFlipped(false);
    setIsAnimating(false);
    setViewCount(0);
  }, [flashcard.id]);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    
    // Increment view count when flipping to back (answer)
    if (newFlippedState) {
      const newViewCount = viewCount + 1;
      setViewCount(newViewCount);
      onStateChange?.(flashcard.id, {
        isFlipped: newFlippedState,
        viewCount: newViewCount,
        hasSeenAnswer: true
      });
    } else {
      onStateChange?.(flashcard.id, {
        isFlipped: newFlippedState,
        viewCount,
        hasSeenAnswer: viewCount > 0
      });
    }
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-gray-700">
            Flashcard
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <RotateCcw className="w-4 h-4 mr-1" />
            Click to flip
            {viewCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                Viewed {viewCount}x
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative h-80 perspective-1000">
        <div
          onClick={handleFlip}
          className={`relative w-full h-full cursor-pointer transition-transform duration-300 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          } ${isAnimating ? 'pointer-events-none' : ''}`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl flex items-center justify-center p-8 shadow-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-primary-600 mb-4 uppercase tracking-wide">
                  Question
                </div>
                <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {flashcard.front}
                </p>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 rounded-xl flex items-center justify-center p-8 shadow-lg">
              <div className="text-center">
                <div className="text-sm font-medium text-secondary-600 mb-4 uppercase tracking-wide">
                  Answer
                </div>
                <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {flashcard.back}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {isFlipped 
            ? "Click the card again to see the question" 
            : "Click the card to reveal the answer"
          }
        </p>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};