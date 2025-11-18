"use server";

import { decodeJwt } from "jose";
import { cookies } from "next/headers";

//  * ✅ Parse cookies - يُستخدم فقط في Server Actions
export async function parseCookiesFromHeader(
  setCookieHeader: string | null,
  options?: {
    includeOnly?: string[];
    accessTokenMaxAge?: number;
    refreshTokenMaxAge?: number;
  }
): Promise<void> {
  if (!setCookieHeader) return;

  const cookieStore = await cookies();

  const cookiePairs = setCookieHeader.split(",").map((c) => c.trim());

  for (const cookieStr of cookiePairs) {
    const [nameValue = ""] = cookieStr.split(";");
    const [name, value] = nameValue.split("=");

    if (!name || typeof value === "undefined") continue;

    const key = name.trim();
    const val = value.trim();

    if (options?.includeOnly && !options.includeOnly.includes(key)) {
      continue;
    }

    let maxAge: number;
    if (key === "access_token") {
      maxAge = options?.accessTokenMaxAge ?? 15 * 60; // 15 دقائق
    } else if (key === "refresh_token") {
      maxAge = options?.refreshTokenMaxAge ?? 7 * 24 * 60 * 60; // 7 أيام
    } else {
      maxAge = 24 * 60 * 60;
    }

    // اضبط الـ cookie
    cookieStore.set(key, val, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });
  }
}

/**
  ✅ Get auth cookie header (READ ONLY - آمن في أي مكان)
 */
export async function getAuthCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push(`access_token=${accessToken}`);
  if (refreshToken) cookieParts.push(`refresh_token=${refreshToken}`);

  return cookieParts.join("; ");
}

/**
  ✅ Clear auth cookies - يُستخدم فقط في Server Actions
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

/**
 ✅ Get tokens (READ ONLY - آمن في أي مكان)
 */
export async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("access_token")?.value,
    refreshToken: cookieStore.get("refresh_token")?.value,
  };
}
