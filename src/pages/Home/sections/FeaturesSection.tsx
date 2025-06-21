import React from 'react';
import { BookOpen, Brain, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: t('home.features.focusedReading.title'),
      description: t('home.features.focusedReading.description'),
      color: 'primary'
    },
    {
      icon: Brain,
      title: t('home.features.interactiveQuizzes.title'),
      description: t('home.features.interactiveQuizzes.description'),
      color: 'secondary'
    },
    {
      icon: Zap,
      title: t('home.features.smartFlashcards.title'),
      description: t('home.features.smartFlashcards.description'),
      color: 'accent'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600'
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};