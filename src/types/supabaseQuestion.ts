interface SupabaseQuestion {
    id: string;
    name: string;
    question: string;
    answer: string;
    info: SupabaseQuestionInfo;
    data: SupabaseData;
    created_at: string;
}

interface SupabaseQuestionCreate {
    name: string;
    question: string;
    answer: string;
    info: SupabaseQuestionInfo;
    data: SupabaseData;
    bucket_id: string;
}

interface SupabaseQuestionInfo {
    open_questions: number;
    multiple_choice_questions: number;
    fill_in_the_blank: number;
    flashcards: number;
    micro_reels: number;
    total: number;
}

interface SupabaseData {
  success: boolean
  title: string
  question: string
  answer: string
  tips: string[]
  correctness_percent: number
  quiz: SupabaseQuiz
}

interface SupabaseQuiz {
  open_questions: OpenQuestion[]
  multiple_choice_questions: MultipleChoiceQuestion[]
  fill_in_the_blank: FillInTheBlank[]
  flashcards: Flashcard[]
  micro_reels: MicroReel[]
}

interface OpenQuestion {
  id: string
  question: string
  answer: string
}

interface MultipleChoiceQuestion {
  id: string
  question: string
  answers: Answer[]
}

interface Answer {
  text: string
  is_correct: boolean
}

interface FillInTheBlank {
  id: string
  question: string
  answers: Answer[]
}

interface Flashcard {
  id: string
  front: string
  back: string
}

interface MicroReel {
  id: string
  text: string
}


export type { SupabaseQuestion, SupabaseQuestionInfo, SupabaseData, SupabaseQuiz, SupabaseQuestionCreate };