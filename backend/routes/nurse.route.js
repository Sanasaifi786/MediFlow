const express = require("express");
const PatientEvent = require("../models/patientEventModel");
const Patient = require("../models/patientModel");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @desc    Log a new patient event
// @route   POST /nurse/log-event
// @access  Protected (Nurse or Admin)
router.post("/log-event", protect, async (req, res) => {
  try {
    const { patientId, type, details } = req.body;

    if (!patientId || !type || !details) {
      return res.status(400).json({ message: "Missing required fields: patientId, type, or details" });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newEvent = await PatientEvent.create({
      patient_id: patientId,
      type,
      details,
      timestamp: Date.now()
    });

    res.status(201).json({
      success: true,
      message: "Event logged successfully",
      event: newEvent
    });
  } catch (error) {
    console.error("Nurse Logging Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc    Get all patients (for selection)
// @route   GET /nurse/patients
// @access  Protected
router.get("/patients", protect, async (req, res) => {
  try {
    const patients = await Patient.find({}).select("name age disease");
    res.status(200).json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
