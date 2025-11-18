"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Post } from "@/lib/types";
import { Loader2 } from "lucide-react";
import {
  createPostAction,
  updatePostAction,
} from "@/lib/actions/posts.actions";

type Props = {
  post?: Post | null;
  mode?: "create" | "edit";
};

export default function PostForm({ post, mode = "create" }: Props) {
  const router = useRouter();

  const action =
    mode === "create"
      ? createPostAction
      : updatePostAction.bind(null, post?.id ?? 0);

  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Success!");
      setTimeout(() => {
        if (mode === "create") {
          router.push("/posts");
        } else {
          router.push(`/posts/${post?.id}`);
        }
      }, 500);
    }
  }, [state.success, mode, router, post?.id, state.message]);

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.message, state.success]);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={post?.title ?? ""}
          placeholder="Enter post title..."
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        {state.error?.title && (
          <p className="text-sm text-red-500 mt-1">{state.error.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={8}
          defaultValue={post?.description ?? ""}
          placeholder="Write your post content..."
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
        />
        {state.error?.description && (
          <p className="text-sm text-red-500 mt-1">
            {state.error.description[0]}
          </p>
        )}
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          value="true"
          defaultChecked={post?.published ?? false}
          disabled={isPending}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publish immediately
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Post"
          ) : (
            "Update Post"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
