import type { Request, Response, NextFunction } from "express";
import { setTenantContext } from "@/lib/tenant-context.js";
import auth from "@/config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: {},
    });
    return;
  }

  const organizationId = (
    session.session as { activeOrganizationId?: string | null }
  ).activeOrganizationId;

  if (!organizationId) {
    res.status(400).json({
      success: false,
      message: "No active organization",
      data: {
        activeOrganizationId: session,
      },
    });
    return;
  }

  res.locals.session = session.session;
  res.locals.user = session.user;

  setTenantContext(organizationId, () => {
    next();
  });
};
