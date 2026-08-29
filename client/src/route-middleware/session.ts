import { NextRequest } from "next/server";

export interface SessionData {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
    activeOrganizationId?: string | null;
    [key: string]: unknown;
  };
  user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    image?: string | null;
    hasActiveSubscription: boolean;
    needsOnboarding: boolean;
    organizationsCount: number;
    plan: {
      id: string;
      name: string;
      displayName: string;
      slug: string;
      status: string;
      interval?: string | null;
    } | null;
    activeOrganization: {
      id: string;
      name: string;
      slug: string;
      logo?: string | null;
      role: string;
      permissions: Record<string, string[]>;
    } | null;
    roles: string[];
    permissions: Record<string, string[]>;
    [key: string]: unknown;
  };
}

export async function getSession(
  request: NextRequest,
): Promise<SessionData | null> {
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const response = await fetch(`${apiBaseUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data || !data.session || !data.user) {
      return null;
    }

    return data as SessionData;
  } catch (error) {
    console.error("Error validating session in middleware:", error);
    return null;
  }
}
