import z from "zod";

const bucketSchema = z.object({
  name: z.string().min(5, 'Bucket name must be at least 5 characters'),
  subject: z.string().min(1, 'Subject is required'),
  visibility: z.enum(['public', 'private'], {
    required_error: 'Visibility is required'
  }),
  experience_level: z.enum(['none', 'basic', 'intermediate', 'advanced'], {
    required_error: 'Experience level is required'
  }),
  progressive_difficulty: z.boolean().optional(),
  key_concepts: z.string().optional(),
  learning_goal: z.string().optional(),
  character: z.string().optional()
});

type BucketData = z.infer<typeof bucketSchema>;

export { bucketSchema };
export type { BucketData };