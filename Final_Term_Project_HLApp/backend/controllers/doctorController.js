const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate("userId", "name email");
  res.json(doctors);
};

exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate("userId", "name email")
    .populate("assignedPatients", "userId");

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  res.json(doctor);
};

// Get doctor by User ID (for logged-in doctor)
exports.getDoctorByUserId = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.params.userId })
    .populate("userId", "name email")
    .populate("assignedPatients", "userId");

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  res.json(doctor);
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, qualifications, experienceYears, bio, availableSlots } =
      req.body;

    // Validate all required fields
    if (!name || !email || !password || !specialty || !qualifications || !experienceYears || !bio) {
      return res.status(400).json({ error: "All fields are required (name, email, password, specialty, qualifications, experienceYears, bio)" });
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

    // Validate specialty enum
    const validSpecialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Dentistry', 'Pulmonology', 'Gastroenterology'];
    if (!validSpecialties.includes(specialty)) {
      return res.status(400).json({ error: `Specialty must be one of: ${validSpecialties.join(', ')}` });
    }

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'doctor',
    });
    await user.save();

    // Create Doctor record
    const doctor = new Doctor({
      userId: user._id,
      specialty,
      qualifications,
      experienceYears: parseInt(experienceYears),
      bio,
      availableSlots: availableSlots || [],
    });

    await doctor.save();
    await doctor.populate("userId", "name email");

    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const { name, email, password, specialty, qualifications, experienceYears, bio } = req.body;

    // Update Doctor-specific fields if provided
    if (specialty) {
      const validSpecialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Dentistry', 'Pulmonology', 'Gastroenterology'];
      if (!validSpecialties.includes(specialty)) {
        return res.status(400).json({ error: `Specialty must be one of: ${validSpecialties.join(', ')}` });
      }
      doctor.specialty = specialty;
    }
    if (qualifications) doctor.qualifications = qualifications;
    if (experienceYears) doctor.experienceYears = parseInt(experienceYears);
    if (bio) doctor.bio = bio;

    await doctor.save();

    // Update User record if name/email/password provided
    const user = await User.findById(doctor.userId);
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
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Return updated doctor with populated user
    const updatedDoctor = await Doctor.findById(doctor._id).populate("userId", "name email");
    res.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  res.json({ message: "Doctor deleted successfully" });
};

exports.getDoctorsBySpecialty = async (req, res) => {
  const { specialty } = req.params;

  const doctors = await Doctor.find({ specialty }).populate("userId", "name email");

  res.json(doctors);
};

exports.getDoctorAssignedPatients = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Get all treatments for this doctor
    const Treatment = require("../models/Treatment");
    const treatments = await Treatment.find({ doctor: id });

    // Get unique patients who have treatments with this doctor
    const patientIds = [...new Set(treatments.map(t => t.patient.toString()))];

    // Populate patient data with userId
    const Patient = require("../models/Patient");
    const patients = await Patient.find({ _id: { $in: patientIds } }).populate({
      path: "userId",
      select: "name email"
    });

    res.json(patients);
  } catch (error) {
    console.error('Error fetching doctor assigned patients:', error);
    res.status(500).json({ error: error.message });
  }
};
