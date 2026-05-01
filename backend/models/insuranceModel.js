const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    policy_type: {
      type: String,
      required: [true, "Policy type is required"],
      trim: true,
    },
    past_claims: {
      type: Number,
      default: 0,
      min: [0, "Past claims cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;
