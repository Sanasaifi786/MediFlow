const mongoose = require("mongoose");

const patientEventSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
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

const PatientEvent = mongoose.model("PatientEvent", patientEventSchema);

module.exports = PatientEvent;
