import { Router } from "express";
import { index } from "../controllers/userController.js";

const router = Router();

router.get("/", index);

export default router;
