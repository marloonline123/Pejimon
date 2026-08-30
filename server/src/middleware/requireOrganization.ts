import type { Request, Response, NextFunction } from "express";
import { setTenantContext } from "@/lib/tenant-context.js";
import auth from "@/config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import prisma from "@/lib/prismaClient.js";

// Extend Express Request interface with organizationId
declare global {
  namespace Express {
    interface Request {
      organizationId?: string;
    }
  }
}

export const requireOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Valid authentication session is required.",
        data: {},
      });
      return;
    }

    // 1. Read active organization ID from session or x-organization-id header
    const headerOrgId =
      (req.headers["x-organization-id"] as string | undefined) ||
      (req.headers["x-tenant-id"] as string | undefined);

    const sessionOrgId = (
      session.session as { activeOrganizationId?: string | null }
    )?.activeOrganizationId;

    const organizationId = headerOrgId || sessionOrgId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "No active organization selected.",
        data: {
          session,
        },
      });
      return;
    }

    // 2. Validate user's database membership in the organization
    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId: organizationId,
      },
    });

    if (!membership) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not a member of this organization.",
      });
      return;
    }

    // 3. Attach organization & user context to Request and Response locals
    req.organizationId = organizationId;
    res.locals.organizationId = organizationId;
    res.locals.session = session.session;
    res.locals.user = session.user;
    res.locals.membership = membership;

    // 4. Run downstream handlers in tenant AsyncLocalStorage context
    setTenantContext(organizationId, () => {
      next();
    });
  } catch (error) {
    console.error("requireOrganization error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during organization verification",
      error: String(error),
    });
  }
};

export default requireOrganization;
