import auth from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
export default async function requireAuth(req, res, next) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            status: 401,
        });
    }
    res.locals.session = session;
    next();
}
//# sourceMappingURL=auth.js.map