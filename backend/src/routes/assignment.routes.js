import express from "express";

import assignmentController from "../controllers/assignment.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/*
 * Admin / HR creates assignment
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "hr"),
  assignmentController.createAssignment
);

/*
 * Admin / HR views all assignments
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "hr"),
  assignmentController.getAllAssignments
);

/*
 * Mentor views assignments assigned to themselves
 */
router.get(
  "/my",
  authenticate,
  authorize("mentor"),
  assignmentController.getMyAssignments
);

/*
 * Student views own assignment
 */
router.get(
  "/student",
  authenticate,
  authorize("student"),
  assignmentController.getStudentAssignment
);

/*
 * View assignment detail
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "hr", "mentor", "student"),
  assignmentController.getAssignmentById
);

export default router;
