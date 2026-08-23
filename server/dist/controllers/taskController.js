import prisma from "../prismaClient.js";
export const index = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
export const store = async (req, res) => {
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
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
export const show = async (req, res) => {
    try {
        const slug = req.params.slug;
        const task = await prisma.task.findFirst({
            where: {
                slug: slug
            },
        });
        res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: task
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
export const update = async (req, res) => {
    try {
        const slug = req.params.slug;
        const task = await prisma.task.update({
            where: {
                slug: slug
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                priority: req.body.priority,
                tags: req.body.tags,
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
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
export const destroy = async (req, res) => {
    try {
        const slug = req.params.slug;
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
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
//# sourceMappingURL=taskController.js.map