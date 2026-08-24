import { Router } from "express";
import { index, show, store, update, destroy } from "../controllers/teamController.js";
import { validateData } from "../middlewares/validationMiddleware.js";
import teamSchema from "../schemas/teamSchema.js";

const router = Router();

router.get("/", index);
router.post("/", validateData(teamSchema), store);
router.get("/:slug", show);
router.put("/:slug", validateData(teamSchema), update);
router.delete("/:slug", destroy);

export default router;
