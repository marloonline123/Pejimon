import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import type { TeamSchema } from "../schemas/teamSchema.js";

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string | undefined;
        
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [teams, total] = await Promise.all([
            prisma.team.findMany({
                where,
                include: {
                    productOwner: true,
                    projectManager: true,
                    teamUsers: {
                        include: {
                            user: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { name: 'asc' }
            }),
            prisma.team.count({ where })
        ]);
        
        res.status(200).json({
            success: true,
            data: teams,
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
        });
    }
}

export const store = async (
    req: Request<{}, {}, TeamSchema>,
    res: Response,
): Promise<void> => {
    try {
        const team = await prisma.team.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
                productOwnerUserId: req.body.productOwnerUserId,
                projectManagerUserId: req.body.projectManagerUserId,
                ...(req.body.userIds &&
                    req.body.userIds.length > 0 && {
                    teamUsers: {
                        create: req.body.userIds.map((userId: number) => ({
                            user: { connect: { id: userId } },
                        })),
                    },
                }),
            },
            include: {
                productOwner: true,
                projectManager: true,
                teamUsers: {
                    include: { user: true }
                }
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
                productOwner: true,
                projectManager: true,
                teamUsers: {
                    include: { user: true }
                },
                projectTeams: {
                    include: { project: true }
                }
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
        
        if (req.body.userIds !== undefined) {
            await prisma.teamUser.deleteMany({
                where: {
                    team: { slug: slug },
                },
            });
        }

        const team = await prisma.team.update({
            where: {
                slug: slug,
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
                productOwnerUserId: req.body.productOwnerUserId,
                projectManagerUserId: req.body.projectManagerUserId,
                ...(req.body.userIds && {
                    teamUsers: {
                        create: req.body.userIds.map((userId: number) => ({
                            user: { connect: { id: userId } },
                        })),
                    },
                }),
            },
            include: {
                productOwner: true,
                projectManager: true,
                teamUsers: {
                    include: { user: true }
                }
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
        const team = await prisma.team.delete({
            where: {
                slug: slug,
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
