import { LearningModule, ApiResponse } from '../types';

const mockModules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to Critical Thinking',
    description: 'Master the fundamentals of logical reasoning and analytical thinking to make better decisions in your personal and professional life.',
    difficulty: 'beginner',
    duration: 45,
    topics: ['Logic', 'Reasoning', 'Problem Solving', 'Decision Making'],
    progress: 0,
    imageUrl: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Effective Memory Techniques',
    description: 'Learn proven memory enhancement strategies used by memory champions to improve retention and recall.',
    difficulty: 'intermediate',
    duration: 60,
    topics: ['Memory Palace', 'Mnemonics', 'Spaced Repetition', 'Active Recall'],
    progress: 35,
    imageUrl: 'https://images.pexels.com/photos/207665/pexels-photo-207665.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Advanced Learning Strategies',
    description: 'Discover sophisticated techniques for accelerated learning and knowledge acquisition in complex subjects.',
    difficulty: 'advanced',
    duration: 90,
    topics: ['Meta-learning', 'Transfer Learning', 'Cognitive Load', 'Expertise Development'],
    progress: 12,
    imageUrl: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Speed Reading Mastery',
    description: 'Double or triple your reading speed while maintaining comprehension through proven techniques.',
    difficulty: 'intermediate',
    duration: 75,
    topics: ['Eye Movement', 'Chunking', 'Skimming', 'Comprehension'],
    progress: 0,
    imageUrl: 'https://images.pexels.com/photos/1496189/pexels-photo-1496189.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockContentService = {
  async getFeaturedModules(): Promise<ApiResponse<LearningModule[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: mockModules,
      success: true,
      message: 'Featured modules retrieved successfully'
    };
  },

  async getModuleById(id: string): Promise<ApiResponse<LearningModule | null>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const module = mockModules.find(m => m.id === id);
    return {
      data: module || null,
      success: !!module,
      message: module ? 'Module found' : 'Module not found'
    };
  }
};