"use client";

import { motion } from "framer-motion";
import { Post } from "@/lib/types";
import Link from "next/link";
import { Calendar, User, MessageSquare } from "lucide-react";

const cardVariants = (index: number) => ({
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17,
      duration: 0.2,
      delay: index * 0.05,
    },
  },
  hover: {
    y: -3,
  },
});

const PostCard = ({ post, index }: { post: Post; index: number }) => {
  return (
    <Link href={`/posts/${post.id}`}>
      <motion.div
        variants={cardVariants(index)}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
              transition-all p-6 border border-gray-200 dark:border-gray-700 
                hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer
                flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
              {post.title}
            </h2>
            {!post.published && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full shrink-0 ml-2">
                Draft
              </span>
            )}
          </div>
          {/* Description */}
          {post.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="line-clamp-1">
                {post.author.name || post.author.email}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Comments count */}
          {post._count && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post._count.comments}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
