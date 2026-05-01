const { getValidationPrompt } = require("../prompts");

module.exports = async function (timelineData) {
  const prompt = getValidationPrompt(timelineData);
  // Later execute this prompt with Gemini
  const missingFields = [];
  
  if (!timelineData.dischargeDate) missingFields.push("dischargeDate");
  if (!timelineData.medicationsGiven || timelineData.medicationsGiven.length === 0) missingFields.push("medicationsGiven");

  return {
    isComplete: missingFields.length === 0,
    missingFields: missingFields,
    validationMessage: missingFields.length === 0 
      ? "All required medical data is present." 
      : `Missing required data: ${missingFields.join(", ")}`
  };
};
