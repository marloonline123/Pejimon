import { Router } from "express";
import { index, me } from "../../modules/users/user.controller.js";
const router = Router();
router.get("/me", me);
router.get("/", index);
export default router;
//# sourceMappingURL=user.routes.js.map