const Insurance = require("../models/insuranceModel");
const Patient = require("../models/patientModel");
const mongoose = require("mongoose");

module.exports = async function (input) {
  const name = typeof input === 'object' && input.name ? input.name : (typeof input === 'string' ? input : null);
  const policyNo = typeof input === 'object' && input.policyNo ? input.policyNo : null;
  
  try {
    let policy = null;

    // 1. Try matching by direct policy ID if a valid ObjectId is provided
    if (policyNo && mongoose.Types.ObjectId.isValid(policyNo)) {
      policy = await Insurance.findById(policyNo);
      if (policy) {
        policy = policy.toObject();
        const patient = await Patient.findOne({
          $or: [
            { patient_id: policy.patient_id },
            { _id: mongoose.Types.ObjectId.isValid(policy.patient_id) ? policy.patient_id : new mongoose.Types.ObjectId() }
          ]
        });
        policy.patient_id = patient;
      }
    }

    // 2. Otherwise match by patient name
    if (!policy && name && typeof name === 'string') {
      const patient = await Patient.findOne({ name: new RegExp(name, "i") });
      if (patient) {
        policy = await Insurance.findOne({
          $or: [
            { patient_id: patient.patient_id },
            { patient_id: patient._id.toString() }
          ]
        });
        if (policy) {
          policy = policy.toObject();
          policy.patient_id = patient;
        }
      }
    }

    if (policy) {
      return {
        policy_id: policy._id,
        policy_type: policy.policy_type,
        past_claims: policy.past_claims,
        coverage_limit: 200000,
        patient_name: policy.patient_id?.name || 'Unknown'
      };
    } else {
      return { error: `Insurance policy not found.` };
    }
  } catch (error) {
    console.error("Error in policyTool:", error.message);
    return { error: error.message };
  }
};
