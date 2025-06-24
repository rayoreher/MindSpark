import {
  Globe,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Send,
  Target,
  TrendingUp,
  Lock,
  User,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { BucketData, bucketSchema } from "../validator/formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const visibilityOptions = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can view and use this content",
    icon: Globe,
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can access this content",
    icon: Lock,
  },
];

const experienceLevelOptions: { value: 'none' | 'basic' | 'intermediate' | 'advanced'; label: string; description: string }[] = [
  { 
    value: "none", 
    label: "No Experience", 
    description: "Complete beginner" 
},
  {
    value: "basic",
    label: "Basic",
    description: "Some foundational knowledge",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with fundamentals",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Deep understanding and experience",
  },
];

const defaultValues: BucketData = {
  name: "",
  subject: "",
  visibility: "public",
  experience_level: "none",
  progressive_difficulty: false,
  key_concepts: "",
  learning_goal: "",
  character: "",
};

export const BucketCreateForm = ({
  onSubmit,
}: {
  onSubmit: (data: BucketData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
    reset,
  } = useForm<BucketData>({
    defaultValues: defaultValues,
    resolver: zodResolver(bucketSchema),
  });

  const handleReset = () => {
    reset();
  };

  const watchedVisibility = watch("visibility");
  const watchedExperienceLevel = watch("experience_level");
  const watchedProgressiveDifficulty = watch("progressive_difficulty");
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Bucket Name Field */}
        <div>
          <Input
            {...register("name")}
            label="Bucket Name *"
            placeholder="Enter a descriptive name for your learning bucket"
            error={errors.name?.message}
            helperText="Give your learning bucket a memorable name (minimum 5 characters)"
          />
        </div>

        {/* Subject Field */}
        <div>
          <Input
            {...register("subject")}
            label="Subject to Study *"
            placeholder="e.g., React, .NET, History, Mathematics, etc."
            error={errors.subject?.message}
            helperText="Enter the main subject or topic you want to study"
          />
        </div>

        {/* Visibility Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Globe className="w-4 h-4 text-primary-600" />
            <span>Visibility *</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibilityOptions.map((option) => {
              return (
                <label
                  key={option.value}
                  className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    watchedVisibility === option.value
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("visibility")}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        watchedVisibility === option.value
                          ? "bg-primary-100 text-primary-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-medium ${
                            watchedVisibility === option.value
                              ? "text-primary-700"
                              : "text-gray-900"
                          }`}
                        >
                          {option.label}
                        </span>
                        {watchedVisibility === option.value && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          watchedVisibility === option.value
                            ? "text-primary-600"
                            : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Choose who can access your learning content
          </p>
        </div>

        {/* Experience Level Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <GraduationCap className="w-4 h-4 text-primary-600" />
            <span>Experience Level *</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {experienceLevelOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  watchedExperienceLevel === option.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                    value={option.value}
                  {...register("experience_level", {
                    onChange: (e) => {
                      if (e.target.value === "advanced") {
                        setValue("progressive_difficulty", false);
                      }
                    },
                  })}
                  checked={watchedExperienceLevel === option.value}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        watchedExperienceLevel === option.value
                          ? "text-primary-700"
                          : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </span>
                    {watchedExperienceLevel === option.value && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      watchedExperienceLevel === option.value
                        ? "text-primary-600"
                        : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Select your current level of knowledge in this subject
          </p>
        </div>

        {/* Progressive Difficulty Field */}
        <div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("progressive_difficulty")}
                disabled={watchedExperienceLevel === "advanced"}
                className={`w-4 h-4 rounded border-gray-300 focus:ring-primary-500 focus:ring-2 ${
                  watchedExperienceLevel === "advanced"
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-primary-600 cursor-pointer"
                }`}
              />
            </div>
            <div className="flex-1">
              <label
                className={`flex items-center space-x-2 text-sm font-medium cursor-pointer ${
                  watchedExperienceLevel === "advanced"
                    ? "text-gray-400"
                    : "text-gray-700"
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${
                    watchedExperienceLevel === "advanced"
                      ? "text-gray-400"
                      : "text-primary-600"
                  }`}
                />
                <span>Progressive Difficulty Scaling</span>
              </label>
              <p
                className={`text-sm mt-1 ${
                  watchedExperienceLevel === "advanced"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {watchedExperienceLevel === "advanced"
                  ? "Not available for advanced level (already at highest difficulty)"
                  : watchedExperienceLevel === "none"
                  ? "Gradually increase difficulty from basic to advanced throughout the session"
                  : `Gradually increase difficulty from ${watchedExperienceLevel} to advanced throughout the session`}
              </p>
              {watchedProgressiveDifficulty && (
                <div className="mt-2 p-3 bg-accent-50 border border-accent-200 rounded-lg">
                  <p className="text-sm text-accent-800">
                    <strong>Progressive Mode Enabled:</strong> Questions will
                    start at your selected level and gradually become more
                    challenging, reaching advanced difficulty by the end of the
                    session.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Concepts Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Lightbulb className="w-4 h-4 text-primary-600" />
            <span>Key Concepts to Include</span>
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register("key_concepts")}
            placeholder="List specific concepts, topics, or areas you want to focus on..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none h-24"
          />
          <p className="text-sm text-gray-500 mt-1">
            Specify particular concepts, frameworks, or topics that should be
            emphasized in your learning session
          </p>
        </div>

        {/* Learning Goal Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 text-primary-600" />
            <span>Learning Goal</span>
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <Input
            {...register("learning_goal")}
            placeholder="e.g., prepare for interview, prepare for exam, understand fundamentals, etc."
            helperText="What do you want to accomplish with this learning session?"
          />
        </div>

        {/* Character Field */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 text-primary-600" />
            <span>AI Personality</span>
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            {...register("character")}
            placeholder="Describe the personality or teaching style you'd like the AI to adopt (e.g., encouraging mentor, strict professor, friendly tutor, etc.)"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none h-20 ${
              errors.character?.message
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : "border-gray-300"
            }`}
          />
          <p className="text-sm text-gray-500 mt-1">
            Define the personality and teaching approach you'd prefer from the
            AI assistant
          </p>
        </div>
        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 self-end">
          <Button
            type="button"
            variant="outline"
            icon={RotateCcw}
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            icon={Send}
            className="flex-1 sm:flex-none"
            disabled={isSubmitting || !isValid}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
};
