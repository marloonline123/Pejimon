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

const router = Router();

router.get("/", validateQuery(teamQuerySchema), index);
router.post("/", validate(teamSchema), store);
router.get("/:slug", show);
router.put("/:slug", validate(teamSchema), update);
router.delete("/:slug", destroy);

export default router;
