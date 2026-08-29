import express from "express";

import notificationController from "../controllers/notification.controller.js";

import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * Current user views notifications
 */
router.get(
  "/",
  authenticate,
  notificationController.getMyNotifications
);

/*
 * Current user views unread notifications
 */
router.get(
  "/unread",
  authenticate,
  notificationController.getUnreadNotifications
);

/*
 * Mark one notification as read
 */
router.patch(
  "/:id/read",
  authenticate,
  notificationController.markAsRead
);

/*
 * Mark all notifications as read
 */
router.patch(
  "/read-all",
  authenticate,
  notificationController.markAllAsRead
);

export default router;
