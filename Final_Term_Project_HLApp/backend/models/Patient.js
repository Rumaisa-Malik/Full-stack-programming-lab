const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      required: true,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    medicalHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
