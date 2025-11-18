import { decodeJwt } from "jose";
import { Session } from "./types";
import { getAuthTokens } from "./utils/cookies";

export async function getSession(): Promise<Session | null> {
  const { accessToken } = await getAuthTokens();

  if (!accessToken) return null;

  try {
    const payload = decodeJwt(accessToken) as any;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return {
      user: {
        id: payload.sub as number,
        email: payload.email as string,
        name: payload.name || null,
        role: payload.role as "USER" | "ADMIN",
      },
    };
  } catch (err) {
    return null;
  }
}
