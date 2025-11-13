import { getMyPosts } from "@/lib/actions/posts.actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PostList from "@/components/posts/PostList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MyPostsPage() {
  const session = await getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  const posts = await getMyPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your published and draft posts
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

        {/* Stats */}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Total Posts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Published
              </p>
              <p className="text-2xl font-bold text-green-600">
                {posts.filter((p) => p.published).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {posts.filter((p) => !p.published).length}
              </p>
            </div>
          </div>
        )}

        {/* Posts List */}
        {posts && posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't created any posts yet
            </p>
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Post</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
