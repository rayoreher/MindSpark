import { startTransition, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  ArrowLeft,
  Plus,
  Calendar,
  Lock,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import QuestionCard from "../../../components/ui/QuestionCard/QuestionCard";
import { useBucketById } from "../../../queries/getBucketById";
import { Loading } from "../../../components/Loading/Loading";
import { CopyPromptButton } from "./components/CopyPromptButton";
import { CopyNextButton } from "./components/CopyNextButton";
import { CopyAnswerButton } from "./components/CopyAnswerButton";
import { CopyHelpButton } from "./components/CopyHelpButton";
import { CopyAutoAnswerButton } from "./components/CopyAutoAnswerButton";

export const BucketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    throw new Error("Missing id parameter");
  }

  const { data } = useBucketById(id);

  const handleQuestionClick = (questionId: string) => {
    console.log(`Navigating to question ${questionId} in bucket ${id}`);

    navigate(`/buckets/${id}/questions/${questionId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level: string) => {
    if (level.includes("year")) {
      return "bg-primary-100 text-primary-700 border-primary-200";
    }
    switch (level) {
      case "none":
        return "bg-success-100 text-success-700 border-success-200";
      case "basic":
        return "bg-accent-100 text-accent-700 border-accent-200";
      case "intermediate":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "advanced":
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  function handleQuestionAdd(): void {
    startTransition(() => {
      navigate(`/buckets/${id}/upload`);
    });
  }

  function handleNavigateTo(): void {
    startTransition(() => {
      navigate("/buckets");
    });
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={handleNavigateTo}
            >
              Back to Buckets
            </Button>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {data.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Subject Tag */}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                      📚 {data.prompt_settings.subject}
                    </span>

                    {/* Level Tag */}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(
                        data.prompt_settings.experience_level
                      )}`}
                    >
                      🎯 {data.prompt_settings.experience_level}
                    </span>

                    {/* Visibility */}
                    <div className="flex items-center text-sm text-gray-500">
                      {data.visibility === "private" ? (
                        <>
                          <Lock className="w-4 h-4 mr-1" /> Private
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-1" /> Public
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {formatDate(data.created_at)}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {data.questions?.length}{" "}
                      {data.questions?.length === 1 ? "Question" : "Questions"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CopyPromptButton
                  settings={data.prompt_settings}
                />
                <CopyNextButton/>
                <CopyAnswerButton/>
                <CopyHelpButton/>
                <CopyAutoAnswerButton/>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-end">
              <div className="flex items-center space-x-4">
                <Button
                  icon={Plus}
                  onClick={handleQuestionAdd}
                  className="whitespace-nowrap"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </div>
          {/* Questions List */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.questions?.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handleQuestionClick={handleQuestionClick}
              />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};
