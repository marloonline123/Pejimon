import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import prisma from "@/lib/prismaClient.js";
import auth from "@/config/auth.js";
import type {
  OrganizationSchema,
  OrganizationQuerySchema,
} from "@/modules/organizations/organization.schema.js";

export const index = async (
  req: Request<{}, {}, OrganizationQuerySchema>,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Default: only show active organizations
    where.deletedAt = null;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.organization.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: organizations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const show = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        teams: true,
        projects: true,
      },
    });

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

export const store = async (
  req: Request<{}, {}, OrganizationSchema>,
  res: Response,
): Promise<void> => {
  try {
    // 1. Auto-generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // 2. Relative logo path if a file was uploaded
    const logoPath = req.file
      ? `/uploads/organizations/${req.file.filename}`
      : req.body.logo || undefined;

    // 3. Create Organization using better-auth API
    const orgResult = await auth.api.createOrganization({
      headers: req.headers,
      body: {
        name: req.body.name,
        slug: slug,
        logo: logoPath,
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : undefined,
        keepCurrentActiveOrganization: false,
      },
    });

    if (orgResult?.id) {
      // Ensure description and logo path are updated in Prisma database
      const updateData: { description?: string | null; logo?: string | null } =
        {};
      if (req.body.description !== undefined) {
        updateData.description = req.body.description;
      }
      if (logoPath) {
        updateData.logo = logoPath;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.organization.update({
          where: { id: orgResult.id },
          data: updateData,
        });
      }

      // Create Default Roles in OrganizationRole automatically
      const defaultRoles = [
        {
          role: "admin",
          permission: JSON.stringify({
            organization: ["create", "read", "update", "delete", "share"],
            project: ["create", "read", "update", "delete", "share"],
            team: ["create", "read", "update", "delete", "share"],
            member: ["create", "read", "update", "delete", "share"],
          }),
        },
        {
          role: "member",
          permission: JSON.stringify({
            organization: ["read"],
            project: ["create", "read", "update"],
            team: ["read"],
            member: ["read"],
          }),
        },
        {
          role: "viewer",
          permission: JSON.stringify({
            organization: ["read"],
            project: ["read"],
            team: ["read"],
            member: ["read"],
          }),
        },
      ];

      for (const roleDef of defaultRoles) {
        await prisma.organizationRole.create({
          data: {
            id: crypto.randomUUID(),
            organizationId: orgResult.id,
            role: roleDef.role,
            permission: roleDef.permission,
          },
        });
      }

      // Update lastActiveOrganizationId in user's Account record
      const userId = res.locals?.session?.user?.id;
      if (userId && orgResult.id) {
        await prisma.account.updateMany({
          where: { userId },
          data: {
            lastActiveOrganizationId: orgResult.id,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: orgResult,
      message: "Organization created successfully with default roles.",
    });
  } catch (error: any) {
    console.error("Auth/Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
      error: error,
    });
  }
};

export const update = async (
  req: Request<{ slug: string }, {}, Partial<OrganizationSchema>>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found",
      });
      return;
    }

    // Relative logo path if a file was uploaded
    const logoPath = req.file
      ? `/uploads/organizations/${req.file.filename}`
      : req.body.logo !== undefined
        ? req.body.logo
        : undefined;

    // If new logo is uploaded and old logo exists in uploads directory, remove the old file
    if (
      req.file &&
      organization.logo &&
      organization.logo.startsWith("/uploads/organizations/")
    ) {
      const oldFilePath = path.join(
        process.cwd(),
        organization.logo.replace(/^\//, ""),
      );
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error("Failed to delete previous logo:", err);
        }
      }
    }

    // BetterAuth API allows updateOrganization
    const updatedOrg = await auth.api.updateOrganization({
      headers: req.headers,
      body: {
        organizationId: organization.id,
        data: {
          name: req.body.name,
          logo: logoPath,
          metadata: req.body.metadata
            ? JSON.parse(req.body.metadata)
            : undefined,
        },
      },
    });

    const updateData: { description?: string | null; logo?: string | null } =
      {};
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (logoPath !== undefined) {
      updateData.logo = logoPath;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.organization.update({
        where: { id: organization.id },
        data: updateData,
      });
    }

    res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: updatedOrg,
    });
  } catch (error: any) {
    console.error("Auth/Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
      error: error,
    });
  }
};

export const destroy = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found",
      });
      return;
    }

    // Clean up logo file if it was uploaded locally
    if (
      organization.logo &&
      organization.logo.startsWith("/uploads/organizations/")
    ) {
      const filePath = path.join(
        process.cwd(),
        organization.logo.replace(/^\//, ""),
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Failed to delete organization logo file:", err);
        }
      }
    }

    // Use better-auth API to delete organization
    await auth.api.deleteOrganization({
      headers: req.headers,
      body: {
        organizationId: organization.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error: any) {
    console.error("Auth/Prisma Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
      error: error,
    });
  }
};
