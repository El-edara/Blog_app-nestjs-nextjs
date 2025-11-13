"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "../constants";
import { authFetch } from "../authFetch";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validations/comment.schema";
import { Comment } from "../types";

type ActionState = {
  success?: boolean;
  message?: string;
  error?: Record<string, string[]>;
};

// 🧩 Helper: Extract nested data
function extractData<T = any>(body: any): T {
  if (!body) return body;
  return body.data ?? body ?? null;
}

// 🟣 Get comments for a post
export async function getCommentsByPostId(
  postId: number
): Promise<Comment[] | null> {
  try {
    const res = await fetch(`${API_URL}/comments?postId=${postId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ getCommentsByPostId failed:", res.status);
      return null;
    }

    const body = await res.json();
    const data = extractData<Comment[]>(body);
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.error("❌ getCommentsByPostId error:", err);
    return null;
  }
}

// 🟢 Create comment
export async function createCommentAction(
  postId: number,
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = {
      description: String(formData.get("description") ?? ""),
      postId,
    };

    const parsed = createCommentSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const res = await authFetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { message: body?.message ?? "Failed to create comment" };
    }

    revalidatePath(`/posts/${postId}`);

    return { success: true, message: "Comment added successfully!" };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

// 🟡 Update comment
export async function updateCommentAction(
  commentId: number,
  postId: number,
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = {
      description: String(formData.get("description") ?? ""),
    };

    const parsed = updateCommentSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const res = await authFetch(`${API_URL}/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { message: body?.message ?? "Failed to update comment" };
    }

    revalidatePath(`/posts/${postId}`);

    return { success: true, message: "Comment updated successfully!" };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

// 🔴 Delete comment
export async function deleteCommentAction(
  commentId: number,
  postId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await authFetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return { success: false, message: "Failed to delete comment" };
    }

    revalidatePath(`/posts/${postId}`);

    return { success: true, message: "Comment deleted successfully!" };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
