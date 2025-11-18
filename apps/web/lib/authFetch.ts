import { getAuthTokens } from "./utils/cookies";

export async function authFetch(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const { accessToken } = await getAuthTokens();

  const headers = new Headers(init?.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  return response;
}
