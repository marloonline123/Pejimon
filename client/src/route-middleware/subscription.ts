import { NextRequest, NextResponse } from "next/server";
import { SessionData } from "./session";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function checkSubscription(
  request: NextRequest,
  sessionData: SessionData | null,
): NextResponse | undefined {
  if (!sessionData?.user) {
    return undefined;
  }

  const { pathname } = request.nextUrl;
  const isSubscriptionPage =
    pathname === "/subscription" || pathname.startsWith("/subscription/");
  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthPage) {
    return undefined;
  }

  const { user } = sessionData;

  // If user does not have an active subscription:
  // Must be redirected to /subscription unless already on /subscription
  if (user.hasActiveSubscription === false) {
    if (!isSubscriptionPage) {
      return NextResponse.redirect(new URL("/subscription", request.url));
    }
    return undefined;
  }

  return undefined;
}
