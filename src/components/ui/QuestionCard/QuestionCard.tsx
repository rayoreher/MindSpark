import { Brain, Play } from "lucide-react";
import { Button } from "../Button";
import { formatDateShort } from "../../../utils/formatDate";
import { SupabaseQuestion, SupabaseQuestionInfo } from "../../../types/supabaseQuestion";

const calculateTotal = (info: SupabaseQuestionInfo) => {
  return info.open_questions + info.multiple_choice_questions + info.fill_in_the_blank + info.flashcards + info.micro_reels;
}

const QuestionCard = ({ question, handleQuestionSetClick }: { question: SupabaseQuestion, handleQuestionSetClick: (id: string) => void }) => {

  return (
    <div
    key={question.id}
    onClick={() => handleQuestionSetClick(question.id)}
    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
          <Brain className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {question.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDateShort(question.created_at)}
          </p>
        </div>
      </div>
    </div>

    {/* Question Counts */}
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Open Questions:</span>
          <span className="font-medium text-gray-900">{question.info.open_questions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Multiple Choice:</span>
          <span className="font-medium text-gray-900">{question.info.multiple_choice_questions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fill in Blank:</span>
          <span className="font-medium text-gray-900">{question.info.fill_in_the_blank}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Flashcards:</span>
          <span className="font-medium text-gray-900">{question.info.flashcards}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Micro Reels:</span>
          <span className="font-medium text-gray-900">{question.info.micro_reels}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-gray-100">
          <span className="text-gray-900 font-medium">Total:</span>
          <span className="font-bold text-primary-600">{calculateTotal(question.info)}</span>
        </div>
      </div>
    </div>

    {/* Action Button */}
    <Button
      className="w-full group-hover:bg-primary-700 transition-colors"
      icon={Play}
      onClick={(e) => {
        e.stopPropagation();
        handleQuestionSetClick(question.id);
      }}
    >
      Start Quiz
    </Button>
  </div>
  );
};

export default QuestionCard;