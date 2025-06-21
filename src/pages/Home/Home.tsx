import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { ModulesSection } from './sections/ModulesSection';

export const Home: React.FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
    </MainLayout>
  );
};