/**
 * Deterministic seed data for MediFlow.
 *
 * Usage: import these arrays in your seed script, hash the passwords with
 * bcrypt, create the User docs first, then create Doctor/Patient docs linked
 * by userId. Every account uses the password: Passw0rd!  (change in prod)
 *
 * Run with: npm run seed
 *
 * Guarantees the graded data constraint: 15 doctors + 15 patients,
 * spread across the 6 specialties.
 */

const DEFAULT_PASSWORD = "Passw0rd!"; // hash with bcrypt before saving

const SPECIALTIES = [
  "Dentistry",
  "Orthopedics",
  "Neurology",
  "Cardiology",
  "Pulmonology",
  "Gastroenterology",
];

// ----------------------------- DOCTORS (15) -----------------------------
const doctors = [
  // Cardiology (3)
  { name: "Dr. Bilal Ahmed",      email: "bilal.ahmed@mediflow.dev",     specialty: "Cardiology",       qualifications: "MBBS, FCPS Cardiology",  experienceYears: 12, bio: "Expert in interventional cardiology and heart disease management.",                    availableSlots: ["09:00", "11:00", "15:30"] },
  { name: "Dr. Imran Qureshi",    email: "imran.qureshi@mediflow.dev",   specialty: "Cardiology",       qualifications: "MBBS, MD Cardiology",    experienceYears: 12, bio: "Heart-failure management and echocardiography specialist.",                          availableSlots: ["09:00", "11:00", "15:30"] },
  { name: "Dr. Zara Iqbal",       email: "zara.iqbal@mediflow.dev",      specialty: "Cardiology",       qualifications: "MBBS, FCPS Cardiology",  experienceYears: 14, bio: "Preventive cardiology and coronary artery disease management.",                       availableSlots: ["08:30", "10:30", "14:00"] },

  // Dentistry (3)
  { name: "Dr. Ayesha Khan",      email: "ayesha.khan@mediflow.dev",     specialty: "Dentistry",        qualifications: "BDS, MSc Prosthodontics", experienceYears: 11, bio: "Cosmetic and restorative dentistry specialist.",                                   availableSlots: ["09:00", "10:00", "11:00", "14:00"] },
  { name: "Dr. Leila Patel",      email: "leila.patel@mediflow.dev",     specialty: "Dentistry",        qualifications: "BDS, MDS Pediatric Dent",experienceYears: 9,  bio: "Pediatric and preventive dental care.",                                                 availableSlots: ["09:00", "10:30", "13:00", "15:00"] },
  { name: "Dr. Omer Khan",        email: "omer.khan@mediflow.dev",       specialty: "Dentistry",        qualifications: "BDS, FCPS Orthodontics", experienceYears: 8,  bio: "Orthodontic alignment and smile correction.",                                          availableSlots: ["09:30", "11:30", "15:00", "16:00"] },

  // Orthopedics (3)
  { name: "Dr. Sara Malik",       email: "sara.malik@mediflow.dev",      specialty: "Orthopedics",      qualifications: "MBBS, MS Orthopedics",   experienceYears: 14, bio: "Joint replacement and sports-injury rehabilitation expert.",                     availableSlots: ["08:00", "10:00", "13:00"] },
  { name: "Dr. Karim Khan",       email: "karim.khan@mediflow.dev",      specialty: "Orthopedics",      qualifications: "MBBS, FCPS Orthopedics", experienceYears: 10, bio: "Spine and trauma surgery specialist.",                                           availableSlots: ["09:00", "12:00", "14:30", "16:30"] },
  { name: "Dr. Maria Santos",     email: "maria.santos@mediflow.dev",    specialty: "Orthopedics",      qualifications: "MBBS, MS Orthopedics",   experienceYears: 11, bio: "Knee and ligament repair specialist.",                                        availableSlots: ["08:30", "11:00", "13:30", "16:00"] },

  // Neurology (2)
  { name: "Dr. Hassan Ali",       email: "hassan.ali@mediflow.dev",      specialty: "Neurology",        qualifications: "MBBS, FCPS Neurology",   experienceYears: 13, bio: "Epilepsy and stroke management specialist.",                               availableSlots: ["10:00", "11:00", "15:00"] },
  { name: "Dr. Noor Abbas",       email: "noor.abbas@mediflow.dev",      specialty: "Neurology",        qualifications: "MBBS, MD Neurology",     experienceYears: 9,  bio: "Movement disorders and neuromuscular condition specialist.",                        availableSlots: ["10:30", "12:00", "15:30"] },

  // Pulmonology (2)
  { name: "Dr. Fatima Sheikh",    email: "fatima.sheikh@mediflow.dev",   specialty: "Pulmonology",      qualifications: "MBBS, FCPS Pulmonology", experienceYears: 11, bio: "Respiratory and lung disease expert.",                                         availableSlots: ["10:00", "12:00", "14:00"] },
  { name: "Dr. Ravi Kumar",       email: "ravi.kumar@mediflow.dev",      specialty: "Pulmonology",      qualifications: "MBBS, MD Pulmonology",   experienceYears: 10, bio: "Asthma and COPD management specialist.",                                     availableSlots: ["08:00", "11:30", "16:00"] },

  // Gastroenterology (2)
  { name: "Dr. Ahmed Hassan",     email: "ahmed.hassan@mediflow.dev",    specialty: "Gastroenterology", qualifications: "MBBS, FCPS Gastro",      experienceYears: 12, bio: "Endoscopy and GI disease specialist.",                                      availableSlots: ["09:00", "10:30", "13:00"] },
  { name: "Dr. Aisha Khan",       email: "aisha.khan@mediflow.dev",      specialty: "Gastroenterology", qualifications: "MBBS, MD Gastro",        experienceYears: 11, bio: "Hepatology and liver disease expert.",                                      availableSlots: ["10:00", "12:30", "15:00", "16:30"] },
];

