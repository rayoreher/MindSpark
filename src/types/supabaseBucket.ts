import { SupabaseQuestionInfo } from "./supabaseQuestion";

type SupabaseVisibility = 'private' | 'public';
interface SupabaseBucketSummary {
  id: string;
  name: string;
  prompt_settings: SupabasePromptSettings;
  visibility: SupabaseVisibility;
  question_number: { count: number }[];
}
interface BucketSummary {
  id: string;
  name: string;
  prompt_settings: SupabasePromptSettings;
  visibility: SupabaseVisibility;
  question_number: number;
}
interface SupabasePromptSettings {
  subject: string;
  experience_level: string;
  progressive_difficulty: boolean;
  key_concepts: string;
  learning_goal: string;
  character: string;
}
interface SuabaseBucketCreate {
  name: string;
  prompt_settings: SupabasePromptSettings;
  visibility: SupabaseVisibility;
}

interface SupabaseBuckerDetails {
  name: string;
  visibility: SupabaseVisibility;
  created_at: string;
  prompt_settings: SupabasePromptSettings;
  questions: {
    id: string;
    name: string;
    info: SupabaseQuestionInfo;
    created_at: string;
  }[];
}
export type { SupabaseBucketSummary, SupabaseVisibility, SupabasePromptSettings, BucketSummary, SuabaseBucketCreate, SupabaseBuckerDetails };