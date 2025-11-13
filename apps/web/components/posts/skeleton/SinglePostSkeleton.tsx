import Skeleton from "@/components/ui/skeleton";

const SinglePostSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Skeleton className="h-10 w-32 mb-6" />

      {/* Post container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        {/* Title */}
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-10 w-1/2" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SinglePostSkeleton;
