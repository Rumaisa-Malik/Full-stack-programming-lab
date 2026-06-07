const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getPatientAppointments,
  getDoctorAppointments,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "doctor"), getAllAppointments);
router.get("/doctor/:doctorId", protect, getDoctorAppointments);
router.get("/patient/:patientId", protect, getPatientAppointments);
router.get("/:id", protect, getAppointmentById);

router.post("/", protect, authorize("patient"), bookAppointment);
router.patch("/:id/status", protect, authorize("admin", "doctor"), updateAppointmentStatus);
router.delete("/:id", protect, authorize("admin"), deleteAppointment);

module.exports = router;
