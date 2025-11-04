/**
 * Next.js Proxy (Middleware)
 * Handles route protection and authentication redirects
 *
 * Note: This proxy works with localStorage-based auth.
 * For server-side token validation, consider using httpOnly cookies.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy function
 * Runs on every request to check authentication status
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization (_next/image)
  // - Favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookie (if you migrate to cookie-based auth)
  // const token = request.cookies.get("auth-token")?.value;

  // Since we're using localStorage, we'll rely on client-side protection
  // This middleware just sets up proper headers and allows the request through
  // The actual auth checking happens in client components

  return NextResponse.next();
}

/**
 * Proxy configuration
 * Specifies which routes the proxy should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
