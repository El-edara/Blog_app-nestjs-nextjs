import SinglePostSkeleton from "@/components/posts/skeleton/SinglePostSkeleton";

export default function SinglePostLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <SinglePostSkeleton />
    </div>
  );
}
