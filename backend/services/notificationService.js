const Notification = require("../models/Notification");

async function createNotification({
  userId,
  type,
  title,
  body,
  metadata = {},
}) {
  return Notification.create({
    user_id: userId,
    type,
    title,
    body,
    metadata,
  });
}

async function listNotificationsForUser(userId, limit = 20) {
  return Notification.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

async function markNotificationRead(notificationId, userId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user_id: userId },
    { $set: { read_at: new Date() } },
    { new: true }
  );
}

module.exports = {
  createNotification,
  listNotificationsForUser,
  markNotificationRead,
};
