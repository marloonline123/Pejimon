import { Router } from "express";
import { getPlans, subscribe, getMySubscription, } from "../../modules/subscriptions/subscription.controller.js";
import { validate } from "../../middleware/validateRequest.js";
import subscribeSchema from "../../modules/subscriptions/subscription.schema.js";
const router = Router();
router.get("/plans", getPlans);
router.post("/subscribe", validate(subscribeSchema), subscribe);
router.get("/my", getMySubscription);
export default router;
//# sourceMappingURL=subscription.routes.js.map