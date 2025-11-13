import { getPostById } from "@/lib/actions/posts.actions";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) notFound();

  const [post, session] = await Promise.all([
    getPostById(postId),
    getSession(),
  ]);

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  // Post not found
  if (!post) notFound();

  // Check if user is the owner
  if (post.authorId !== session.user.id) {
    redirect(`/posts/${postId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/posts/${postId}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to post</span>
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Update your post content
            </p>
          </div>

          {/* Form */}
          <PostForm post={post} mode="edit" />
        </div>
      </div>
    </div>
  );
}
