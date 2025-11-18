// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { parseCookiesFromHeader } from "./lib/utils/cookies";
import { API_URL } from "./lib/constants";

/**
 * Helper: Clear auth cookies and redirect to login
 */
function clearCookiesAndRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

// في middleware.ts

const protectedRoutes = ["/dashboard", "/profile", "/posts/create"];
const adminRoutes = ["/admin"]; // ✅ جديد
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route)); // ✅ جديد
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // ✅ Admin Routes Protection
  if (isAdminRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user is admin
    if (accessToken) {
      try {
        const payload = decodeJwt(accessToken) as any;
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp > now) {
          // Check admin role
          if (payload.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
          return NextResponse.next();
        }
      } catch (error) {
        // Token invalid, continue to refresh
      }
    }

    // Try refresh
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const setCookieHeader = refreshResponse.headers.get("set-cookie");
          const response = NextResponse.next();

          await parseCookiesFromHeader(setCookieHeader);

          // Check role after refresh
          const newAccessToken = response.cookies.get("access_token")?.value;
          if (newAccessToken) {
            const payload = decodeJwt(newAccessToken) as any;
            if (payload.role !== "ADMIN") {
              return NextResponse.redirect(new URL("/", request.url));
            }
          }
          console.log("Refreshed token successfully");
          return response;
        }

        if (refreshResponse.status === 401 || refreshResponse.status === 403) {
          return clearCookiesAndRedirect(request);
        }
      } catch (error) {
        console.error("Refresh error:", error);
        return clearCookiesAndRedirect(request);
      }
    }

    return clearCookiesAndRedirect(request);
  }

  // ... باقي الكود كما هو
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/posts/create",
    "/login",
    "/register",
  ],
};
