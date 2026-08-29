import express from "express";
import * as periodController from "../controllers/period.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  periodController.getAll
);

router.get(
  "/:id",
  authenticate,
  periodController.getById
);

router.post(
  "/",
  authenticate,
  authorize("admin", "hr"),
  periodController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "hr"),
  periodController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  periodController.remove
);

export default router;
