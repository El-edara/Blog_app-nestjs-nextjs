"use client";

import { motion } from "framer-motion";
import {
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  User,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import {
  togglePostPublishAdmin,
  deletePostAdmin,
} from "@/lib/actions/admin.actions";
import styles from "../../app/page.module.css";
import { Post } from "@/lib/types";

interface AdminPostsPageProps {
  posts: Post[];
}

export default function AdminPostsPage({
  posts: initialPosts,
}: AdminPostsPageProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(postId);
    try {
      const result = await deletePostAdmin(postId);
      if (!result.success) throw new Error("Failed to delete post");

      setPosts(posts.filter((p) => p.id !== postId));
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setLoading(null);
    }
  };

  const handleTogglePublish = async (
    postId: number,
    currentStatus: boolean
  ) => {
    setLoading(postId);
    try {
      const result = await togglePostPublishAdmin(postId, !currentStatus);
      if (!result.success) throw new Error("Failed to update post");

      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, published: !currentStatus } : p
        )
      );
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setLoading(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "draft") return !post.published;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-4xl font-bold ${styles.textGradient} mb-4`}>
            Posts Management
          </h1>

          {/* Filters */}
          <div className="flex gap-2">
            {["all", "published", "draft"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} (
                {f === "all"
                  ? posts.length
                  : f === "published"
                    ? posts.filter((p) => p.published).length
                    : posts.filter((p) => !p.published).length}
                )
              </button>
            ))}
          </div>
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

        {/* Posts Table */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Comments
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {post.title}
                      </p>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        {post.author?.name || post.author?.email}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {post.published ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Comments */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post._count?.comments || 0}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <Link href={`/posts/${post.id}`} target="_blank">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Toggle Publish */}
                        <button
                          onClick={() =>
                            handleTogglePublish(post.id, post.published)
                          }
                          disabled={loading === post.id}
                          className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={loading === post.id}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No posts found
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
