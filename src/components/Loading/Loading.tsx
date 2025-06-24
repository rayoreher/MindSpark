import { LoadingSkeleton } from "../common/LoadingSkeleton";

export const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <LoadingSkeleton className="w-32 h-10" />
          <div className="text-center space-y-4">
            <LoadingSkeleton variant="circle" className="mx-auto" />
            <LoadingSkeleton className="w-64 h-8 mx-auto" />
            <LoadingSkeleton className="w-96 h-4 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <LoadingSkeleton className="w-full h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
