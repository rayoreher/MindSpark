import { Suspense, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
  RotateCcw, 
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { OpenQuestionCard } from "./components/OpenQuestionCard";
import { MultipleChoiceCard } from "./components/MultipleChoiceCard";
import { FillInTheBlankCard } from "./components/FillInTheBlankCard";
import { FlashcardCard } from "./components/FlashcardCard";
import { MicroReelCard } from "./components/MicroReelCard";
import {
  Accordion,
  AccordionItem,
} from "../../components/ui/Accordion/Accordion";
import { MarkdownRenderer } from "../../components/ui/MarkdownRenderer/MarkdownRenderer";
import { useQuestionById } from "../../queries/getQuestionById";
import { SupabaseQuiz } from "../../types/supabaseQuestion";
import { Loading } from "../../components/Loading/Loading";

type QuestionItem = {
  id: string;
  type:
    | "open"
    | "multiple_choice"
    | "fill_in_blank"
    | "flashcard"
    | "micro_reel";
  data: any;
  instanceKey: string;
};

export const Quiz = () => {
  const { questionId, id: bucketId } = useParams<{ questionId: string; id: string }>();
  const navigate = useNavigate();

  if (!questionId || !bucketId) {
    throw new Error("Missing questionId or id parameter");
  }

  const { data: question } = useQuestionById(questionId);

  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Quiz state tracking - independent from component states
  const [quizStates, setQuizStates] = useState<Record<string, any>>({});
  const [quizProgress, setQuizProgress] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    timeSpent: 0,
  });

  const prepareQuestions = (data: SupabaseQuiz) => {
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
    prepareQuestions(question.data.quiz);
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
    if (question) {
      prepareQuestions(question.data.quiz); // Re-shuffle questions with new instance keys
    }
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

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate(`/buckets/${bucketId}`)}
            >
              Back to Bucket Details
            </Button>
          </div>

          {!quizStarted ? (
            /* Quiz Start Screen */
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {question.name}
                </h1>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
                <Accordion defaultOpenItems={[0]} allowMultiple>
                  <AccordionItem
                    title="Question"
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    <MarkdownRenderer content={question.question} />
                  </AccordionItem>

                  <AccordionItem
                    title="Answer"
                    icon={<HelpCircle className="w-4 h-4" />}
                  >
                    <MarkdownRenderer content={question.answer} />
                  </AccordionItem>

                  <AccordionItem
                    title="Tips & Best Practices"
                    icon={<Lightbulb className="w-4 h-4" />}
                  >
                    <MarkdownRenderer content={question.data.tips.map(item => `- ${item}`).join('\n')} />
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Quiz Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Quiz Overview
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {question.info.open_questions}
                    </div>
                    <div className="text-sm text-gray-600">Open Questions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-600 mb-1">
                      {question.info.multiple_choice_questions}
                    </div>
                    <div className="text-sm text-gray-600">Multiple Choice</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600 mb-1">
                      {question.info.fill_in_the_blank}
                    </div>
                    <div className="text-sm text-gray-600">Fill in Blank</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-success-600 mb-1">
                      {question.info.flashcards}
                    </div>
                    <div className="text-sm text-gray-600">Flashcards</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-error-600 mb-1">
                      {question.info.micro_reels}
                    </div>
                    <div className="text-sm text-gray-600">Micro Reels</div>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                    <div className="text-2xl font-bold text-primary-700 mb-1">
                      {question.info.total}
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
    </Suspense>  
  );
};
