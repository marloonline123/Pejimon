import { NextRequest, NextResponse } from "next/server";
import checkAuth from "./auth";
import checkSubscription from "./subscription";
import checkOnboarding from "./onboarding";
import checkActiveOrganization from "./active-organization";
import { getSession } from "./session";

export async function middleware(req: NextRequest) {
  // Fetch session once for all middleware checks
  const sessionData = await getSession(req);

  // 1. Auth check (login/register redirects, protected page access)
  const authResult = checkAuth(req, sessionData);
  if (authResult) return authResult;

  // If not authenticated, allowed public/auth pages proceed
  if (!sessionData) {
    return NextResponse.next();
  }

  // 2. Subscription check (must have active plan)
  const subResult = checkSubscription(req, sessionData);
  if (subResult) return subResult;

  // 3. Onboarding check (must belong to at least one organization)
  const onboardResult = checkOnboarding(req, sessionData);
  if (onboardResult) return onboardResult;

  // 4. Active Organization check (must have an active organization selected)
  const activeOrgResult = checkActiveOrganization(req, sessionData);
  if (activeOrgResult) return activeOrgResult;

  // 5. If root route / was requested by fully ready authenticated user, redirect to /dashboard
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
