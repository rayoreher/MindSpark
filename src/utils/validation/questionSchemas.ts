import { z } from 'zod';

const AnswerSchema = z.object({
  text: z.string().min(1, 'Answer text is required'),
  is_correct: z.boolean()
});

const OpenQuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  question: z.string().min(1, 'Question text is required'),
  answer: z.string().min(1, 'Answer is required')
});

const MultipleChoiceQuestionSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  question: z.string().min(1, 'Question text is required'),
  answers: z.array(AnswerSchema).min(1, 'At least one answer is required')
});

const FillInTheBlankSchema = z.object({
  id: z.string().min(1, 'Question ID is required'),
  question: z.string().min(1, 'Question text is required'),
  answers: z.array(AnswerSchema).min(1, 'At least one answer is required')
});

const FlashcardSchema = z.object({
  id: z.string().min(1, 'Flashcard ID is required'),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required')
});

const MicroReelSchema = z.object({
  id: z.string().min(1, 'Micro reel ID is required'),
  text: z.string().min(1, 'Text is required')
});

// Base schema with optional ID
const BaseQuestionsSchema = z.object({
  id: z.string().min(1, 'Questions set ID is required').optional(),
  open_questions: z.array(OpenQuestionSchema),
  multiple_choice_questions: z.array(MultipleChoiceQuestionSchema),
  fill_in_the_blank: z.array(FillInTheBlankSchema),
  flashcards: z.array(FlashcardSchema),
  micro_reels: z.array(MicroReelSchema)
});

// Transform schema that generates UUID if ID is missing
export const QuestionsSchema = BaseQuestionsSchema.transform((data) => {
  if (!data.id) {
    // Generate a UUID v4
    data.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  return data;
});

export type QuestionsValidationResult = {
  isValid: boolean;
  errors: string[];
  data?: any;
};