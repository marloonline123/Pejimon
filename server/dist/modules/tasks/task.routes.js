import { Router } from "express";
import { destroy, index, show, store, update, } from "../../modules/tasks/task.controller.js";
import { validate, validateQuery } from "../../middleware/validateRequest.js";
import taskSchema, { taskQuerySchema } from "./task.schema.js";
import requireAuth from "../../middleware/auth.js";
const taskRouter = Router();
taskRouter.get("/", requireAuth, validateQuery(taskQuerySchema), index);
taskRouter.post("/", requireAuth, validate(taskSchema), store);
taskRouter.get("/:slug", requireAuth, show);
taskRouter.put("/:slug", requireAuth, validate(taskSchema), update);
taskRouter.delete("/:slug", requireAuth, destroy);
export default taskRouter;
//# sourceMappingURL=task.routes.js.map