import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global Authentication Middleware
 *
 * Public Routes:
 * - "/" (Landing Page)
 * - "/signin" (Sign In Page)
 * - "/signup" (Sign Up Page)
 *
 * Protected Routes:
 * - "/dashboard" and all ERP submodules (/invoices, /customers, /banking, etc.)
 *
 * Rules:
 * 1. Unauthenticated users attempting to access protected routes are redirected to the landing page ("/").
 * 2. Authenticated users attempting to visit "/signin" or "/signup" are redirected to "/dashboard".
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read access_token from secure HttpOnly cookies
  const token = request.cookies.get("access_token")?.value;
  const isAuthenticated = Boolean(token);

  // List of public pages
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/verify-otp" ||
    pathname === "/reset-password" ||
    pathname === "/forgot-password";

  // If user is not authenticated and attempts to access any private route -> redirect to landing page
  if (!isAuthenticated && !isPublicRoute) {
    const landingUrl = new URL("/", request.url);
    return NextResponse.redirect(landingUrl);
  }

  // If user is already authenticated and visits public auth pages -> redirect to dashboard
  if (
    isAuthenticated &&
    (pathname === "/signin" ||
      pathname === "/signup" ||
      pathname === "/reset-password" ||
      pathname === "/forgot-password")
  ) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes (authentication and data endpoints)
     * 2. /_next (Next.js system files and bundles)
     * 3. Static assets (.svg, .png, .jpg, .ico, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
