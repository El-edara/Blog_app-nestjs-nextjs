import PostList from "@/components/posts/PostList";
import Link from "next/link";
import styles from "../../page.module.css";
import { Plus } from "lucide-react";
import { getAllPosts } from "@/lib/actions/posts.actions";
import SearchFilters from "@/components/posts/SearchFilter";
import Pagination from "@/components/posts/Pagination";

export const revalidate = 120;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; published?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 9;
  const search = params.search;
  const published =
    params.published === "true"
      ? true
      : params.published === "false"
        ? false
        : undefined;

  const result = await getAllPosts({
    page,
    limit,
    published,
    search,
  });
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold text-gray-900 dark:text-white ${styles.textGradient}`}
            >
              All Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Discover and read amazing content
            </p>
          </div>

          <Link
            href="/posts/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <SearchFilters />

        {/* Posts List */}
        {result && result.data ? (
          <>
            <PostList posts={result.data} />

            {/* Pagination */}
            {result.meta && result.meta.totalPages > 1 && (
              <Pagination
                currentPage={result.meta.page}
                totalPages={result.meta.totalPages}
                total={result.meta.total}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {search
                ? `No posts found matching "${search}"`
                : "No posts available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
