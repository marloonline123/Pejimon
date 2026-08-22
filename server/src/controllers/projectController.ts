import type { Request, Response } from "express";
import prisma from "../prismaClient.js";
import type { ProjectSchema } from "../schemas/projectSchema.js";

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects = await prisma.project.findMany();
        
        res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: projects
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

export const store = async (req: Request<{}, {}, ProjectSchema>, res: Response): Promise<void> => {
    try {
        const project = await prisma.project.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
            }
        });
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
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
        const project = await prisma.project.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                slug: req.body.name.toLowerCase().replace(/\s/g, "-"),
            }
        });
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
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
        const project = await prisma.project.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: project
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