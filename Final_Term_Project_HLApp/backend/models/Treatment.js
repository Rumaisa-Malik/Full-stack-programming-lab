const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: ["active", "monitoring", "completed"],
      default: "active",
    },
    phase: {
      type: String,
      default: "Ongoing consultation",
    },
    visits: [
      {
        date: Date,
        checkupNotes: String,
        vitals: {
          bloodPressure: String,
          heartRate: Number,
          temperature: Number,
          oxygenLevel: Number,
        },
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled"],
          default: "scheduled",
        },
      },
    ],
    followUps: [
      {
        scheduledDate: Date,
        completed: {
          type: Boolean,
          default: false,
        },
        completedDate: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
