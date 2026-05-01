const Insurance = require("../models/insuranceModel");
const Patient = require("../models/patientModel");

module.exports = async function (input) {
  const name = typeof input === 'object' && input.name ? input.name : input;
  
  try {
    // If we have a name, try to find the patient first
    if (name && typeof name === 'string') {
      const patient = await Patient.findOne({ name: new RegExp(name, "i") });
      if (patient) {
        const policy = await Insurance.findOne({ patient_id: patient._id });
        if (policy) {
          return {
            policy_type: policy.policy_type,
            past_claims: policy.past_claims,
            coverage_limit: 200000 // Still static as it's not in the requested schema
          };
        }
      }
    }

    // Default fallback policy / Mock data
    return {
      policy_type: "standard",
      coverage_limit: 200000,
      past_claims: 0,
    };
  } catch (error) {
    console.error("Error in policyTool:", error.message);
    return { error: error.message };
  }
};
