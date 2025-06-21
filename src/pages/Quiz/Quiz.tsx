import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";
import {
  Brain,
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";
import { OpenQuestionCard } from "./components/OpenQuestionCard";
import { MultipleChoiceCard } from "./components/MultipleChoiceCard";
import { FillInTheBlankCard } from "./components/FillInTheBlankCard";
import { FlashcardCard } from "./components/FlashcardCard";
import { MicroReelCard } from "./components/MicroReelCard";

interface QuestionInfo {
  open_questions: number;
  multiple_choice_questions: number;
  fill_in_the_blank: number;
  flashcards: number;
  micro_reels: number;
}

interface QuestionSet {
  id: string;
  name: string;
  data: any;
  info: QuestionInfo;
  question: string;
  answer: string;
  created_at: string;
}

type QuestionItem = {
  id: string;
  type:
    | "open"
    | "multiple_choice"
    | "fill_in_blank"
    | "flashcard"
    | "micro_reel";
  data: any;
  // Add a unique key to ensure each question instance is truly independent
  instanceKey: string;
};

export const Quiz: React.FC = () => {
  const { questionId, id } = useParams();
  const navigate = useNavigate();
  console.log(questionId, id);

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false);

  // Quiz state tracking - independent from component states
  const [quizStates, setQuizStates] = useState<Record<string, any>>({});
  const [quizProgress, setQuizProgress] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    if (questionId) {
      fetchQuestionSet();
    }
  }, [questionId]);

  const fetchQuestionSet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("questions")
        .select("id, name, data, info, question, answer, created_at")
        .eq("id", questionId)
        .single();
      console.log(data);
      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Question set not found");
      }

      setQuestionSet(data);
      prepareQuestions(data.data);
    } catch (err: any) {
      console.error("Error fetching question set:", err);
      setError(err.message || "Failed to load question set");
    } finally {
      setIsLoading(false);
    }
  };

  const prepareQuestions = (data: QuestionsType) => {
    const allQuestions: QuestionItem[] = [];

    // Add open questions
    data.open_questions?.forEach((q) => {
      allQuestions.push({
        id: q.id,
        type: "open",
        data: q,
        instanceKey: `open-${q.id}-${Date.now()}-${Math.random()}`,
      });
    });

    // Add multiple choice questions
    data.multiple_choice_questions?.forEach((q) => {
      allQuestions.push({
        id: q.id,
        type: "multiple_choice",
        data: q,
        instanceKey: `mc-${q.id}-${Date.now()}-${Math.random()}`,
      });
    });

    // Add fill in the blank questions
    data.fill_in_the_blank?.forEach((q) => {
      allQuestions.push({
        id: q.id,
        type: "fill_in_blank",
        data: q,
        instanceKey: `fib-${q.id}-${Date.now()}-${Math.random()}`,
      });
    });

    // Add flashcards
    data.flashcards?.forEach((q) => {
      allQuestions.push({
        id: q.id,
        type: "flashcard",
        data: q,
        instanceKey: `fc-${q.id}-${Date.now()}-${Math.random()}`,
      });
    });

    // Add micro reels
    data.micro_reels?.forEach((q) => {
      allQuestions.push({
        id: q.id,
        type: "micro_reel",
        data: q,
        instanceKey: `mr-${q.id}-${Date.now()}-${Math.random()}`,
      });
    });

    // Shuffle questions randomly
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);

    // Initialize quiz progress
    setQuizProgress((prev) => ({
      ...prev,
      totalQuestions: shuffled.length,
    }));
  };

  const handleQuestionStateChange = (questionId: string, state: any) => {
    setQuizStates((prev) => ({
      ...prev,
      [questionId]: state,
    }));

    // Update quiz progress based on state changes
    updateQuizProgress(questionId, state);
  };

  const updateQuizProgress = (questionId: string, state: any) => {
    setQuizProgress((prev) => {
      const newProgress = { ...prev };

      // Count answered questions
      const allStates = { ...quizStates, [questionId]: state };
      const answeredCount = Object.values(allStates).filter(
        (s) => s.isSubmitted || s.hasSeenAnswer || s.hasBeenRead
      ).length;

      // Count correct answers
      const correctCount = Object.values(allStates).filter(
        (s) => s.isCorrect === true || s.isMarkedCorrect === true
      ).length;

      newProgress.answeredQuestions = answeredCount;
      newProgress.correctAnswers = correctCount;

      return newProgress;
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setQuizStates({});
    setQuizProgress((prev) => ({
      ...prev,
      answeredQuestions: 0,
      correctAnswers: 0,
      timeSpent: 0,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setQuizStates({});
    setQuizProgress((prev) => ({
      ...prev,
      answeredQuestions: 0,
      correctAnswers: 0,
      timeSpent: 0,
    }));
    if (questionSet) {
      prepareQuestions(questionSet.data); // Re-shuffle questions with new instance keys
    }
  };

  const getQuestionCounts = (questionSet: QuestionSet) => {
    // Use info field if available, otherwise fallback to counting from data
    if (questionSet.info) {
      return {
        openQuestions: questionSet.info.open_questions,
        multipleChoice: questionSet.info.multiple_choice_questions,
        fillInTheBlank: questionSet.info.fill_in_the_blank,
        flashcards: questionSet.info.flashcards,
        microReels: questionSet.info.micro_reels,
        total:
          questionSet.info.open_questions +
          questionSet.info.multiple_choice_questions +
          questionSet.info.fill_in_the_blank +
          questionSet.info.flashcards +
          questionSet.info.micro_reels,
      };
    }

    // Fallback to counting from data (for older records without info field)
    const data = questionSet.data;
    return {
      openQuestions: data.open_questions?.length || 0,
      multipleChoice: data.multiple_choice_questions?.length || 0,
      fillInTheBlank: data.fill_in_the_blank?.length || 0,
      flashcards: data.flashcards?.length || 0,
      microReels: data.micro_reels?.length || 0,
      total:
        (data.open_questions?.length || 0) +
        (data.multiple_choice_questions?.length || 0) +
        (data.fill_in_the_blank?.length || 0) +
        (data.flashcards?.length || 0) +
        (data.micro_reels?.length || 0),
    };
  };

  const renderCurrentQuestion = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) {
      return null;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Use instanceKey as the key to ensure each component instance is completely independent
    switch (currentQuestion.type) {
      case "open":
        return (
          <OpenQuestionCard
            key={currentQuestion.instanceKey}
            question={currentQuestion.data}
            onStateChange={handleQuestionStateChange}
          />
        );
      case "multiple_choice":
        return (
          <MultipleChoiceCard
            key={currentQuestion.instanceKey}
            question={currentQuestion.data}
            onStateChange={handleQuestionStateChange}
          />
        );
      case "fill_in_blank":
        return (
          <FillInTheBlankCard
            key={currentQuestion.instanceKey}
            question={currentQuestion.data}
            onStateChange={handleQuestionStateChange}
          />
        );
      case "flashcard":
        return (
          <FlashcardCard
            key={currentQuestion.instanceKey}
            flashcard={currentQuestion.data}
            onStateChange={handleQuestionStateChange}
          />
        );
      case "micro_reel":
        return (
          <MicroReelCard
            key={currentQuestion.instanceKey}
            microReel={currentQuestion.data}
            onStateChange={handleQuestionStateChange}
          />
        );
      default:
        return null;
    }
  };

  const renderQuestionAnswerCard = () => {
    if (!questionSet) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {showQuestionAnswer ? "Answer" : "Question"}
          </h2>
          <Button
            variant="outline"
            size="sm"
            icon={RotateCw}
            onClick={() => setShowQuestionAnswer(!showQuestionAnswer)}
          >
            {showQuestionAnswer ? "Show Question" : "Show Answer"}
          </Button>
        </div>

        <div className="relative h-64 perspective-1000">
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              showQuestionAnswer ? "rotate-y-180" : ""
            }`}
          >
            {/* Question Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl flex items-center justify-center py-4 px-6 shadow-lg">
                <div className="max-h-50 overflow-y-auto custom-scrollbar">
                  <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {questionSet.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 rounded-xl flex items-center justify-center py-4 px-6 shadow-lg">
                  <div className="max-h-32 overflow-y-auto custom-scrollbar">
                    <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {questionSet.answer}
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(243, 244, 246, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.7);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.8);
          }
        `}</style>
      </div>
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <LoadingSkeleton className="w-32 h-10" />
              <div className="text-center space-y-4">
                <LoadingSkeleton variant="circle" className="mx-auto" />
                <LoadingSkeleton className="w-64 h-8 mx-auto" />
                <LoadingSkeleton className="w-96 h-4 mx-auto" />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <LoadingSkeleton className="w-full h-64" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !questionSet) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => navigate(`/buckets/${id}`)}
              >
                Back to Bucket Details
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-error-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Question set not found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  Unable to load the requested question set.
                </p>
                <Button onClick={() => navigate(`/buckets/${id}`)}>
                  Back to Bucket Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const counts = getQuestionCounts(questionSet);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate(`/buckets/${id}`)}
            >
              Back to Bucket Details
            </Button>
          </div>

          {!quizStarted ? (
            /* Quiz Start Screen */
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {questionSet.name}
                </h1>
              </div>

              {/* Question & Answer Card */}
              {renderQuestionAnswerCard()}

              {/* Quiz Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Quiz Overview
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {counts.openQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Open Questions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {counts.multipleChoice}
                    </div>
                    <div className="text-sm text-gray-600">Multiple Choice</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600 mb-1">
                      {counts.fillInTheBlank}
                    </div>
                    <div className="text-sm text-gray-600">Fill in Blank</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-success-600 mb-1">
                      {counts.flashcards}
                    </div>
                    <div className="text-sm text-gray-600">Flashcards</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-error-600 mb-1">
                      {counts.microReels}
                    </div>
                    <div className="text-sm text-gray-600">Micro Reels</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                    <div className="text-2xl font-bold text-primary-700 mb-1">
                      {counts.total}
                    </div>
                    <div className="text-sm text-primary-600 font-medium">
                      Total Questions
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    icon={Play}
                    onClick={startQuiz}
                    className="px-8 py-4 text-lg"
                  >
                    Start Quiz
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Questions will be presented in random order with independent
                    states
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Quiz Interface */
            <>
              {/* Quiz Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {questions[currentQuestionIndex]?.type
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Progress: {quizProgress.answeredQuestions}/
                      {quizProgress.totalQuestions}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={RotateCcw}
                      onClick={restartQuiz}
                    >
                      Restart
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="mb-8">{renderCurrentQuestion()}</div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  icon={ChevronLeft}
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <div className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>

                <Button
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
