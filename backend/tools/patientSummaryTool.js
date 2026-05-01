module.exports = async function (clinicalSummary) {
  // Later replace with Gemini prompt specialized for patients (translation of clinical summary)
  return `
DISCHARGE INSTRUCTIONS FOR PATIENT:
Hello John,
You were admitted to the hospital for chest pain. We ran some tests, including an ECG and blood work, and thankfully everything looked normal.
We gave you some medications during your stay (Aspirin, Metoprolol, and Insulin). 

What you need to do next:
- Please schedule an appointment with your primary care doctor in one week.
- Continue taking your regular medications at home.
- If your chest pain returns or gets worse, please come back to the emergency room immediately.
  `.trim();
};
