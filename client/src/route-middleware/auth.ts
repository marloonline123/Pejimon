import { NextRequest, NextResponse } from "next/server";
import { SessionData } from "./session";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/projects",
  "/teams",
  "/calendar",
  "/settings",
];

export default function checkAuth(
  request: NextRequest,
  sessionData: SessionData | null,
): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isProtectedPage =
    pathname === "/" ||
    PROTECTED_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) ||
    pathname === "/subscription" ||
    pathname.startsWith("/subscription/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname === "/select-organization" ||
    pathname.startsWith("/select-organization/");

  const isAuthenticated = !!sessionData?.session;

  // 1. If user is already authenticated and visits login/register -> redirect to /dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. If user is not authenticated and tries to access protected pages -> redirect to /login
  if (!isAuthenticated && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && pathname !== "/dashboard") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const response = NextResponse.redirect(loginUrl);

    // Clear stale cookies if present
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (sessionToken) {
      response.cookies.delete("better-auth.session_token");
      response.cookies.delete("__Secure-better-auth.session_token");
    }

    return response;
  }

  return undefined;
}
