require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { initializeTransporter } = require("./services/emailService");
const { startMedicationReminders, startFollowUpReminders } = require("./services/notificationScheduler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/treatments", require("./routes/treatmentRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "✓ Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`\n🏥 MediFlow Backend running on http://localhost:${PORT}`);

  await initializeTransporter();
  startMedicationReminders();
  startFollowUpReminders();
  console.log("✓ Email service and notification schedulers initialized");
});
