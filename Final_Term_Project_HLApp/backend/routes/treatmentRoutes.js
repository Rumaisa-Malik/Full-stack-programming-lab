const express = require("express");
const router = express.Router();
const {
  getAllTreatments,
  getTreatmentById,
  updateTreatmentStatus,
  addVisit,
  scheduleFollowUp,
  completeFollowUp,
  getPatientTreatments,
  getDoctorPatientTreatments,
} = require("../controllers/treatmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "doctor"), getAllTreatments);
router.get("/:id", protect, getTreatmentById);
router.get("/patient/:patientId", protect, getPatientTreatments);
router.get("/doctor/:doctorId/patient/:patientId", protect, getDoctorPatientTreatments);

router.patch("/:id/status", protect, authorize("admin", "doctor"), updateTreatmentStatus);
router.post("/:id/visit", protect, authorize("admin", "doctor"), addVisit);
router.post("/:id/followup", protect, authorize("admin", "doctor"), scheduleFollowUp);
router.patch("/:id/followup/complete", protect, authorize("admin", "doctor"), completeFollowUp);

module.exports = router;
