const Prescription = require("../models/Prescription");
const Treatment = require("../models/Treatment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendMedicationReminder } = require("../services/emailService");

exports.getAllPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate("patient", "userId")
    .populate("doctor", "specialty")
    .populate("treatment")
    .populate("appointment");

  res.json(prescriptions);
};

exports.getPrescriptionById = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate("patient")
    .populate("doctor")
    .populate("treatment")
    .populate("appointment");

  if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
  }

  res.json(prescription);
};

exports.createPrescription = async (req, res) => {
  const { treatmentId, appointmentId, patientId, doctorId, medications, notes } = req.body;

  if (!treatmentId || !appointmentId || !patientId || !doctorId || !medications || !Array.isArray(medications)) {
    return res.status(400).json({ error: "All fields are required" });
  }

  for (let med of medications) {
    if (!med.name || !med.dosage || !med.schedule || !med.durationDays) {
      return res.status(400).json({ error: "Each medication must have name, dosage, schedule, and durationDays" });
    }
  }

  // Resolve Doctor._id if doctorId is actually User._id
  let resolvedDoctorId = doctorId;
  const Doctor = require("../models/Doctor");

  // Check if doctorId looks like a User._id by checking if it's a valid Doctor
  const doctorCheck = await Doctor.findById(doctorId);
  if (!doctorCheck) {
    // Try to find by userId
    const doctorByUser = await Doctor.findOne({ userId: doctorId });
    if (doctorByUser) {
      resolvedDoctorId = doctorByUser._id;
    } else {
      return res.status(400).json({ error: "Doctor not found" });
    }
  }

  const prescription = new Prescription({
    treatment: treatmentId,
    appointment: appointmentId,
    patient: patientId,
    doctor: resolvedDoctorId,
    medications,
    notes: notes || "",
    issuedAt: new Date(),
  });

  await prescription.save();
  await prescription.populate([
    { path: "patient", select: "userId" },
    { path: "doctor", select: "specialty" },
    { path: "treatment" },
    { path: "appointment" }
  ]);

  // Send medication reminder email
  const patientDoc = await Patient.findById(patientId).populate("userId");
  if (patientDoc && patientDoc.userId) {
    const previewUrl = await sendMedicationReminder(
      patientDoc.userId.email,
      patientDoc.userId.name,
      { medications }
    );

    // Create email notification
    const emailNotif = new Notification({
      user: patientDoc.userId._id,
      type: "medication",
      channel: "email",
      message: `New prescription issued: ${medications.map((m) => m.name).join(", ")}`,
      emailPreviewUrl: previewUrl,
      relatedPrescription: prescription._id,
    });

    await emailNotif.save();

    // Create in-app notification
    const inAppNotif = new Notification({
      user: patientDoc.userId._id,
      type: "medication",
      channel: "in-app",
      message: `New prescription issued: ${medications.map((m) => m.name).join(", ")}`,
      relatedPrescription: prescription._id,
    });

    await inAppNotif.save();
  }

  res.status(201).json(prescription);
};

exports.updatePrescription = async (req, res) => {
  const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("patient", "userId")
    .populate("doctor", "specialty")
    .populate("treatment")
    .populate("appointment");

  if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
  }

  res.json(prescription);
};

exports.deletePrescription = async (req, res) => {
  const prescription = await Prescription.findByIdAndDelete(req.params.id);

  if (!prescription) {
    return res.status(404).json({ error: "Prescription not found" });
  }

  res.json({ message: "Prescription deleted successfully" });
};

exports.getPrescriptionsByPatient = async (req, res) => {
  const { patientId } = req.params;

  const prescriptions = await Prescription.find({ patient: patientId })
    .populate("doctor", "specialty")
    .populate("treatment")
    .populate("appointment")
    .sort({ issuedAt: -1 });

  res.json(prescriptions);
};

exports.getPrescriptionsByTreatment = async (req, res) => {
  const { treatmentId } = req.params;

  const prescriptions = await Prescription.find({ treatment: treatmentId })
    .populate("patient", "userId")
    .populate("doctor", "specialty")
    .populate("appointment")
    .sort({ issuedAt: -1 });

  res.json(prescriptions);
};

exports.getPatientMedicalHistory = async (req, res) => {
  const { patientId } = req.params;

  const treatments = await Treatment.find({ patient: patientId })
    .populate("doctor", "specialty")
    .populate("appointment")
    .sort({ createdAt: -1 });

  const prescriptions = await Prescription.find({ patient: patientId })
    .populate("doctor", "specialty")
    .sort({ issuedAt: -1 });

  res.json({
    treatments,
    prescriptions,
  });
};
