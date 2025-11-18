"use client";

import { motion } from "framer-motion";
import { Trash2, ExternalLink, User, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import styles from "../../app/page.module.css";
import { deleteCommentAdmin } from "@/lib/actions/admin.actions";

interface Comment {
  id: number;
  description: string;
  createdAt: string;
  author: {
    name?: string;
    email: string;
  };
  post: {
    id: number;
    title: string;
  };
}

interface AdminCommentsPageProps {
  comments: Comment[];
}

export default function AdminCommentsPage({
  comments: initialComments,
}: AdminCommentsPageProps) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState<number | null>(null);

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setLoading(commentId);
    try {
      const result = await deleteCommentAdmin(commentId);
      if (!result.success) throw new Error("Failed to delete comment");

      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold ${styles.textGradient} mb-2`}>
            Comments Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Total Comments: {comments.length}
          </p>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Panel</span>
        </motion.a>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Comment Content */}
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {comment.author.name?.[0]?.toUpperCase() ||
                        comment.author.email[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {comment.author.name || "No name"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.author.email}
                      </p>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.description}
                  </p>

                  {/* Post Link */}
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">
                      On post:
                    </span>
                    <Link
                      href={`/posts/${comment.post.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                    >
                      {comment.post.title}
                    </Link>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* View Post */}
                  <Link href={`/posts/${comment.post.id}`} target="_blank">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={loading === comment.id}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No comments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
