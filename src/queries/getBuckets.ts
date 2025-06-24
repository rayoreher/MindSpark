import { supabase } from "../lib/supabase";
import { BucketSummary, SupabaseBucketSummary } from "../types/supabaseBucket";
import { useSuspenseQuery } from '@tanstack/react-query'
const fetchBuckets = async () => {
    const { data, error } = await supabase
        .from('buckets')
        .select(`
          id,
          name,
          visibility,
          prompt_settings,
          question_number:questions(count)
        `)
        .order('name', { ascending: true })
        .overrideTypes<SupabaseBucketSummary[]>();

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error('No buckets found');
    }

    return data.map(bucket => ({
        ...bucket,
        question_number: bucket.question_number[0]?.count || 0
    })) as BucketSummary[];
};

export function useBuckets() {
    return useSuspenseQuery({
        queryKey: ['buckets'],
        queryFn: () => fetchBuckets(),
    })
}