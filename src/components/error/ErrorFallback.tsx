import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-error-500">
          <AlertTriangle className="w-full h-full" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('common.error')}
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something went wrong. Please try again or return to the homepage.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm text-gray-700 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {resetErrorBoundary && (
            <Button
              onClick={resetErrorBoundary}
              icon={RefreshCw}
              className="flex-1"
            >
              {t('common.retry')}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            icon={Home}
            className="flex-1"
          >
            {t('common.goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};