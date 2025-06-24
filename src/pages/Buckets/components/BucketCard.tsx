import { FolderOpen, Globe, MessageSquare, Lock } from "lucide-react";
import { BucketSummary } from "../../../types/supabaseBucket";
interface BucketCardProps {
  bucket: BucketSummary;
  handleBucketClick: (bucketId: string) => void;
}
export const BucketCard = ({ bucket, handleBucketClick }: BucketCardProps) => {
  return (
    <div
      key={bucket.id}
      onClick={() => handleBucketClick(bucket.id)}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors flex-shrink-0">
            <FolderOpen className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {bucket.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center text-sm text-gray-500">
                {bucket.visibility === "private" ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" /> Private
                  </>
                ) : (
                  <>
                    <Globe className="w-3 h-3 mr-1" /> Public
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Count - Prominent Display */}
      <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
        <div className="flex items-center justify-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <span className="text-2xl font-bold text-primary-700">
            {bucket.question_number}
          </span>
          <span className="text-sm text-primary-600 font-medium">
            {bucket.question_number === 1 ? "Question" : "Questions"}
          </span>
        </div>
      </div>

      {/* Tags - Subject and Level */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {/* Subject Tag */}
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
            📚 {bucket.prompt_settings.subject}
          </span>

          {/* Level Tag */}
          <span className={`px-3 py-1 text-sm font-medium rounded-full border`}>
            🎯 {bucket.prompt_settings.experience_level}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center"></div>
        <div className="flex items-center space-x-1">
          <span className="text-xs">Click to explore</span>
          <span className="text-primary-500">→</span>
        </div>
      </div>
    </div>
  );
}
