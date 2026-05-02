const express = require("express");
const Patient = require("../models/patientModel");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @desc    Add a new patient
// @route   POST /patients
// @access  Protected
router.post("/", protect, async (req, res) => {
  try {
    const { name, age, disease, policy_number, patient_id } = req.body;

    if (!name || !age || !disease) {
      return res.status(400).json({ message: "Name, age, and disease are required" });
    }

    const patient = await Patient.create({
      name,
      age,
      disease,
      policy_number,
      patient_id
    });

    return res.status(201).json({ success: true, patient });
  } catch (error) {
    console.error("Patient addition error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get all patients
// @route   GET /patients
// @access  Protected
router.get("/", protect, async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error("Fetch patients error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
