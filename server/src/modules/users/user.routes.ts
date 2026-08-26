import { Router } from "express";
import { index } from "@/modules/users/user.controller.js";

const router = Router();

router.get("/", index);

export default router;
