import type { Request, Response } from "express";
import prisma from "@/lib/prismaClient.js";
import type {
  TaskSchema,
  TaskQuerySchema,
} from "@/modules/tasks/task.schema.js";

export const index = async (
  req: Request<{}, {}, {}, TaskQuerySchema>,
  res: Response,
): Promise<void> => {
  try {
    const projectSlug = req.query.projectSlug;
    const search = req.query.search;
    const status = req.query.status;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let projectId: number | undefined = undefined;
    if (projectSlug) {
      const project = await prisma.project.findFirst({
        where: { slug: projectSlug },
        select: { id: true },
      });
      if (project) {
        projectId = project.id;
      } else {
        res.status(404).json({ success: false, message: "Project not found" });
        return;
      }
    }

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && status !== "All") {
      where.status = status;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          taskAssignments: {
            include: { user: true },
          },
          author: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
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
      error: error,
    });
  }
};

export const store = async (
  req: Request<{}, {}, TaskSchema>,
  res: Response,
): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.body.projectId) },
    });

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const assignedUserIds =
      req.body.assignedUserIds ||
      (req.body.assignedUserId ? [req.body.assignedUserId] : []);

    const task = await prisma.task.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        status: req.body.status,
        priority: req.body.priority,
        tags: req.body.tags || null,
        startDate: req.body.startDate || null,
        dueDate: req.body.dueDate || null,
        points: req.body.points !== undefined ? Number(req.body.points) : null,
        estimatedHours:
          req.body.estimatedHours !== undefined
            ? req.body.estimatedHours
            : null,
        projectId: project.id,
        organizationId: project.organizationId,
        authorId: req.body.authorId || project.createdById,
        slug:
          req.body.name.toLowerCase().replace(/\s+/g, "-") +
          "-" +
          Date.now().toString().slice(-4),
        ...(assignedUserIds.length > 0 && {
          taskAssignments: {
            create: assignedUserIds.map((userId: string) => ({
              userId: userId,
            })),
          },
        }),
      },
      include: {
        taskAssignments: {
          include: { user: true },
        },
        author: true,
      },
    });
    res.status(201).json({
      success: true,
      flash: {
        success: "Task Created Successfully",
      },
      data: task,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const task = await prisma.task.findFirst({
      where: {
        slug: slug,
      },
      include: {
        taskAssignments: {
          include: { user: true },
        },
        author: true,
        comments: {
          include: { user: true },
        },
        attachments: true,
      },
    });
    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const existing = await prisma.task.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const assignedUserIds =
      req.body.assignedUserIds ||
      (req.body.assignedUserId ? [req.body.assignedUserId] : undefined);

    if (assignedUserIds !== undefined) {
      await prisma.taskAssignment.deleteMany({
        where: { taskId: existing.id },
      });
    }

    const task = await prisma.task.update({
      where: {
        id: existing.id,
      },
      data: {
        name: req.body.name,
        description: req.body.description ?? null,
        status: req.body.status,
        priority: req.body.priority,
        tags: req.body.tags ?? null,
        startDate: req.body.startDate,
        dueDate: req.body.dueDate,
        points: req.body.points,
        estimatedHours: req.body.estimatedHours,
        ...(assignedUserIds !== undefined && {
          taskAssignments: {
            create: assignedUserIds.map((userId: string) => ({
              userId: userId,
            })),
          },
        }),
      },
      include: {
        taskAssignments: {
          include: { user: true },
        },
        author: true,
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Task Updated Successfully",
      },
      data: task,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const existing = await prisma.task.findFirst({ where: { slug } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    const task = await prisma.task.delete({
      where: {
        id: existing.id,
      },
      include: {
        taskAssignments: true,
        comments: true,
        attachments: true,
      },
    });
    res.status(200).json({
      success: true,
      flash: {
        success: "Task Deleted Successfully",
      },
      data: task,
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
