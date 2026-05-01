const { askGemini } = require("../services/gemini.service");

module.exports = async function (input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  const prompt = `
Extract the patient's name, age, and disease from the following text.
If any are missing, return null for that field.

Return ONLY valid JSON in this format:
{
  "name": "string or null",
  "age": "number or null",
  "disease": "string or null"
}

Text: ${JSON.stringify(text)}
  `;

  try {
    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return {
      name: "Unknown",
      age: 30,
      disease: "unknown"
    };
  }
};
