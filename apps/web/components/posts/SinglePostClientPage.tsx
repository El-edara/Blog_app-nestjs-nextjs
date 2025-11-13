"use client";

import { Calendar, User, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import PostActions from "@/components/posts/PostActions";
import CommentForm from "@/components/comments/CommentForm";
import CommentList from "@/components/comments/CommentList";
import type { SinglePostClientPageProps } from "@/lib/types";

export default function SinglePostClientPage({
  post,
  comments,
  session,
  isOwner,
}: SinglePostClientPageProps) {
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

        {/* Post Container */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {!post.published && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full mb-3">
                    Draft
                  </span>
                )}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name || post.author.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {comments && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length} comments</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions (if owner) */}
          {isOwner && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <PostActions
                postId={post.id}
                published={post.published}
                isOwner={isOwner}
              />
            </div>
          )}

          {/* Content */}
          {post.description && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {post.description}
              </p>
            </div>
          )}
        </article>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Comments
          </h2>

          {session ? (
            <div className="mb-8">
              <CommentForm postId={post.id} />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <Link href="/login" className="font-medium underline">
                  Sign in
                </Link>{" "}
                to leave a comment
              </p>
            </div>
          )}

          <CommentList
            comments={comments ?? []}
            postId={post.id}
            currentUserId={session?.user?.id}
          />
        </div>
      </div>
    </div>
  );
}
