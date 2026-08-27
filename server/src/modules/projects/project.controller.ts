import type { Request, Response } from "express";
import prisma from "@/lib/prismaClient.js";
import type { ProjectSchema, ProjectQuerySchema } from "./project.schema.js";

export const index = async (
  req: Request<{}, {}, {}, ProjectQuerySchema>,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const status = req.query.status;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && status !== "All") {
      where.status = status;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          projectTeams: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: projects,
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
      error: String(error),
    });
  }
};

export const store = async (
  req: Request<{}, {}, ProjectSchema>,
  res: Response,
): Promise<void> => {
  try {
    // Ensure default organization exists or use provided
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

    const project = await prisma.project.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        slug: req.body.name.toLowerCase().replace(/\s+/g, "-"),
        createdById: 1, // TODO: Replace with authenticated user ID
        organizationId,
        ...(req.body.teamIds &&
          req.body.teamIds.length > 0 && {
            projectTeams: {
              create: req.body.teamIds.map((teamId: number) => ({
                team: { connect: { id: teamId } },
              })),
            },
          }),
      },
      include: {
        projectTeams: true,
      },
    });
    res.status(201).json({
      success: true,
      flash: {
        success: "Project created successfully",
      },
      data: project,
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
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
      },
      include: {
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      data: project,
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
    const existing = await prisma.project.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    if (req.body.teamIds !== undefined) {
      await prisma.projectTeam.deleteMany({
        where: {
          projectId: existing.id,
        },
      });
    }

    const project = await prisma.project.update({
      where: {
        id: existing.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        slug: req.body.name ? req.body.name.toLowerCase().replace(/\s+/g, "-") : undefined,
        ...(req.body.teamIds && {
          projectTeams: {
            create: req.body.teamIds.map((teamId: number) => ({
              team: { connect: { id: teamId } },
            })),
          },
        }),
      },
      include: {
        projectTeams: {
          include: { team: true },
        },
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Project updated successfully",
      },
      data: project,
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
    const existing = await prisma.project.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const project = await prisma.project.delete({
      where: {
        id: existing.id,
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Project deleted successfully",
      },
      data: project,
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
