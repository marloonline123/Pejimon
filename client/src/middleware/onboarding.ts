import { NextRequest, NextResponse } from "next/server";

export default async function checkOnboarding(request: NextRequest) {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // Skip auth, subscription, and onboarding pages
  const isExcludedPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/") ||
    pathname === "/subscription" ||
    pathname.startsWith("/subscription/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/");

  if (isExcludedPage || !sessionToken) {
    return undefined;
  }

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/teams") ||
    pathname.startsWith("/calendar") ||
    pathname.startsWith("/settings");

  if (!isProtectedPage) {
    return undefined;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (response.ok) {
      const sessionData = await response.json();
      const user = sessionData?.user;

      // If user has active subscription but no orgs, redirect to onboarding
      if (
        user &&
        user.hasActiveSubscription === true &&
        user.needsOnboarding === true
      ) {
        return NextResponse.redirect(
          new URL("/onboarding", request.url),
        );
      }
    }
  } catch (error) {
    console.error("Error checking onboarding:", error);
  }

  return undefined;
}
