const mongoose = require("mongoose");

const patientEventSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: [true, "Patient ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["admission", "discharge", "consultation", "surgery", "test"],
        message: "{VALUE} is not a valid event type",
      },
    },
    details: {
      type: String,
      required: [true, "Event details are required"],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Explicit indexing for better performance
patientEventSchema.index({ patient_id: 1 });
patientEventSchema.index({ type: 1 });

const PatientEvent = mongoose.model("PatientEvent", patientEventSchema);

module.exports = PatientEvent;
