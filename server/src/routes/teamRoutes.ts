import { Router } from "express";
import { index, show, store, update, destroy } from "../controllers/teamController.js";
import { validate, validateQuery } from "../middleware/validateRequest.js";
import teamSchema, { teamQuerySchema } from "../schemas/teamSchema.js";

const router = Router();

router.get("/", validateQuery(teamQuerySchema), index);
router.post("/", validate(teamSchema), store);
router.get("/:slug", show);
router.put("/:slug", validate(teamSchema), update);
router.delete("/:slug", destroy);

export default router;
