import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { UploadCloud as CloudUpload, Type, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { JsonUpload } from "./components/JsonUpload";
import {
  SupabaseData,
  SupabaseQuestionCreate,
  SupabaseQuestionInfo,
} from "../../types/supabaseQuestion";
import { useCreateQuestion } from "../../queries/createQuestion";

export const Upload = () => {
  const { id: bucketId } = useParams();
  if (!bucketId) {
    throw new Error("Missing id parameter");
  }
  const { mutate, isPending } = useCreateQuestion();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<SupabaseQuestionCreate | null>(null);

  const handleUploadError = (error: string) => {
    console.error(`Upload error: ${error}`);
  };

  const handleJsonReady = (data: SupabaseData) => {
    setQuestion({
      bucket_id: bucketId,
      data: data!,
      name: data?.title || "Untitled",
      question: data?.question || "",
      answer: data?.answer || "",
      info: getQuestionInfo(data),
    });
  };

  const handleUploadToServer = () => {
    if (!question) {
      console.error("No question data to upload");
      return;
    }
    mutate(question, {
      onSuccess: () => {
        navigate(`/buckets/${bucketId}`);
        console.log("Question uploaded successfully");
      },
    });
  };

  const getQuestionInfo = (data: SupabaseData | null): SupabaseQuestionInfo => {
    if (!data || !data.quiz) {
      return {
        open_questions: 0,
        multiple_choice_questions: 0,
        fill_in_the_blank: 0,
        flashcards: 0,
        micro_reels: 0,
        total: 0,
      };
    }
    const info = {
      open_questions: data.quiz.open_questions.length,
      multiple_choice_questions: data.quiz.multiple_choice_questions.length,
      fill_in_the_blank: data.quiz.fill_in_the_blank.length,
      flashcards: data.quiz.flashcards.length,
      micro_reels: data.quiz.micro_reels.length,
    };

    return {
      ...info,
      total:
        info.open_questions +
        info.multiple_choice_questions +
        info.fill_in_the_blank +
        info.flashcards +
        info.micro_reels,
    };
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate(`/buckets/${bucketId}`)}
            >
              Back to Bucket Details
            </Button>
          </div>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload and manage your question sets for interactive learning
            </p>
          </div>
          {/* 4. Upload Button Section */}
          <JsonUpload
            onJsonReady={handleJsonReady}
            onUploadError={handleUploadError}
          />
          {question && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Type className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Question Details
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Title: {question.name}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {(() => {
                      return (
                        <>
                          <span>
                            Open Questions: {question.info.open_questions}
                          </span>
                          <span>
                            Multiple Choice:{" "}
                            {question.info.multiple_choice_questions}
                          </span>
                          <span>
                            Fill in Blank: {question.info.fill_in_the_blank}
                          </span>
                          <span>Flashcards: {question.info.flashcards}</span>
                          <span>Micro Reels: {question.info.micro_reels}</span>
                          <span className="font-medium">
                            Total: {question.info.total}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <Button
                  onClick={handleUploadToServer}
                  disabled={!question || isPending}
                  isLoading={isPending}
                  icon={CloudUpload}
                  size="lg"
                  className="ml-4"
                >
                  {isPending ? "Uploading..." : "Upload Questions"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};