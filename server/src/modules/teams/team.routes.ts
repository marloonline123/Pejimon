import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
  getTeamMembers,
  getTeamProjects,
  getTeamTasks,
} from "@/modules/teams/team.controller.js";
import { validate, validateQuery } from "@/middleware/validateRequest.js";
import teamSchema, {
  teamQuerySchema,
  teamMemberQuerySchema,
  teamProjectQuerySchema,
  teamTaskQuerySchema,
} from "@/modules/teams/team.schema.js";
import requireAuth from "@/middleware/auth.js";

const router = Router();

router.get("/", requireAuth, validateQuery(teamQuerySchema), index);
router.post("/", requireAuth, validate(teamSchema), store);
router.get("/:slug", requireAuth, show);
router.get(
  "/:slug/members",
  requireAuth,
  validateQuery(teamMemberQuerySchema),
  getTeamMembers,
);
router.get(
  "/:slug/projects",
  requireAuth,
  validateQuery(teamProjectQuerySchema),
  getTeamProjects,
);
router.get(
  "/:slug/tasks",
  requireAuth,
  validateQuery(teamTaskQuerySchema),
  getTeamTasks,
);
router.put("/:slug", requireAuth, validate(teamSchema), update);
router.delete("/:slug", requireAuth, destroy);

export default router;
