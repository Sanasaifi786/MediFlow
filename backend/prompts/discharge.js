module.exports = {
  getValidationPrompt: (timelineData) => `
// Place your Gemini prompt for completeness checking here
// You can use ${JSON.stringify(timelineData)} to inject patient data
  `,

  getClinicalSummaryPrompt: (timelineData) => `
// Place your Gemini prompt specialized for doctors here
// Use ${JSON.stringify(timelineData)} to inject patient data
  `,

  getPatientSummaryPrompt: (clinicalSummary) => `
// Place your Gemini prompt specialized for patients here
// Use ${JSON.stringify(clinicalSummary)} to inject the clinical summary
  `
};
