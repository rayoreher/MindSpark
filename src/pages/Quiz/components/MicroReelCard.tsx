import React, { useState, useEffect } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { MicroReel } from '../../../types/questions';

interface MicroReelCardProps {
  microReel: MicroReel;
  onStateChange?: (microReelId: string, state: any) => void;
}

export const MicroReelCard: React.FC<MicroReelCardProps> = ({ 
  microReel, 
  onStateChange 
}) => {
  // Each component instance has its own independent state
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [hasBeenRead, setHasBeenRead] = useState(false);

  // Reset state when micro reel changes (new micro reel instance)
  useEffect(() => {
    setTimeSpent(0);
    setIsActive(true);
    setHasBeenRead(false);
  }, [microReel.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          onStateChange?.(microReel.id, {
            timeSpent: newTime,
            hasBeenRead: newTime >= 5, // Consider "read" after 5 seconds
            isActive: true
          });
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, microReel.id, onStateChange]);

  useEffect(() => {
    if (timeSpent >= 5 && !hasBeenRead) {
      setHasBeenRead(true);
    }
  }, [timeSpent, hasBeenRead]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const handlePause = () => {
    setIsActive(false);
    onStateChange?.(microReel.id, {
      timeSpent,
      hasBeenRead,
      isActive: false
    });
  };

  const handleResume = () => {
    setIsActive(true);
    onStateChange?.(microReel.id, {
      timeSpent,
      hasBeenRead,
      isActive: true
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              Micro Reel
            </h3>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeSpent)}
            </div>
            
            {hasBeenRead && (
              <span className="px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                ✓ Read
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-accent-50 to-cream-50 border border-accent-200 rounded-xl p-8 mb-6">
        <div className="text-center">
          <p className="text-lg leading-relaxed text-gray-800 font-medium">
            {microReel.text}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {isActive ? (
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Reading time active
            </span>
          ) : (
            <span className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              Reading time paused
            </span>
          )}
        </div>
        
        <button
          onClick={isActive ? handlePause : handleResume}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isActive ? 'Pause Timer' : 'Resume Timer'}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Take your time to read and reflect on this content. 
          {!hasBeenRead && " You'll be marked as having read it after 5 seconds."}
        </p>
      </div>
    </div>
  );
};