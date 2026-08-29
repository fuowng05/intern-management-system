import express from "express";

import applicationController from "../controllers/application.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/*
 * Student submits application
 */
router.post(
  "/",
  authenticate,
  authorize("student"),
  applicationController.createApplication
);

/*
 * Student views own applications
 */
router.get(
  "/my",
  authenticate,
  authorize("student"),
  applicationController.getMyApplications
);

/*
 * Admin / HR views all applications
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "hr"),
  applicationController.getAllApplications
);

/*
 * Admin / HR views application detail
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "hr", "mentor", "student"),
  applicationController.getApplicationById
);

/*
 * Admin / HR approve or reject
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin", "hr"),
  applicationController.updateApplicationStatus
);

export default router;
