interface SupabaseQuestion {
    id: string;
    name: string;
    info: SupabaseQuestionInfo;
    question: string;
    answer: string;
    created_at: string;
}

interface SupabaseQuestionInfo {
    open_questions: number;
    multiple_choice_questions: number;
    fill_in_the_blank: number;
    flashcards: number;
    micro_reels: number;
}
export type { SupabaseQuestion, SupabaseQuestionInfo };