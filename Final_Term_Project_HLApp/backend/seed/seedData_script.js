require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { doctors: doctorsData, patients: patientsData, admins: adminsData, DEFAULT_PASSWORD } = require("./seedData");

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mediflow";
    await mongoose.connect(mongoURI);
    console.log("✓ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    console.log("✓ Cleared existing data");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    // ==================== CREATE ADMIN USER ====================
    console.log("\n📝 Creating admin user...");
    const adminData = adminsData[0];
    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      passwordHash: hashedPassword,
      role: "admin",
    });
    console.log(`✓ Admin created: ${adminUser.email}`);

    // ==================== CREATE DOCTOR USERS & DOCTORS ====================
    console.log("\n📝 Creating doctors (15)...");
    const doctorUsers = [];
    const createdDoctors = [];

    for (let doctorData of doctorsData) {
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        passwordHash: hashedPassword,
        role: "doctor",
      });

      const doctor = await Doctor.create({
        userId: user._id,
        specialty: doctorData.specialty,
        qualifications: doctorData.qualifications,
        experienceYears: doctorData.experienceYears,
        bio: doctorData.bio,
        availableSlots: doctorData.availableSlots,
      });

      doctorUsers.push({ user, doctor });
      createdDoctors.push(doctor);
    }

    console.log(`✓ Created ${createdDoctors.length} doctors across 6 specialties`);

    // ==================== CREATE PATIENT USERS & PATIENTS ====================
    console.log("\n📝 Creating patients (15)...");
    const patientUsers = [];
    const createdPatients = [];

    for (let patientData of patientsData) {
      const user = await User.create({
        name: patientData.name,
        email: patientData.email,
        passwordHash: hashedPassword,
        role: "patient",
      });

      const patient = await Patient.create({
        userId: user._id,
        age: patientData.age,
        gender: patientData.gender,
        contact: patientData.contact,
        bloodGroup: patientData.bloodGroup,
      });

      patientUsers.push({ user, patient });
      createdPatients.push(patient);
    }

    console.log(`✓ Created ${createdPatients.length} patients`);

    // ==================== ASSIGN DOCTORS TO PATIENTS ====================
    console.log("\n📝 Assigning doctors to patients...");

    for (let i = 0; i < createdPatients.length; i++) {
      const patient = createdPatients[i];
      const assignedDoctor = createdDoctors[i % createdDoctors.length];

      patient.assignedDoctor = assignedDoctor._id;
      await patient.save();

      if (!assignedDoctor.assignedPatients.includes(patient._id)) {
        assignedDoctor.assignedPatients.push(patient._id);
        await assignedDoctor.save();
      }
    }

    console.log(`✓ Assigned doctors to all patients`);

    // ==================== SUMMARY ====================
    console.log("\n" + "=".repeat(60));
    console.log("✓ DATABASE SEEDING COMPLETED");
    console.log("=".repeat(60));
    console.log("\n📊 SEEDED DATA SUMMARY:");
    console.log(`   • Admins: 1`);
    console.log(`   • Doctors: 15 (spread across 6 specialties)`);
    console.log(`   • Patients: 15`);
    console.log(`   • Default Password: ${DEFAULT_PASSWORD}`);
    console.log("\n🔐 DEMO LOGIN CREDENTIALS:");
    console.log(`   Admin:      admin@mediflow.dev / ${DEFAULT_PASSWORD}`);
    console.log(`   Doctor:     ayesha.khan@mediflow.dev / ${DEFAULT_PASSWORD}`);
    console.log(`   Patient:    ali.raza@example.com / ${DEFAULT_PASSWORD}`);
    console.log("\n" + "=".repeat(60) + "\n");

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
