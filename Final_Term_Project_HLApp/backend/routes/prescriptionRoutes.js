const express = require("express");
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByTreatment,
  getPatientMedicalHistory,
} = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "doctor"), getAllPrescriptions);
router.get("/:id", protect, getPrescriptionById);
router.get("/patient/:patientId", protect, getPrescriptionsByPatient);
router.get("/treatment/:treatmentId", protect, getPrescriptionsByTreatment);
router.get("/history/:patientId", protect, getPatientMedicalHistory);

router.post("/", protect, authorize("admin", "doctor"), createPrescription);
router.patch("/:id", protect, authorize("admin", "doctor"), updatePrescription);
router.delete("/:id", protect, authorize("admin"), deletePrescription);

module.exports = router;
