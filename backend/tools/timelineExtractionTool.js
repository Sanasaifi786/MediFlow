const Patient = require("../models/patientModel");
const mongoose = require("mongoose");

module.exports = async function (patientId) {
  try {
    let patient = null;
    
    // Attempt to fetch patient from database if patientId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(patientId)) {
      patient = await Patient.findById(patientId);
    } else if (typeof patientId === 'string') {
      // Try searching by name case-insensitive exact or regex match
      patient = await Patient.findOne({ name: new RegExp(`^${patientId}$`, "i") });
      if (!patient) {
        patient = await Patient.findOne({ name: new RegExp(patientId, "i") });
      }
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

    // Instead of falling back to mock data:
    return {
      error: `Patient with ID or name "${patientId}" not found in our database.`
    };
  } catch (error) {
    console.error("Error in timelineExtractionTool:", error.message);
    throw error;
  }
};
