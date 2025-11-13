import { jwtVerify, SignJWT } from "jose";
import { SessionPayload, Session } from "./types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE_NAME = "access_token";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const rowKey = process.env.NEXT_PUBLIC_SESSION_SECRET_KEY;
if (!rowKey) {
  throw new Error("Missing NEXT_PUBLIC_SESSION_SECRET_KEY");
}
export const encodedKey = new TextEncoder().encode(rowKey);

// create session -> signs a JWT (frontend session) and sets httpOnly cookie
export async function createSession(payload: SessionPayload): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(encodedKey);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// read and verify session JWT from cookie
export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("❌ Session verification failed:", err);
    return null;
  }
}

// clear session cookie
export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

// helper: returns access token stored inside our session
export async function getAccessToken(): Promise<string | null> {
  const s = await getSession();
  return s?.accessToken ?? null;
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const sessionCookies = (await cookies()).get(COOKIE_NAME)?.value;
  if (!sessionCookies) return null;

  try {
    const { payload } = await jwtVerify<Session>(sessionCookies, encodedKey);
    if (!payload) throw new Error("Session not found");
    const newPayload: Session = {
      user: {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
      },
      accessToken,
      refreshToken,
    };

    await createSession(newPayload);
  } catch (err) {
    console.error("❌ Failed to verify session", err);
    redirect("/auth/signin");
  }
}
