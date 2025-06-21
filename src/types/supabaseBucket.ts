import { SupabaseQuestion } from "./supabaseQuestion";

interface SupabaseBucket {
    id: string;
    name: string;
    subject: string;
    level: string;
    training_type: "interview" | "study";
    visibility: "private" | "public";
    created_at: string;
    questions: SupabaseQuestion[];
  }

  export type { SupabaseBucket };