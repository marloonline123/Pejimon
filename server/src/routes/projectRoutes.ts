import { Router } from "express";
import { destroy, index, store, update } from "../controllers/projectController.js";
import { validate } from "../middleware/validateRequest.js";
import projectSchema from "../schemas/projectSchema.js";

const projectRouter = Router();

projectRouter.get('/', index);
projectRouter.post('/', validate(projectSchema), store);
projectRouter.put('/:id', validate(projectSchema), update);
projectRouter.delete('/:id', destroy);

export default projectRouter;