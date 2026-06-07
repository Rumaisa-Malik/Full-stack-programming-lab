const Notification = require("../models/Notification");

exports.getAllNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  const notifications = await Notification.find({ user: userId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

exports.getNotificationById = async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate("user", "name email");

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  res.json(notification);
};

exports.markAsRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  ).populate("user", "name email");

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  res.json(notification);
};

exports.deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  res.json({ message: "Notification deleted successfully" });
};

exports.createNotification = async (req, res) => {
  const {
    userId,
    type,
    channel,
    message,
    emailPreviewUrl,
    relatedAppointment,
    relatedPrescription,
    relatedTreatment,
  } = req.body;

  if (!userId || !type || !channel || !message) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const notification = new Notification({
    user: userId,
    type,
    channel,
    message,
    emailPreviewUrl: emailPreviewUrl || null,
    relatedAppointment: relatedAppointment || null,
    relatedPrescription: relatedPrescription || null,
    relatedTreatment: relatedTreatment || null,
  });

  await notification.save();
  await notification.populate("user", "name email");

  res.status(201).json(notification);
};

exports.getUnreadCount = async (req, res) => {
  const { userId } = req.params;

  const count = await Notification.countDocuments({ user: userId, read: false });

  res.json({ unreadCount: count });
};
