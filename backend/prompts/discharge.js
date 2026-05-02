module.exports = {
  getValidationPrompt: (timelineData) => `
    You are a Senior Medical Registrar. Review the following patient timeline data for a discharge report.
    Data: ${JSON.stringify(timelineData)}

    Check if the following critical fields are present:
    1. Patient Name and ID
    2. Date of Admission and Discharge
    3. Final Diagnosis
    4. Treatment/Surgeries performed
    5. Follow-up instructions

    Return a JSON object:
    {
      "isComplete": true/false,
      "missingFields": ["list of missing fields if any"],
      "validationMessage": "A summary of data health"
    }
    Return ONLY raw JSON.
  `,

  getClinicalSummaryPrompt: (timelineData) => `
    You are a Chief Medical Officer. Generate a professional Clinical Discharge Summary for a fellow doctor.
    Patient Data: ${JSON.stringify(timelineData)}

    Focus on:
    - Concise clinical course
    - Complications (if any)
    - Medication changes
    - Key lab results
    - Post-discharge plan

    Use professional medical terminology. Format with clear headings.
  `,

  getPatientSummaryPrompt: (clinicalSummary) => `
    You are a compassionate Patient Liaison. Translate the following clinical summary into simple, easy-to-understand language for the patient.
    Clinical Note: ${JSON.stringify(clinicalSummary)}

    Instructions:
    - Avoid complex jargon (e.g., use "high blood pressure" instead of "hypertension").
    - Use a friendly, encouraging tone.
    - Highlight clearly: "What you need to do" and "When to call us".
    
    Structure with bullet points for readability.
  `
};
