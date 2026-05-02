const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: [true, "Patient ID is required"],
      index: true,
    },
    policy_type: {
      type: String,
      required: [true, "Policy type is required"],
      trim: true,
    },
    policy_number: {
      type: String,
      required: [true, "Policy number is required"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Explicit indexing on patient_id for faster lookups
insuranceSchema.index({ patient_id: 1 });

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;
