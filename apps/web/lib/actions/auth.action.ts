"use server";

import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { API_URL } from "../constants";
import { revalidatePath } from "next/cache";
import {
  clearAuthCookies,
  getAuthCookieHeader,
  parseCookiesFromHeader,
} from "../utils/cookies";

export type FormState = {
  success?: boolean;
  message?: string;
  error?: Record<string, string[]>;
};

// ====================== LOGIN (FIXED) ======================
export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(parsed.data),
    });

    // ✅ Handle backend errors properly
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || "Invalid email or password";
      return {
        success: false,
        message: errorMessage,
      };
    }

    // ✅ استخرج الـ cookies من الـ response
    const setCookieHeader = res.headers.get("set-cookie");
    await parseCookiesFromHeader(setCookieHeader, {
      includeOnly: ["access_token", "refresh_token"],
    });

    return { success: true, message: "Login successful" };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}

// ====================== REGISTER (FIXED) ======================
export async function registerAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    // ✅ Handle backend errors properly
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      // Backend might return specific error for existing user
      const errorMessage = errorData.message || "Registration failed";

      return {
        success: false,
        message: errorMessage,
      };
    }

    revalidatePath("/login");
    return { success: true, message: "Registration successful" };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
}

// ====================== LOGOUT (FIXED) ======================
export async function logoutAction() {
  try {
    const cookieHeader = await getAuthCookieHeader();

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: cookieHeader,
      },
    });

    await clearAuthCookies();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("❌ Logout failed:", err);
  }

  redirect("/login");
}
