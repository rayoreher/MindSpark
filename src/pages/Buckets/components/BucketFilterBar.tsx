import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface BucketFilterBarProps {
  handleCreateBucket: () => void;
}
export const BucketFilterBar = ({
  handleCreateBucket,
}: BucketFilterBarProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-end">
        <div className="flex items-center space-x-4">
          <Button
            icon={Plus}
            onClick={handleCreateBucket}
            className="whitespace-nowrap"
          >
            Create Bucket
          </Button>
        </div>
      </div>
    </div>
  );
};
