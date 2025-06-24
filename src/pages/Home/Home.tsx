import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { ModulesSection } from "./sections/ModulesSection";

export const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ModulesSection />
    </>
  );
};
