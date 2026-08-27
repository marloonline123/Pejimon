import type { Request, Response } from "express";
import prisma from "@/lib/prismaClient.js";
import type {
  TeamSchema,
  TeamQuerySchema,
} from "@/modules/teams/team.schema.js";

export const index = async (
  req: Request<{}, {}, {}, TeamQuerySchema>,
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

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          teamUsers: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.team.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: teams,
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

export const store = async (
  req: Request<{}, {}, TeamSchema>,
  res: Response,
): Promise<void> => {
  try {
    let organizationId = req.body.organizationId;
    if (!organizationId) {
      const defaultOrg = await prisma.organization.findFirst();
      if (defaultOrg) {
        organizationId = defaultOrg.id;
      } else {
        const newOrg = await prisma.organization.create({
          data: {
            name: "Default Organization",
            slug: "default-organization",
          },
        });
        organizationId = newOrg.id;
      }
    }

    const managerId = req.body.managerId || req.body.teamManagerId;
    const userIds = (req.body.userIds || []).filter((id) => id !== managerId);

    const teamUsersCreate: { userId: number; role: string }[] = [];
    if (managerId) {
      teamUsersCreate.push({ userId: managerId, role: "MANAGER" });
    }
    for (const uId of userIds) {
      teamUsersCreate.push({ userId: uId, role: "MEMBER" });
    }

    const team = await prisma.team.create({
      data: {
        name: req.body.name,
        description: req.body.description ?? null,
        slug: req.body.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4),
        organizationId,
        ...(teamUsersCreate.length > 0 && {
          teamUsers: {
            create: teamUsersCreate,
          },
        }),
      },
      include: {
        teamUsers: {
          include: { user: true },
        },
      },
    });
    res.status(201).json({
      success: true,
      flash: {
        success: "Team created successfully",
      },
      data: team,
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

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const team = await prisma.team.findFirst({
      where: {
        slug: slug,
      },
      include: {
        teamUsers: {
          include: { user: true },
        },
        projectTeams: {
          include: { project: true },
        },
      },
    });
    res.status(200).json({
      success: true,
      data: team,
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

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const existing = await prisma.team.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }

    const managerId = req.body.managerId || req.body.teamManagerId;
    const userIds = req.body.userIds;

    if (userIds !== undefined || managerId !== undefined) {
      await prisma.teamUser.deleteMany({
        where: {
          teamId: existing.id,
        },
      });

      const teamUsersCreate: { userId: number; role: string }[] = [];
      if (managerId) {
        teamUsersCreate.push({ userId: managerId, role: "MANAGER" });
      }
      if (userIds) {
        for (const uId of userIds) {
          if (uId !== managerId) {
            teamUsersCreate.push({ userId: uId, role: "MEMBER" });
          }
        }
      }

      if (teamUsersCreate.length > 0) {
        await prisma.teamUser.createMany({
          data: teamUsersCreate.map((tu) => ({
            teamId: existing.id,
            userId: tu.userId,
            role: tu.role,
          })),
        });
      }
    }

    const team = await prisma.team.update({
      where: {
        id: existing.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description ?? null,
      },
      include: {
        teamUsers: {
          include: { user: true },
        },
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Team updated successfully",
      },
      data: team,
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

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const existing = await prisma.team.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Team not found" });
      return;
    }

    const team = await prisma.team.delete({
      where: {
        id: existing.id,
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Team deleted successfully",
      },
      data: team,
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
