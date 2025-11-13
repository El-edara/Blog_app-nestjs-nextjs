"use server";

import { authFetch } from "../authFetch";
import { API_URL } from "../constants";
import { User } from "../types";

/** ========== Get current profile ========== */
export async function getProfile(): Promise<User | null> {
  try {
    const res = await authFetch(`${API_URL}/users/me`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;

    const body = await res.json();

    // ✅ Handle nested data from ResponseInterceptor
    let responseData = body;
    if (body.data) {
      responseData = body.data;
    }
    if (responseData.data) {
      responseData = responseData.data;
    }
    return responseData ?? null;
  } catch (err) {
    console.error("❌ getProfile error", err);
    return null;
  }
}

/** ========== Update profile ========== */
export async function updateProfile(input: FormData) {
  try {
    const url = `${API_URL}/users/me`;

    const res = await authFetch(url, {
      method: "PATCH",
      body: input,
    });

    if (!res.ok) {
      let errBody = null;
      try {
        errBody = await res.json();
      } catch {
        /* ignore */
      }
      return {
        success: false,
        status: res.status,
        error: errBody ?? "Update failed",
      };
    }

    const body = await res.json();

    // ✅ Handle nested data
    let responseData = body;
    if (body.data) {
      responseData = body.data;
    }
    if (responseData.data) {
      responseData = responseData.data;
    }

    return { success: true, data: responseData };
  } catch (err) {
    console.error("❌ updateProfile error", err);
    return { success: false, error: (err as Error).message ?? err };
  }
}

/** ========== Upload avatar ========== */
export async function uploadAvatar(file: File) {
  try {
    const form = new FormData();
    form.append("file", file);

    const res = await authFetch(`${API_URL}/upload/avatar`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      let errBody = null;
      try {
        errBody = await res.json();
      } catch {}
      return {
        success: false,
        status: res.status,
        error: errBody ?? "Upload failed",
      };
    }

    const body = await res.json();

    // ✅ Handle nested data
    let responseData = body;
    if (body.data) {
      responseData = body.data;
    }
    if (responseData.data) {
      responseData = responseData.data;
    }

    return {
      success: true,
      url: responseData?.url ?? null,
    };
  } catch (err) {
    console.error("❌ uploadAvatar error", err);
    return { success: false, error: (err as Error).message ?? err };
  }
}
