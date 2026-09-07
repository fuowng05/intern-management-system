import prisma from "../config/prisma.js";

/*
 * Create notification
 */
const createNotification = async ({
  userId,
  title,
  message,
}) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
};

/*
 * Get notifications of current user
 */
const getMyNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/*
 * Get unread notifications
 */
const getUnreadNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/*
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
  const notification =
    await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.userId !== userId) {
    throw new Error(
      "You do not have permission to access this notification"
    );
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

/*
 * Mark all notifications as read
 */
const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export default {
  createNotification,
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};
