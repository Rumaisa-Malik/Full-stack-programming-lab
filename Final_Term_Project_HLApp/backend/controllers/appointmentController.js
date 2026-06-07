const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendAppointmentConfirmation, sendAppointmentBookingNotification } = require("../services/emailService");

exports.getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate({
      path: "patient",
      populate: {
        path: "userId",
        select: "name email"
      }
    })
    .populate({
      path: "doctor",
      select: "specialty"
    });

  res.json(appointments);
};

exports.getAppointmentById = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient")
    .populate("doctor");

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  res.json(appointment);
};

exports.bookAppointment = async (req, res) => {
  const { patientId, doctor, specialty, requestedDate, reason } = req.body;

  if (!patientId || !specialty || !requestedDate || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  // Validate doctor if provided
  let doctorId = null;
  if (doctor) {
    const doctorRecord = await Doctor.findById(doctor);
    if (!doctorRecord) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    doctorId = doctor;
  }

  const appointment = new Appointment({
    patient: patientId,
    doctor: doctorId,
    specialty,
    requestedDate,
    reason,
    status: "pending",
  });

  await appointment.save();
  await appointment.populate([
    { path: "patient", select: "userId" },
    { path: "doctor", select: "specialty userId" }
  ]);

  // Send notification to doctor if one was selected
  if (doctorId) {
    const doctor = await Doctor.findById(doctorId).populate("userId");
    const patientData = await Patient.findById(patientId).populate("userId");

    if (doctor && doctor.userId && patientData && patientData.userId) {
      // Send email notification
      const previewUrl = await sendAppointmentBookingNotification(
        doctor.userId.email,
        doctor.userId.name,
        {
          patientName: patientData.userId.name,
          patientEmail: patientData.userId.email,
          specialty,
          requestedDate,
          reason
        }
      );

      // Create email notification
      const emailNotif = new Notification({
        user: doctor.userId._id,
        type: "appointment",
        channel: "email",
        message: `New appointment booked: ${patientData.userId.name} for ${specialty}`,
        emailPreviewUrl: previewUrl,
        relatedAppointment: appointment._id,
      });

      await emailNotif.save();

      // Create in-app notification
      const inAppNotif = new Notification({
        user: doctor.userId._id,
        type: "appointment",
        channel: "in-app",
        message: `New appointment booked: ${patientData.userId.name} for ${specialty}`,
        relatedAppointment: appointment._id,
      });

      await inAppNotif.save();
    }
  }

  res.status(201).json(appointment);
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, doctorId } = req.body;

    if (!status || !["pending", "approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;

    // If appointment is completed, update associated treatment status
    if (status === "completed") {
      const treatment = await Treatment.findOne({ appointment: appointment._id });
      if (treatment) {
        treatment.status = "completed";
        await treatment.save();
      }
    }

    if (status === "approved" && doctorId) {
      const doctor = await Doctor.findById(doctorId).populate("userId");
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      appointment.doctor = doctorId;

      const treatment = new Treatment({
        appointment: appointment._id,
        patient: appointment.patient,
        doctor: doctorId,
        status: "active",
        phase: `Consultation for ${appointment.specialty}`,
      });

      await treatment.save();

      const patientDoc = await Patient.findById(appointment.patient);
      if (!patientDoc) {
        throw new Error("Patient not found for appointment");
      }

      if (!patientDoc.medicalHistory.includes(treatment._id)) {
        patientDoc.medicalHistory.push(treatment._id);
        await patientDoc.save();
      }

      if (!doctor.assignedPatients.includes(appointment.patient)) {
        doctor.assignedPatients.push(appointment.patient);
        await doctor.save();
      }

      patientDoc.assignedDoctor = doctorId;
      await patientDoc.save();

      const patientUser = await Patient.findById(appointment.patient).populate("userId");
      if (!patientUser || !patientUser.userId) {
        throw new Error("Patient or patient user not found");
      }

      // Send appointment confirmation email
      const previewUrl = await sendAppointmentConfirmation(
        patientUser.userId.email,
        patientUser.userId.name,
        {
          specialty: appointment.specialty,
          doctorName: doctor.userId.name,
          date: appointment.requestedDate,
          reason: appointment.reason,
        }
      );

      // Create email notification
      const emailNotif = new Notification({
        user: patientUser.userId._id,
        type: "appointment",
        channel: "email",
        message: `Your appointment for ${appointment.specialty} has been approved. Doctor: ${doctor.userId.name}`,
        emailPreviewUrl: previewUrl,
        relatedAppointment: appointment._id,
      });

      await emailNotif.save();

      // Create in-app notification
      const inAppNotif = new Notification({
        user: patientUser.userId._id,
        type: "appointment",
        channel: "in-app",
        message: `Your appointment for ${appointment.specialty} has been approved. Doctor: ${doctor.userId.name}`,
        relatedAppointment: appointment._id,
      });

      await inAppNotif.save();
    }

    await appointment.save();
    await appointment.populate("patient", "userId");
    await appointment.populate("doctor");

    res.json(appointment);
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  res.json({ message: "Appointment deleted successfully" });
};

exports.getPatientAppointments = async (req, res) => {
  const { patientId } = req.params;

  const appointments = await Appointment.find({ patient: patientId })
    .populate("doctor", "specialty")
    .sort({ createdAt: -1 });

  res.json(appointments);
};

// Get appointments for a specific doctor
exports.getDoctorAppointments = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Get the doctor to find assigned patients
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Get appointments for this doctor (approved) or for this doctor's patients (all statuses)
    const appointments = await Appointment.find({
      $or: [
        { doctor: doctorId }, // Appointments assigned to this doctor
        { patient: { $in: doctor.assignedPatients } } // Appointments for doctor's assigned patients
      ]
    })
      .populate({
        path: "patient",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("doctor", "specialty")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ error: error.message });
  }
};
