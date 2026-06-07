const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        schedule: {
          type: String,
          required: true,
        },
        durationDays: {
          type: Number,
          required: true,
        },
      },
    ],
    notes: String,
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
