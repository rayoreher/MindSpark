import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'image';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'text'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    card: 'h-48',
    circle: 'rounded-full w-12 h-12',
    image: 'h-32'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};