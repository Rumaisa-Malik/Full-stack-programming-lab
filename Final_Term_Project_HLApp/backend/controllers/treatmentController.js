const Treatment = require("../models/Treatment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendFollowUpReminder } = require("../services/emailService");

exports.getAllTreatments = async (req, res) => {
  const treatments = await Treatment.find()
    .populate("patient", "userId")
    .populate("doctor", "specialty")
    .populate("appointment");

  res.json(treatments);
};

exports.getTreatmentById = async (req, res) => {
  const treatment = await Treatment.findById(req.params.id)
    .populate("patient")
    .populate("doctor")
    .populate("appointment");

  if (!treatment) {
    return res.status(404).json({ error: "Treatment not found" });
  }

  res.json(treatment);
};

exports.updateTreatmentStatus = async (req, res) => {
  const { status, phase } = req.body;

  if (status && !["active", "monitoring", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const treatment = await Treatment.findByIdAndUpdate(
    req.params.id,
    { status, phase },
    { new: true, runValidators: true }
  )
    .populate("patient")
    .populate("doctor")
    .populate("appointment");

  if (!treatment) {
    return res.status(404).json({ error: "Treatment not found" });
  }

  res.json(treatment);
};

exports.addVisit = async (req, res) => {
  const { date, checkupNotes, vitals } = req.body;

  if (!date || !checkupNotes) {
    return res.status(400).json({ error: "Date and checkupNotes are required" });
  }

  const treatment = await Treatment.findById(req.params.id);
  if (!treatment) {
    return res.status(404).json({ error: "Treatment not found" });
  }

  const visit = {
    date,
    checkupNotes,
    vitals: vitals || {},
    status: "completed",
  };

  treatment.visits.push(visit);
  await treatment.save();

  await treatment.populate([
    { path: "patient" },
    { path: "doctor" }
  ]);

  res.json({
    message: "Visit added successfully",
    treatment,
  });
};

exports.scheduleFollowUp = async (req, res) => {
  const { scheduledDate } = req.body;

  if (!scheduledDate) {
    return res.status(400).json({ error: "Scheduled date is required" });
  }

  const treatment = await Treatment.findById(req.params.id);
  if (!treatment) {
    return res.status(404).json({ error: "Treatment not found" });
  }

  const followUp = {
    scheduledDate,
    completed: false,
  };

  treatment.followUps.push(followUp);
  await treatment.save();

  await treatment.populate([
    { path: "patient" },
    { path: "doctor" }
  ]);

  // Send follow-up reminder email and notifications
  const patientDoc = await Patient.findById(treatment.patient).populate("userId");
  if (patientDoc && patientDoc.userId) {
    const previewUrl = await sendFollowUpReminder(
      patientDoc.userId.email,
      patientDoc.userId.name,
      scheduledDate
    );

    const followUpDate = new Date(scheduledDate).toLocaleDateString();

    // Email notification
    const emailNotif = new Notification({
      user: patientDoc.userId._id,
      type: "followup",
      channel: "email",
      message: `Follow-up appointment scheduled for ${followUpDate}`,
      emailPreviewUrl: previewUrl,
      relatedTreatment: treatment._id,
    });

    await emailNotif.save();

    // In-app notification
    const inAppNotif = new Notification({
      user: patientDoc.userId._id,
      type: "followup",
      channel: "in-app",
      message: `Follow-up appointment scheduled for ${followUpDate}`,
      relatedTreatment: treatment._id,
    });

    await inAppNotif.save();
  }

  res.json({
    message: "Follow-up scheduled successfully",
    treatment,
  });
};

exports.completeFollowUp = async (req, res) => {
  const { followUpIndex } = req.body;

  if (followUpIndex === undefined) {
    return res.status(400).json({ error: "followUpIndex is required" });
  }

  const treatment = await Treatment.findById(req.params.id);
  if (!treatment) {
    return res.status(404).json({ error: "Treatment not found" });
  }

  if (followUpIndex >= treatment.followUps.length) {
    return res.status(404).json({ error: "Follow-up not found" });
  }

  treatment.followUps[followUpIndex].completed = true;
  treatment.followUps[followUpIndex].completedDate = new Date();
  await treatment.save();

  await treatment.populate([
    { path: "patient" },
    { path: "doctor" }
  ]);

  res.json({
    message: "Follow-up marked as completed",
    treatment,
  });
};

exports.getPatientTreatments = async (req, res) => {
  const { patientId } = req.params;

  const treatments = await Treatment.find({ patient: patientId })
    .populate("doctor", "specialty")
    .populate("appointment")
    .sort({ createdAt: -1 });

  res.json(treatments);
};

exports.getDoctorPatientTreatments = async (req, res) => {
  const { doctorId, patientId } = req.params;

  const treatments = await Treatment.find({
    doctor: doctorId,
    patient: patientId,
  })
    .populate("appointment")
    .sort({ createdAt: -1 });

  res.json(treatments);
};
