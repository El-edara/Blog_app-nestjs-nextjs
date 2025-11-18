// lib/actions/admin.actions.ts
"use server";

import { revalidateTag } from "next/cache";
import { authFetch } from "../authFetch";
import { API_URL } from "../constants";

// ================ HELPER للـ Cache Tags ================
const TAGS = {
  stats: "admin-stats",
  users: "admin-users",
  posts: "admin-posts",
  comments: "admin-comments",
  activity: "admin-activity",
} as const;

// ================ STATS ================
export async function getAdminStats() {
  const res = await authFetch(`${API_URL}/admin/stats`, {
    next: { revalidate: 60, tags: [TAGS.stats] },
  });

  if (!res.ok) throw new Error("Failed to fetch stats");
  const result = await res.json();
  return result.data?.data || result.data || result;
}

export async function getRecentActivity() {
  const res = await authFetch(`${API_URL}/admin/recent-activity`, {
    next: { revalidate: 300, tags: [TAGS.activity] },
  });

  if (!res.ok) return null;
  const result = await res.json();
  return result.data || result;
}

// ================ USERS ================
export async function getAllUsersAdmin() {
  const res = await authFetch(`${API_URL}/admin/users`, {
    next: { revalidate: 60, tags: [TAGS.users, TAGS.stats] },
  });

  if (!res.ok) return [];
  const result = await res.json();
  return result.data?.data || result.data || result || [];
}

export async function deleteUserAdmin(userId: number) {
  const res = await authFetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) return { success: false, message: "Failed to delete user" };

  revalidateTag(TAGS.users);
  revalidateTag(TAGS.stats);

  return { success: true, message: "User deleted successfully" };
}

export async function updateUserRoleAdmin(
  userId: number,
  role: "USER" | "ADMIN"
) {
  const res = await authFetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) return { success: false, message: "Failed to update role" };

  revalidateTag(TAGS.users);
  revalidateTag(TAGS.stats);

  return { success: true, message: "Role updated successfully" };
}

// ================ POSTS ================
export async function getAllPostsAdmin() {
  const res = await authFetch(`${API_URL}/admin/posts`, {
    next: { revalidate: 60, tags: [TAGS.posts, TAGS.stats] },
  });

  if (!res.ok) return [];
  const result = await res.json();
  return result.data?.data || result.data || result || [];
}

export async function deletePostAdmin(postId: number) {
  const res = await authFetch(`${API_URL}/admin/posts/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) return { success: false };

  revalidateTag(TAGS.posts);
  revalidateTag(TAGS.stats);

  return { success: true };
}

export async function togglePostPublishAdmin(
  postId: number,
  published: boolean
) {
  const res = await authFetch(`${API_URL}/admin/posts/${postId}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ published }),
  });

  if (!res.ok) return { success: false };

  revalidateTag(TAGS.posts);
  revalidateTag(TAGS.stats);

  return { success: true };
}

// ================ COMMENTS ================
export async function getAllCommentsAdmin({
  page = 1,
  limit = 15,
}: { page?: number; limit?: number } = {}) {
  const res = await authFetch(`${API_URL}/admin/comments`, {
    next: { revalidate: 60, tags: [TAGS.comments, TAGS.stats] },
  });

  if (!res.ok) return [];
  const result = await res.json();

  return result.data?.data || result.data || result;
}

export async function deleteCommentAdmin(commentId: number) {
  const res = await authFetch(`${API_URL}/admin/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) return { success: false };

  revalidateTag(TAGS.comments);
  revalidateTag(TAGS.stats);

  return { success: true };
}
