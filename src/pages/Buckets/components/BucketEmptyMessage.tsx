import { MessageSquare, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface BucketEmptyMessageProps {
  handleCreateBucket: () => void;
}
export const BucketEmptyMessage = ({
  handleCreateBucket,
}: BucketEmptyMessageProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
        <MessageSquare className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Buckets found
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Create a new bucket to get started.
      </p>

      <Button onClick={handleCreateBucket} icon={Plus} size="lg">
        Add Bucket
      </Button>
    </div>
  );
}
