const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAllPatients = async (req, res) => {
  const patients = await Patient.find()
    .populate("userId", "name email")
    .populate("assignedDoctor", "specialty");

  res.json(patients);
};

exports.getPatientById = async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate("userId", "name email")
    .populate("assignedDoctor", "specialty")
    .populate("medicalHistory");

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.json(patient);
};

// Get patient by User ID (for logged-in patient)
exports.getPatientByUserId = async (req, res) => {
  const patient = await Patient.findOne({ userId: req.params.userId })
    .populate("userId", "name email")
    .populate("assignedDoctor", "specialty")
    .populate("medicalHistory");

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.json(patient);
};

exports.createPatient = async (req, res) => {
  try {
    const { name, email, password, age, gender, contact, bloodGroup } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !age || !gender || !contact || !bloodGroup) {
      return res.status(400).json({ error: "All fields are required (name, email, password, age, gender, contact, bloodGroup)" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Validate blood group enum
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ error: `Blood group must be one of: ${validBloodGroups.join(', ')}` });
    }

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'patient',
    });
    await user.save();

    // Create Patient record
    const patient = new Patient({
      userId: user._id,
      age: parseInt(age),
      gender,
      contact,
      bloodGroup,
    });

    await patient.save();
    await patient.populate("userId", "name email");

    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const { name, email, password, age, gender, contact, bloodGroup } = req.body;

    // Update Patient-specific fields if provided
    if (age) patient.age = parseInt(age);
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (bloodGroup) {
      const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({ error: `Blood group must be one of: ${validBloodGroups.join(', ')}` });
      }
      patient.bloodGroup = bloodGroup;
    }

    await patient.save();

    // Update User record if name/email/password provided
    const user = await User.findById(patient.userId);
    if (!user) {
      return res.status(404).json({ error: "Associated user not found" });
    }

    if (name) user.name = name;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }
    if (password) {
      const bcrypt = require('bcrypt');
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Return updated patient with populated references
    const updatedPatient = await Patient.findById(patient._id)
      .populate("userId", "name email")
      .populate("assignedDoctor", "specialty");
    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.json({ message: "Patient deleted successfully" });
};

exports.assignDoctorToPatient = async (req, res) => {
  const { patientId, doctorId } = req.body;

  if (!patientId || !doctorId) {
    return res.status(400).json({ error: "patientId and doctorId are required" });
  }

  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  patient.assignedDoctor = doctorId;
  await patient.save();

  if (!doctor.assignedPatients.includes(patientId)) {
    doctor.assignedPatients.push(patientId);
    await doctor.save();
  }

  const updatedPatient = await patient
    .populate("userId", "name email")
    .populate("assignedDoctor", "specialty");

  res.json({
    message: "Doctor assigned to patient successfully",
    patient: updatedPatient,
  });
};
