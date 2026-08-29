import express from "express";
import authController from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get(
  "/me",
  authenticate,
  authController.me
);

router.get(
  "/test/student",
  authenticate,
  authorize("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Student access granted",
      user: req.user,
    });
  }
);

router.get(
  "/test/hr",
  authenticate,
  authorize("hr"),
  (req, res) => {
    res.json({
      success: true,
      message: "HR access granted",
      user: req.user,
    });
  }
);

router.get(
  "/test/admin",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted",
      user: req.user,
    });
  }
);

export default router;