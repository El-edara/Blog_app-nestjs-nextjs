"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCommentAction } from "@/lib/actions/comments.actions";
import { Comment } from "@/lib/types";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import CommentForm from "./CommentForm";
import Image from "next/image";

type Props = {
  comment: Comment;
  postId: number;
  currentUserId?: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 18,
      duration: 0.2,
    },
  },
  hover: {
    y: -3,
  },
};

export default function CommentItem({ comment, postId, currentUserId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId === comment.authorId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    const result = await deleteCommentAction(comment.id, postId);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800/60 rounded-xl p-5 shadow-xs hover:shadow-sm dark:shadow-blue-500 border border-gray-200 dark:border-gray-700 transition-shadow duration-200"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative w-10 h-10 overflow-hidden">
            {comment.author?.avatarUrl ? (
              <Image
                src={comment.author.avatarUrl}
                alt={comment.author.name || "User Avatar"}
                width={40}
                height={40}
                className="rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-purple-600 
                        flex items-center justify-center text-white font-semibold shadow-sm"
              >
                {comment.author?.name
                  ? comment.author.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}
          </div>

          {/* Author Info */}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {comment.author?.name || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                         transition-colors disabled:opacity-50"
              title="Edit comment"
            >
              <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 
                         transition-colors disabled:opacity-50"
              title="Delete comment"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 text-red-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <CommentForm
          postId={postId}
          comment={comment}
          mode="edit"
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-300 text-[0.95rem] leading-relaxed whitespace-pre-wrap mt-2">
          {comment.description}
        </p>
      )}
    </motion.div>
  );
}
