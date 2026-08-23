import { Router } from "express";
import { destroy, index, show, store, update } from "../controllers/taskController.js";
import { validate } from "../middleware/validateRequest.js";
import taskSchema from "../schemas/taskSchema.js";

const taskRouter = Router();

taskRouter.get('/', index);
taskRouter.post('/', validate(taskSchema), store);
taskRouter.get('/:slug', show);
taskRouter.put('/:slug', validate(taskSchema), update);
taskRouter.delete('/:slug', destroy);

export default taskRouter;
