import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy (previously "middleware").
 * Protect /dashboard/** routes.
 * The refreshToken cookie existence signals the user *might* be authenticated.
 * Real JWT validation happens per-request in the API.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard dashboard routes (bypassed in development mode)
  if (pathname.startsWith("/dashboard") && process.env.NODE_ENV !== "development") {
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/accept-invite"
  ) {
    const refreshToken = request.cookies.get("refreshToken");
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard/owner", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/accept-invite",
  ],
};
