import { supabase } from "../lib/supabase";
import { SupabaseQuestion } from "../types/supabaseQuestion";
import { useSuspenseQuery } from '@tanstack/react-query'
const fetchQuestionById = async (questionId: string) => {
    const { data, error } = await supabase
        .from("questions")
        .select("id, name, data, info, question, answer, created_at")
        .eq("id", questionId)
        .single<SupabaseQuestion>();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(`Question with ID ${questionId} not found`);
    }

    return data;
};

export function useQuestionById(questionId: string) {
  return useSuspenseQuery({
    queryKey: ['question', questionId],
    queryFn: () => fetchQuestionById(questionId),
  })
}