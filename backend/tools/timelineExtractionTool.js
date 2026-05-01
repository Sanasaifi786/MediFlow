module.exports = async function (patientId) {
  // Later replace with Gemini or Database fetch
  return {
    patientId: patientId,
    name: "John Doe",
    age: 65,
    admissionReason: "Chest pain",
    history: ["Hypertension", "Type 2 Diabetes"],
    medicationsGiven: ["Aspirin", "Metoprolol", "Insulin"],
    labResults: [
      { test: "Troponin", result: "Normal" },
      { test: "ECG", result: "Sinus Tachycardia" }
    ],
    dischargeDate: new Date().toISOString()
  };
};
