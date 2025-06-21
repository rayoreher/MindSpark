import { useState, useEffect } from 'react';
import { mockContentService } from '../services/mockContentService';
import { LearningModule } from '../types';

export const useMockContent = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await mockContentService.getFeaturedModules();
      
      if (response.success) {
        setModules(response.data);
      } else {
        setError('Failed to load modules');
      }
    } catch (err) {
      setError('An error occurred while loading modules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedModules();
  }, []);

  return {
    modules,
    isLoading,
    error,
    refetch: fetchFeaturedModules
  };
};