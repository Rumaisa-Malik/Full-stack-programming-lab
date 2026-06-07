const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["appointment", "medication", "followup"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["email", "sms-sim", "in-app"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    emailPreviewUrl: String,
    relatedAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    relatedPrescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    relatedTreatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
