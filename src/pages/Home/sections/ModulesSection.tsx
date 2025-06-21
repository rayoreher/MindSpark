import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMockContent } from '../../../hooks/useMockContent';
import { ModuleCard } from '../components/ModuleCard';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton';
import { Button } from '../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

export const ModulesSection: React.FC = () => {
  const { t } = useTranslation();
  const { modules, isLoading, error, refetch } = useMockContent();

  const handleStartModule = (moduleId: string) => {
    // This will be implemented later when we add routing to individual modules
    console.log('Starting module:', moduleId);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('home.modules.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('home.modules.subtitle')}
          </p>
        </div>

        {error && (
          <div className="text-center mb-8">
            <p className="text-error-600 mb-4">{error}</p>
            <Button onClick={refetch} icon={RefreshCw} variant="outline">
              {t('common.retry')}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <LoadingSkeleton variant="image" className="w-full" />
                <div className="p-6 space-y-4">
                  <LoadingSkeleton className="w-24" />
                  <LoadingSkeleton className="w-full" />
                  <LoadingSkeleton className="w-full" />
                  <LoadingSkeleton className="w-3/4" />
                  <div className="flex gap-2">
                    <LoadingSkeleton className="w-16 h-6" />
                    <LoadingSkeleton className="w-20 h-6" />
                    <LoadingSkeleton className="w-12 h-6" />
                  </div>
                  <LoadingSkeleton className="w-full h-10" />
                </div>
              </div>
            ))}
          </div>
        ) : modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStartModule={handleStartModule}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No modules available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};