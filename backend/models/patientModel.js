const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Patient age is required"],
      min: [0, "Age cannot be negative"],
    },
    disease: {
      type: String,
      required: [true, "Disease description is required"],
      trim: true,
    },
    policy_number: {
      type: String,
      trim: true,
    },
    patient_id: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.pre("save", async function (next) {
  if (!this.patient_id) {
    this.patient_id = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

// Add index for faster searches
patientSchema.index({ name: 1 });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
