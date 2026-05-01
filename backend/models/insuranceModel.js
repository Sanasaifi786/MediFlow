const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    policy_type: {
      type: String,
      required: true,
    },
    past_claims: {
      type: Number,
      default: 0,
    },
  }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;
