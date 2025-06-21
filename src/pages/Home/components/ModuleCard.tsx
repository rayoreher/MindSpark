import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import { LearningModule } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { useTranslation } from 'react-i18next';

interface ModuleCardProps {
  module: LearningModule;
  onStartModule?: (moduleId: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  onStartModule 
}) => {
  const { t } = useTranslation();

  const difficultyColors = {
    beginner: 'bg-success-100 text-success-800',
    intermediate: 'bg-accent-100 text-accent-800',
    advanced: 'bg-error-100 text-error-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {module.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={module.imageUrl}
            alt={module.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[module.difficulty]}`}>
            {t(`home.modules.difficulty`)}: {module.difficulty}
          </span>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {module.duration} min
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {module.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {module.description}
        </p>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t('home.modules.topics')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {module.topics.slice(0, 3).map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {topic}
              </span>
            ))}
            {module.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{module.topics.length - 3} more
              </span>
            )}
          </div>
        </div>

        {module.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={() => onStartModule?.(module.id)}
          className="w-full"
          icon={BookOpen}
        >
          {module.progress > 0 ? 'Continue Module' : t('home.modules.startModule')}
        </Button>
      </div>
    </div>
  );
};