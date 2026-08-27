import prisma from "../../lib/prismaClient.js";
export const index = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
        });
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error,
        });
    }
};
//# sourceMappingURL=user.controller.js.map