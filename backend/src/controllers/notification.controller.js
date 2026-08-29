import notificationService from "../services/notification.service.js";

/*
 * Get current user's notifications
 */
const getMyNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getMyNotifications(
        req.user.userId
      );

    return res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
 * Get unread notifications
 */
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getUnreadNotifications(
        req.user.userId
      );

    return res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
 * Mark notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const notification =
      await notificationService.markAsRead(
        req.params.id,
        req.user.userId
      );

    return res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    const statusCode =
      error.message === "Notification not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/*
 * Mark all notifications as read
 */
const markAllAsRead = async (req, res) => {
  try {
    const result =
      await notificationService.markAllAsRead(
        req.user.userId
      );

    return res.json({
      success: true,
      message: "All notifications marked as read",
      data: {
        count: result.count,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};
