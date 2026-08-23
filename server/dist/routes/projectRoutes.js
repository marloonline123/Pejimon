import { Router } from "express";
import { destroy, index, show, store, update } from "../controllers/projectController.js";
import { validate } from "../middleware/validateRequest.js";
import projectSchema from "../schemas/projectSchema.js";
const projectRouter = Router();
projectRouter.get('/', index);
projectRouter.post('/', validate(projectSchema), store);
projectRouter.get('/:slug', show);
projectRouter.put('/:slug', validate(projectSchema), update);
projectRouter.delete('/:slug', destroy);
export default projectRouter;
//# sourceMappingURL=projectRoutes.js.map