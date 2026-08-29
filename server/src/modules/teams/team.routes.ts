import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "@/modules/teams/team.controller.js";
import { validate, validateQuery } from "@/middleware/validateRequest.js";
import teamSchema, { teamQuerySchema } from "@/modules/teams/team.schema.js";
import requireAuth from "@/middleware/auth.js";

const router = Router();

router.get("/", requireAuth, validateQuery(teamQuerySchema), index);
router.post("/", requireAuth, validate(teamSchema), store);
router.get("/:slug", requireAuth, show);
router.put("/:slug", requireAuth, validate(teamSchema), update);
router.delete("/:slug", requireAuth, destroy);

export default router;
