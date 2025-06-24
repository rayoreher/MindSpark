import { supabase } from "../lib/supabase";
import { useMutation } from '@tanstack/react-query'
import { SupabaseQuestionCreate } from "../types/supabaseQuestion";
const insertQuestion = async (bucket: SupabaseQuestionCreate) => {
    const { error } = await supabase
        .from('questions')
        .insert<SupabaseQuestionCreate>(bucket);

    if (error) {
        throw error;
    }
};

export function useCreateQuestion() {
    return useMutation({
        mutationFn: (bucket: SupabaseQuestionCreate) => insertQuestion(bucket),
    })
}