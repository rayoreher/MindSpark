import { supabase } from "../lib/supabase";
import { useSuspenseQuery } from '@tanstack/react-query'
import { SupabaseBuckerDetails } from "../types/supabaseBucket";
const fetchBucketById = async (bucketId: string) => {
    const { data, error } = await supabase
        .from("buckets")
        .select(
            `
        name,
        visibility,
        created_at,
        prompt_settings,
        questions(
            id,
            name,
            info,
            question,
            answer,
            created_at
        )
      `
        )
        .eq("id", bucketId)
        .order("created_at", { referencedTable: "questions", ascending: true })
        .single<SupabaseBuckerDetails>();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error(`Bucket with ID ${bucketId} not found`);
    }

    return data;
};

export function useBucketById(bucketId: string) {
    return useSuspenseQuery({
        queryKey: ['bucket', bucketId],
        queryFn: () => fetchBucketById(bucketId),
    })
}