const Patient = require("../models/patientModel");
const mongoose = require("mongoose");

module.exports = async function (patientId) {
  try {
    // Attempt to fetch patient from database if patientId is a valid ObjectId
    let patient = null;
    if (mongoose.Types.ObjectId.isValid(patientId)) {
      patient = await Patient.findById(patientId);
    }
    
    if (patient) {
      return {
        patientId: patient._id,
        name: patient.name,
        age: patient.age,
        admissionReason: patient.disease,
        history: [], // Would normally come from another collection or field
        medicationsGiven: [],
        labResults: [],
        dischargeDate: new Date().toISOString()
      };
    }

    // Fallback to mock data if not found (for development)
    return {
      patientId: patientId,
      name: "John Doe (Mock)",
      age: 65,
      admissionReason: "Chest pain",
      history: ["Hypertension", "Type 2 Diabetes"],
      medicationsGiven: ["Aspirin", "Metoprolol", "Insulin"],
      labResults: [
        { test: "Troponin", result: "Normal" },
        { test: "ECG", result: "Sinus Tachycardia" }
      ],
      dischargeDate: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in timelineExtractionTool:", error.message);
    throw error;
  }
};
