import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useBuckets } from "../../queries/getBuckets";
import { Loading } from "../../components/Loading/Loading";
import {
  BucketCard,
  BucketFilterBar,
  BucketHeader,
} from "./components";

export const Buckets = () => {
  const navigate = useNavigate();
  const { data } = useBuckets();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filterBy, setFilterBy] = useState<"all" | "public" | "private">("all");

  const handleCreateBucket = () => {
    navigate("/buckets/create");
  };

  const handleBucketClick = (bucketId: string) => {
    navigate(`/buckets/${bucketId}`);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BucketHeader />
          <BucketFilterBar handleCreateBucket={handleCreateBucket} />
          <div
            className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
          >
            {data.map((bucket) => {
              return (
                <BucketCard
                  key={bucket.id}
                  bucket={bucket}
                  handleBucketClick={handleBucketClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Suspense>
  );
};
