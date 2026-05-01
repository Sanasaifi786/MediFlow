const mongoose = require("mongoose");

const patientEventSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

const PatientEvent = mongoose.model("PatientEvent", patientEventSchema);

module.exports = PatientEvent;
