const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorByUserId,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialty,
  getDoctorAssignedPatients,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllDoctors);
router.get("/by-user/:userId", protect, getDoctorByUserId);
router.get("/specialty/:specialty", getDoctorsBySpecialty);
router.get("/:id/patients", protect, getDoctorAssignedPatients);
router.get("/:id", getDoctorById);

router.post("/", protect, authorize("admin"), createDoctor);
router.patch("/:id", protect, authorize("admin", "doctor"), updateDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;
