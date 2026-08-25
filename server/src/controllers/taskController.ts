import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import type { TaskSchema, TaskQuerySchema } from "../schemas/taskSchema.js";

export const index = async (
    req: Request<{}, {}, {}, TaskQuerySchema>,
    res: Response
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
                select: { id: true }
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
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.task.count({ where })
        ]);

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

export const store = async (req: Request<{}, {}, TaskSchema>, res: Response): Promise<void> => {
    try {
        const task = await prisma.task.create({
            data: {
                name: req.body.name,
                description: req.body.description || null,
                status: req.body.status,
                priority: req.body.priority,
                tags: req.body.tags || null,
                startDate: req.body.startDate,
                dueDate: req.body.dueDate,
                points: Number(req.body.points) || 0,
                projectId: Number(req.body.projectId),
                authorId: Number(req.body.authorId),
                assignedUserId: Number(req.body.assignedUserId),
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
            }
        });
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        })
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;
        const task = await prisma.task.findFirst({
            where: {
                slug: slug
            },
        });
        res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: task
        })
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;
        const task = await prisma.task.update({
            where: {
                slug: slug
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
                projectId: req.body.projectId,
                authorId: req.body.authorId,
                assignedUserId: req.body.assignedUserId,
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
            }
        });
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        })
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug as string;
        const task = await prisma.task.delete({
            where: {
                slug: slug
            },
            include: {
                taskAssignments: true,
                comments: true,
                attachments: true
            }
        });
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        })
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}
