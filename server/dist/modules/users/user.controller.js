import prisma from "../../lib/prismaClient.js";
import auth from "../../config/auth.js";
import { toUserResponse } from "./user.mapper.js";
export const index = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { deletedAt: null },
            orderBy: { name: "asc" },
        });
        res.status(200).json({
            success: true,
            data: users.map(toUserResponse),
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
export const me = async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });
        if (!session?.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: session,
        });
    }
    catch (error) {
        console.error("User Me Error:", error);
        res.status(500).json({
            success: false,
            message: error?.message || "Internal server error",
            error: error,
        });
    }
};
//# sourceMappingURL=user.controller.js.map