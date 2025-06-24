import { supabase } from "../lib/supabase";
import { SuabaseBucketCreate } from "../types/supabaseBucket";
import { useMutation } from '@tanstack/react-query'
const insertBucket = async (bucket: SuabaseBucketCreate) => {
    const { error } = await supabase
        .from('buckets')
        .insert<SuabaseBucketCreate>(bucket);

    if (error) {
        throw error;
    }
};

export function useCreateBucket() {
    return useMutation({
        mutationFn: (bucket: SuabaseBucketCreate) => insertBucket(bucket),
    })
}