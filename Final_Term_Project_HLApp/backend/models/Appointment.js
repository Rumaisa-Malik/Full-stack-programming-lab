const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    specialty: {
      type: String,
      enum: [
        "Dentistry",
        "Orthopedics",
        "Neurology",
        "Cardiology",
        "Pulmonology",
        "Gastroenterology",
      ],
      required: true,
    },
    requestedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
