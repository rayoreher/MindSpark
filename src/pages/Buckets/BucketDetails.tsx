import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";
import {
  FolderOpen,
  ArrowLeft,
  Plus,
  Search,
  Calendar,
  Lock,
  Globe,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LoadingSkeleton } from "../../components/common/LoadingSkeleton";
import { supabase } from "../../lib/supabase";
import QuestionCard from "../../components/ui/QuestionCard/QuestionCard";
import { SupabaseBucket } from "../../types/supabaseBucket";


export const BucketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bucket, setBucket] = useState<SupabaseBucket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) {
      fetchBucketAndQuestions();
    }
  }, [id]);

  const fetchBucketAndQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch bucket details
      const { data, error } = await supabase
        .from("buckets")
        .select(
          `
        name,
        subject,
        level,
        training_type,
        visibility,
        created_at,
        questions(
          id,
          name,
          info,
          question,
          answer
        )
      `
        )
        .eq("id", id)
        .order("created_at", { referencedTable: "questions", ascending: true })
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        console.log(data);
        setBucket(data as unknown as SupabaseBucket);
      }
    } catch (err) {
      console.error("Error fetching bucket and questions:", err);
      setError(
        (err as { message: string }).message || "Failed to load bucket details"
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleQuestionClick = (questionId: string) => {
    navigate(`/buckets/${id}/questions/${questionId}`);
  };

  const handleAddQuestion = () => {
    // TODO: Navigate to add question to bucket
    console.log("Add question to bucket:", id);
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
      case "junior":
        return "bg-success-100 text-success-700 border-success-200";
      case "mid":
        return "bg-accent-100 text-accent-700 border-accent-200";
      case "mid senior":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "senior":
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTrainingTypeColor = (type: string) => {
    return type === "interview"
      ? "bg-accent-100 text-accent-700 border-accent-200"
      : "bg-secondary-100 text-secondary-700 border-secondary-200";
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <LoadingSkeleton className="w-32 h-10" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <LoadingSkeleton className="w-full h-32" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <LoadingSkeleton className="w-full h-16" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                  >
                    <LoadingSkeleton className="w-full h-48" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !bucket) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => navigate("/buckets")}
              >
                Back to Buckets
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-2xl flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-error-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Bucket not found"}
                </h3>
                <p className="text-gray-600 mb-6">
                  Unable to load the requested bucket.
                </p>
                <Button onClick={() => navigate("/buckets")}>
                  Back to Buckets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate("/buckets")}
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
                    {bucket.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Subject Tag */}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                      📚 {bucket.subject}
                    </span>

                    {/* Level Tag */}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(
                        bucket.level
                      )}`}
                    >
                      🎯 {bucket.level}
                    </span>

                    {/* Training Type Tag */}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getTrainingTypeColor(
                        bucket.training_type
                      )}`}
                    >
                      {bucket.training_type === "interview" ? "💼" : "📖"}{" "}
                      {bucket.training_type.charAt(0).toUpperCase() +
                        bucket.training_type.slice(1)}
                    </span>

                    {/* Visibility */}
                    <div className="flex items-center text-sm text-gray-500">
                      {bucket.visibility === "private" ? (
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
                      Created {formatDate(bucket.created_at)}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {bucket?.questions?.length}{" "}
                      {bucket?.questions?.length === 1
                        ? "Question Set"
                        : "Question Sets"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" icon={Edit}>
                  Edit Bucket
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50 border-error-300"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex items-center space-x-4">
                {/* Add Question Button */}
                <Button
                  icon={Plus}
                  onClick={() => navigate(`/buckets/${id}/upload`)}
                  className="whitespace-nowrap"
                >
                  Add Question
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {bucket?.questions?.length} of{" "}
                {bucket?.questions?.length} question sets
                {searchTerm && (
                  <span className="ml-1">
                    for "
                    <span className="font-medium text-gray-900">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Questions List */}
          {bucket?.questions?.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm
                  ? "No questions found"
                  : "No questions in this bucket"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Start building your question collection by adding your first question set."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddQuestion} icon={Plus} size="lg">
                  Add First Question Set
                </Button>
              )}
            </div>
          ) : (
            /* Questions Display */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bucket?.questions?.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  handleQuestionSetClick={handleQuestionClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
