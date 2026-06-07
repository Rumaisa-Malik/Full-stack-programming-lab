const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    qualifications: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    bio: {
      type: String,
      required: true,
    },
    availableSlots: {
      type: [String],
      default: [],
    },
    assignedPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
