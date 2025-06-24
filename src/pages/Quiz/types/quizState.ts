export interface QuizState {
    currentQuestionIndex: number;
    selectedAnswer: string | null;
    isSubmitted: boolean;
}