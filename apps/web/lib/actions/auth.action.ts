"use server";

import { revalidatePath } from "next/cache";
import { AuthResponse, SessionPayload } from "../types";
import { API_URL } from "../constants";
import { clearSession, createSession, getAccessToken } from "../session";
import { loginSchema, registerSchema } from "../validations/auth.schema";
import { redirect } from "next/navigation";

export type FormState = {
  success?: boolean;
  message?: string;
  error?: Record<string, string[]>;
};

// register
export async function registerAction(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const raw = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        password: parsed.data.password,
        email: parsed.data.email,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { message: body?.message ?? "Registration failed" };
    }

    return { success: true, message: "Registration successful" };
  } catch (err) {
    return {
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.",
    };
  }
}

export async function loginAction(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const raw = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(parsed.data),
    });

    const body = (await res.json()) as any;

    if (!res.ok) {
      const errorMessage =
        typeof body.message === "string" ? body.message : "Invalid credentials";

      return { message: errorMessage };
    }

    let responseData = body;
    if (body.data) {
      responseData = body.data;
    }

    if (responseData.data) {
      responseData = responseData.data;
    }

    if (!responseData || !responseData.user) {
      return { message: "Invalid response structure from server" };
    }

    const payload: SessionPayload = {
      user: {
        id: responseData.user.id,
        name: responseData.user.name,
        email: responseData.user.email,
        role: responseData.user.role,
      },
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
    };

    await createSession(payload);

    revalidatePath("/", "layout");

    return { success: true, message: "Login successful" };
  } catch (err) {
    return {
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again later.",
    };
  }
}

// logout
export async function logoutAction(): Promise<void> {
  // optionally notify backend
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore
  }

  await clearSession();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------------------------------------------------
export async function refreshSessionToken(oldRefreshToken: string) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();
    // update session with new tokens
    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/refresh`,
      {
        method: "POST",
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      }
    );

    if (!updateRes.ok) {
      throw new Error("Failed to update session tokens");
    }
    return accessToken;
  } catch (err) {
    console.error("❌ Failed to refresh session token", err);
  }
}
// ---------------------------------------------------
