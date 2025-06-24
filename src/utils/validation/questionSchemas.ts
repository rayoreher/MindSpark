import { z } from 'zod';
import { SupabaseData } from '../../types/supabaseQuestion';

// Answer schema for multiple choice and fill-in-the-blank questions
const AnswerSchema = z.object({
  text: z.string(),
  is_correct: z.boolean(),
});

// Open-ended question schema
const OpenQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

// Multiple choice question schema
const MultipleChoiceQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answers: z.array(AnswerSchema).min(4), // Must have at least 4 answers
});

// Fill-in-the-blank question schema
const FillInTheBlankQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answers: z.array(AnswerSchema).min(4), // Must have at least 4 answers
});

// Flashcard schema
const FlashcardSchema = z.object({
  id: z.string(),
  front: z.string(),
  back: z.string(),
});

// Micro reel schema
const MicroReelSchema = z.object({
  id: z.string(),
  text: z.string(),
});

// Quiz schema containing all question types
const QuizSchema = z.object({
  open_questions: z.array(OpenQuestionSchema).min(1),
  multiple_choice_questions: z.array(MultipleChoiceQuestionSchema).min(1),
  fill_in_the_blank: z.array(FillInTheBlankQuestionSchema).min(1),
  flashcards: z.array(FlashcardSchema).min(1),
  micro_reels: z.array(MicroReelSchema).min(1),
});

// Main learning content schema
export const LearningContentSchema = z.object({
  success: z.boolean(),
  title: z.string(),
  question: z.string(),
  answer: z.string(),
  tips: z.array(z.string()).min(1),
  correctness_percent: z.number(),
  quiz: QuizSchema,
});

// Type inference for TypeScript
//export type LearningContent = z.infer<typeof LearningContentSchema>;

// Example usage:
// const validatedData = LearningContentSchema.parse(jsonData);

// For safer parsing with error handling:
// const result = LearningContentSchema.safeParse(jsonData);
// if (result.success) {
//   console.log('Valid data:', result.data);
// } else {
//   console.error('Validation errors:', result.error.issues);
// }
export type QuestionsValidationResult = {
  isValid: boolean;
  errors: string[];
  data?: SupabaseData;
};