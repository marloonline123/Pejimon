import { NextRequest, NextResponse } from "next/server";
import { SessionData } from "./session";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function checkOnboarding(
  request: NextRequest,
  sessionData: SessionData | null,
): NextResponse | undefined {
  if (!sessionData?.user) {
    return undefined;
  }

  const { pathname } = request.nextUrl;
  const isOnboardingPage =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isSubscriptionPage =
    pathname === "/subscription" || pathname.startsWith("/subscription/");
  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthPage || isSubscriptionPage) {
    return undefined;
  }

  const { user } = sessionData;
  const needsOnboarding =
    user.needsOnboarding === true || user.organizationsCount === 0;

  // If user needs onboarding (has 0 organizations):
  // Must be redirected to /onboarding unless already on /onboarding
  if (needsOnboarding) {
    if (!isOnboardingPage) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return undefined;
  }

  // If user does NOT need onboarding but navigates to /onboarding -> redirect to /dashboard
  if (!needsOnboarding && isOnboardingPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return undefined;
}
