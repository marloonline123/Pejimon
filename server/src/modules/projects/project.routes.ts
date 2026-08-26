import { Router } from "express";
import { destroy, index, show, store, update } from "./project.controller.js";
import { validate, validateQuery } from "@/middleware/validateRequest.js";
import projectSchema, { projectQuerySchema } from "./project.schema.js";

const projectRouter = Router();

projectRouter.get("/", validateQuery(projectQuerySchema), index);
projectRouter.post("/", validate(projectSchema), store);
projectRouter.get("/:slug", show);
projectRouter.put("/:slug", validate(projectSchema), update);
projectRouter.delete("/:slug", destroy);

export default projectRouter;
