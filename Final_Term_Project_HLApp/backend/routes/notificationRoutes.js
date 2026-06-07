const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  getUserNotifications,
  getNotificationById,
  markAsRead,
  deleteNotification,
  createNotification,
  getUnreadCount,
} = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getAllNotifications);
router.get("/user/:userId", protect, getUserNotifications);
router.get("/user/:userId/unread", protect, getUnreadCount);
router.get("/:id", protect, getNotificationById);

router.post("/", protect, authorize("admin", "doctor"), createNotification);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;
