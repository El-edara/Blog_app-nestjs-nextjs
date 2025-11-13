import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreatePostPage() {
  const session = await getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to posts</span>
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Share your thoughts with the community
            </p>
          </div>

          {/* Form */}
          <PostForm mode="create" />
        </div>
      </div>
    </div>
  );
}
