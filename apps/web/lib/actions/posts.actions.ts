"use server";

import { revalidatePath } from "next/cache";
import { API_URL } from "../constants";
import { authFetch } from "../authFetch";
import { createPostSchema, updatePostSchema } from "../validations/post.schema";
import { Post, PostsResponse } from "../types";

type ActionState = {
  success?: boolean;
  message?: string;
  error?: Record<string, string[]>;
};

/* 🧩 Helper: Extract nested data (for ResponseInterceptor compatibility)      */
function extractData<T = any>(body: any): T {
  if (!body) return body;
  return body.data ?? body ?? null;
}

/* 🟣 Get all posts (Public / Paginated)                                      */
export async function getAllPosts(params?: {
  page?: number;
  limit?: number;
  published?: boolean;
  search?: string;
}): Promise<PostsResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.published !== undefined)
      query.set("published", String(params.published));
    if (params?.search) query.set("search", params.search);

    const url = `${API_URL}/posts?${query.toString()}`;
    const res = await fetch(url, {
      next: { revalidate: 120, tags: ["posts-list"] },
    });

    if (!res.ok) {
      console.error("❌ getAllPosts failed:", res.status);
      return null;
    }

    const body = await res.json();
    return body;
  } catch (err) {
    console.error("❌ getAllPosts error:", err);
    return null;
  }
}

/* 🟣 Get single post by ID                                                   */
export async function getPostById(id: number): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      next: { revalidate: 120, tags: [`post-${id}`] },
    });
    if (!res.ok) return null;

    const body = await res.json();
    return extractData<Post>(body);
  } catch (err) {
    console.error("❌ getPostById error:", err);
    return null;
  }
}

/* 🟣 Get current user's posts (Protected)                                    */
export async function getMyPosts(): Promise<Post[] | null> {
  try {
    const res = await authFetch(`${API_URL}/posts/me`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("❌ getMyPosts failed:", res.status);
      return null;
    }

    const body = await res.json();
    const data = extractData<Post[]>(body);
    return Array.isArray(data) ? data : null;
  } catch (err) {
    console.error("❌ getMyPosts error:", err);
    return null;
  }
}

/* 🟢 Create new post                                                         */
export async function createPostAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      published: formData.get("published") === "true",
    };

    const parsed = createPostSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const res = await authFetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { message: body?.message ?? "Failed to create post" };
    }

    revalidatePath("/posts", "page");
    revalidatePath("/dashboard/my-posts", "page");
    revalidatePath("/", "page");

    return { success: true, message: "Post created successfully!" };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

/* 🟢 Update post                                                             */
export async function updatePostAction(
  postId: number,
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = {
      title: formData.get("title") ? String(formData.get("title")) : undefined,
      description: formData.get("description")
        ? String(formData.get("description"))
        : undefined,
      published:
        formData.get("published") !== null
          ? formData.get("published") === "true"
          : undefined,
    };

    const parsed = updatePostSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.flatten().fieldErrors };
    }

    const res = await authFetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { message: body?.message ?? "Failed to update post" };
    }

    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");
    revalidatePath("/dashboard/my-posts", "page");

    return { success: true, message: "Post updated successfully!" };
  } catch (err) {
    return {
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

/* 🔴 Delete post                                                             */
export async function deletePostAction(postId: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const res = await authFetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return { success: false, message: "Failed to delete post" };
    }

    revalidatePath("/posts", "page");
    revalidatePath("/dashboard/my-posts", "page");

    return { success: true, message: "Post deleted successfully!" };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}

/* 🟡 Toggle publish status                                                   */
export async function togglePublishAction(
  postId: number,
  currentStatus: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await authFetch(`${API_URL}/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentStatus }),
    });

    if (!res.ok) {
      return { success: false, message: "Failed to update post" };
    }

    revalidatePath("/posts", "page");
    revalidatePath(`/posts/${postId}`, "page");
    revalidatePath("/dashboard/my-posts", "page");

    return {
      success: true,
      message: currentStatus ? "Post unpublished" : "Post published",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
