export interface JsonQuestions {
  open_questions: OpenQuestion[];
  multiple_choice_questions: MultipleChoiceQuestion[];
  fill_in_the_blank: FillInTheBlank[];
  flashcards: Flashcard[];
  micro_reels: MicroReel[];
}

export interface OpenQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
  is_correct: boolean;
}

export interface FillInTheBlank {
  id: string;
  question: string;
  answers: Answer[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface MicroReel {
  id: string;
  text: string;
}