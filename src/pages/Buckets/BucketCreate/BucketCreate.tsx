import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { BucketCreateForm } from "./components/BucketCreateForm";
import { BucketData } from "./validator/formSchema";
import { useCreateBucket } from "../../../queries/createBucket";

export const BucketCreate = () => {
  const navigate = useNavigate();
  const { mutate } = useCreateBucket();
  const onSubmit = async (data: BucketData) => {
    mutate(
      {
        name: data.name,
        prompt_settings: {
          subject: data.subject,
          experience_level: data.experience_level,
          progressive_difficulty: data.progressive_difficulty || false,
          key_concepts: data.key_concepts || "",
          learning_goal: data.learning_goal || "",
          character: data.character || "",
        },
        visibility: data.visibility,
      },
      {
        onSuccess: () => {
          console.log("Bucket created successfully");
          navigate("/buckets");
        },
        onError: (error) => {
          console.error("Error creating bucket:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/buckets");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" icon={ArrowLeft} onClick={handleCancel}>
              Back to Buckets
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create New Bucket
            </h1>
            <p className="text-lg text-gray-600">
              Create a new question bucket to organize and share your content
            </p>
          </div>

          {/* Form */}
          <BucketCreateForm onSubmit={onSubmit} />
          {/* Additional Info */}
        </div>
      </div>
    </>
  );
};
