import { Router } from "express";
import { destroy, index, show, store, update } from "./project.controller.js";
import { validate, validateQuery } from "@/middleware/validateRequest.js";
import projectSchema, { projectQuerySchema } from "./project.schema.js";
import requireAuth from "@/middleware/auth.js";

const projectRouter = Router();

projectRouter.get("/", requireAuth, validateQuery(projectQuerySchema), index);
projectRouter.post("/", requireAuth, validate(projectSchema), store);
projectRouter.get("/:slug", requireAuth, show);
projectRouter.put("/:slug", requireAuth, validate(projectSchema), update);
projectRouter.delete("/:slug", requireAuth, destroy);

export default projectRouter;