// ----------------------------- PATIENTS (15) -----------------------------
const patients = [
  { name: "Ali Raza",             email: "ali.raza@example.com",         age: 34, gender: "Male",   contact: "+92-300-1234567", bloodGroup: "B+"  },
  { name: "Maria Yousaf",         email: "maria.yousaf@example.com",     age: 28, gender: "Female", contact: "+92-301-2345678", bloodGroup: "O+"  },
  { name: "Hassan Abbas",         email: "hassan.abbas@example.com",     age: 45, gender: "Male",   contact: "+92-302-3456789", bloodGroup: "A+"  },
  { name: "Fatima Khan",          email: "fatima.khan@example.com",      age: 31, gender: "Female", contact: "+92-303-4567890", bloodGroup: "AB+" },
  { name: "Ahmed Ali",            email: "ahmed.ali@example.com",        age: 52, gender: "Male",   contact: "+92-304-5678901", bloodGroup: "O-"  },
  { name: "Sara Malik",           email: "sara.malik@example.com",       age: 26, gender: "Female", contact: "+92-305-6789012", bloodGroup: "B-"  },
  { name: "Leila Ahmed",          email: "leila.ahmed@example.com",      age: 39, gender: "Female", contact: "+92-306-7890123", bloodGroup: "A-"  },
  { name: "Zara Khan",            email: "zara.khan@example.com",        age: 22, gender: "Female", contact: "+92-307-8901234", bloodGroup: "O+"  },
  { name: "Karim Hassan",         email: "karim.hassan@example.com",     age: 60, gender: "Male",   contact: "+92-308-9012345", bloodGroup: "AB-" },
  { name: "Noor Iqbal",           email: "noor.iqbal@example.com",       age: 35, gender: "Female", contact: "+92-309-0123456", bloodGroup: "B+"  },
  { name: "Ravi Sharma",          email: "ravi.sharma@example.com",      age: 41, gender: "Male",   contact: "+92-310-1234567", bloodGroup: "A+"  },
  { name: "Priya Patel",          email: "priya.patel@example.com",      age: 29, gender: "Female", contact: "+92-311-2345678", bloodGroup: "O+"  },
  { name: "James Wilson",         email: "james.wilson@example.com",     age: 48, gender: "Male",   contact: "+92-312-3456789", bloodGroup: "B+"  },
  { name: "Emma Johnson",         email: "emma.johnson@example.com",     age: 33, gender: "Female", contact: "+92-313-4567890", bloodGroup: "A-"  },
  { name: "John Smith",           email: "john.smith@example.com",       age: 27, gender: "Male",   contact: "+92-314-5678901", bloodGroup: "O-"  },
];

// One admin account for management/demo.
const admins = [
  { name: "System Admin", email: "admin@mediflow.dev" },
];

module.exports = { SPECIALTIES, DEFAULT_PASSWORD, doctors, patients, admins };
