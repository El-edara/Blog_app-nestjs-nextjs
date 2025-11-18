"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  createCommentAction,
  updateCommentAction,
} from "@/lib/actions/comments.actions";
import { Loader2 } from "lucide-react";
import { Comment } from "@/lib/types";

type Props = {
  postId: number;
  comment?: Comment | null;
  mode?: "create" | "edit";
  onCancel?: () => void;
};

export default function CommentForm({
  postId,
  comment,
  mode = "create",
  onCancel,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const action =
    mode === "create"
      ? createCommentAction.bind(null, postId)
      : updateCommentAction.bind(null, comment?.id ?? 0, postId);

  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Success!");
      if (mode === "create") {
        formRef.current?.reset();
      }
      if (onCancel) onCancel();
    }
  }, [state.success, mode, onCancel, state.message]);

  useEffect(() => {
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state.message, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div>
        <textarea
          name="description"
          rows={mode === "edit" ? 2 : 3}
          defaultValue={comment?.description ?? ""}
          placeholder={
            mode === "edit" ? "Edit your comment..." : "Write a comment..."
          }
          required
          disabled={isPending}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
        />
        {state.error?.description && (
          <p className="text-sm text-red-500 mt-1">
            {state.error.description[0]}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "create" ? "Post Comment" : "Update"}
        </button>

        {mode === "edit" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
