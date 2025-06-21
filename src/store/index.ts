import { create } from 'zustand';
import { LearningModule, User } from '../types';

interface AppState {
  user: User | null;
  modules: LearningModule[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setModules: (modules: LearningModule[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  modules: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  setModules: (modules) => set({ modules }),
  setLoading: (isLoading) => set({ isLoading }),
}));