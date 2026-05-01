module.exports = async function (timelineData) {
  // Later replace with Gemini prompt specialized for doctors
  return `
CLINICAL SUMMARY:
Patient ${timelineData.name}, a ${timelineData.age}yo male, presented with ${timelineData.admissionReason}. 
PMHx is significant for ${timelineData.history.join(", ")}.
Hospital course was uncomplicated. Serial troponins were ${timelineData.labResults[0].result} and ECG showed ${timelineData.labResults[1].result}.
Patient was managed medically with ${timelineData.medicationsGiven.join(", ")}.
Discharge diagnosis: Non-cardiac chest pain.
Plan: Follow up with PCP in 1 week. Continue home medications.
  `.trim();
};
