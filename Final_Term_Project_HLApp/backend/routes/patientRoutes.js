const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient,
  deletePatient,
  assignDoctorToPatient,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "doctor"), getAllPatients);
router.get("/by-user/:userId", protect, getPatientByUserId);
router.get("/:id", protect, getPatientById);

router.post("/", protect, authorize("admin"), createPatient);
router.patch("/:id", protect, authorize("admin", "patient"), updatePatient);
router.delete("/:id", protect, authorize("admin"), deletePatient);

router.post("/assign-doctor", protect, authorize("admin"), assignDoctorToPatient);

module.exports = router;
