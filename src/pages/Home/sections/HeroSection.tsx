import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useTranslation } from 'react-i18next';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-200">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                AI-Powered Learning
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('home.hero.title')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="text-lg px-8 py-4"
            >
              {t('home.hero.cta')}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">10K+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">500+</div>
              <div className="text-gray-600">Learning Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};