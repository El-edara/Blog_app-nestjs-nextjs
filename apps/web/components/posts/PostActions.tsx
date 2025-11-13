"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  deletePostAction,
  togglePublishAction,
} from "@/lib/actions/posts.actions";

type Props = {
  postId: number;
  published: boolean;
  isOwner: boolean;
};

export default function PostActions({ postId, published, isOwner }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    const result = await deletePostAction(postId);

    if (result.success) {
      toast.success(result.message);
      router.push("/posts");
    } else {
      toast.error(result.message);
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsToggling(true);
    const result = await togglePublishAction(postId, published);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsToggling(false);
  };

  if (!isOwner) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Publish */}
      <button
        onClick={handleTogglePublish}
        disabled={isToggling || isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {isToggling ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : published ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
        <span className="text-sm">{published ? "Unpublish" : "Publish"}</span>
      </button>

      {/* Edit */}
      <button
        onClick={() => router.push(`/posts/${postId}/edit`)}
        disabled={isDeleting || isToggling}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <Pencil className="w-4 h-4" />
        <span className="text-sm">Edit</span>
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isDeleting || isToggling}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        <span className="text-sm">Delete</span>
      </button>
    </div>
  );
}
