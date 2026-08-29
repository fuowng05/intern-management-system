import express from "express";

import evaluationController from "../controllers/evaluation.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/*
 * Mentor creates evaluation
 */
router.post(
  "/",
  authenticate,
  authorize("mentor"),
  evaluationController.createEvaluation
);


/*
 * Admin / HR views all evaluations
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "hr"),
  evaluationController.getAllEvaluations
);


/*
 * Mentor views own evaluations
 */
router.get(
  "/my",
  authenticate,
  authorize("mentor"),
  evaluationController.getMentorEvaluations
);


/*
 * Student views own evaluation
 */
router.get(
  "/student",
  authenticate,
  authorize("student"),
  evaluationController.getStudentEvaluation
);


/*
 * View evaluation by application
 */
router.get(
  "/application/:applicationId",
  authenticate,
  authorize(
    "admin",
    "hr",
    "mentor",
    "student"
  ),
  evaluationController.getEvaluationByApplicationId
);


/*
 * Mentor updates criterion score
 */
router.patch(
  "/criteria/:criteriaId",
  authenticate,
  authorize("mentor"),
  evaluationController.updateCriteriaScore
);

export default router;