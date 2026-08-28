import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "@/modules/organizations/organization.controller.js";
import { validate, validateQuery } from "@/middleware/validateRequest.js";
import { uploadOrganizationLogo } from "@/middleware/upload.js";
import organizationSchema, {
  organizationQuerySchema,
} from "@/modules/organizations/organization.schema.js";

const router = Router();

router.get("/", validateQuery(organizationQuerySchema), index);
router.post(
  "/",
  uploadOrganizationLogo.single("logo"),
  validate(organizationSchema),
  store,
);
router.get("/:slug", show);
router.put(
  "/:slug",
  uploadOrganizationLogo.single("logo"),
  validate(organizationSchema),
  update,
);
router.delete("/:slug", destroy);

export default router;
