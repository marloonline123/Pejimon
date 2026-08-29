import { NextRequest, NextResponse } from "next/server";
import { SessionData } from "./session";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default function checkActiveOrganization(
  request: NextRequest,
  sessionData: SessionData | null,
): NextResponse | undefined {
  if (!sessionData?.user) {
    return undefined;
  }

  const { pathname } = request.nextUrl;
  const isSelectOrgPage =
    pathname === "/select-organization" ||
    pathname.startsWith("/select-organization/");
  const isOnboardingPage =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");
  const isSubscriptionPage =
    pathname === "/subscription" || pathname.startsWith("/subscription/");
  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthPage || isSubscriptionPage || isOnboardingPage) {
    return undefined;
  }

  const { user } = sessionData;

  // console.log("sessionDaata: ", sessionData);

  // If user has organizations, but no active organization is selected:
  // Must be redirected to /select-organization unless already there
  if (!user.activeOrganization) {
    if (!isSelectOrgPage) {
      return NextResponse.redirect(
        new URL("/select-organization", request.url),
      );
    }
    return undefined;
  }

  return undefined;
}
