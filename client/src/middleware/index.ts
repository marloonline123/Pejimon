import { NextRequest, NextResponse } from "next/server";
import isAuthenticated from "./auth";
import checkSubscription from "./subscription";
import checkOnboarding from "./onboarding";

export async function middleware(req: NextRequest) {
  // 1. Auth check (login/register redirects)
  const authResult = await isAuthenticated(req);
  if (authResult) return authResult;

  // 2. Subscription check (must have active plan)
  const subResult = await checkSubscription(req);
  if (subResult) return subResult;

  // 3. Onboarding check (must belong to at least one org)
  const onboardResult = await checkOnboarding(req);
  if (onboardResult) return onboardResult;

  return NextResponse.next();
}
