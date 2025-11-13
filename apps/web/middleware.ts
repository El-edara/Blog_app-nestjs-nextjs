import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, encodedKey } from "./lib/session";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // public routes
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("_next") ||
    pathname.startsWith("/api");

  // read cookie from request
  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  if (!cookie) {
    if (isPublic || isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // verify JWT
    await jwtVerify(cookie, encodedKey, { algorithms: ["HS256"] });

    if (isAuthRoute) {
      // already logged in -> redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // valid -> allowed
    return NextResponse.next();
  } catch (err) {
    // invalid -> redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// protect desired routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/posts/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
