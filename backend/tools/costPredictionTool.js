const { askGemini } = require("../services/gemini.service");

module.exports = async function ({ disease, age }) {
  const prompt = `
Estimate treatment cost in INR.

Return ONLY JSON:
{
  "estimated_cost": number
}

Disease: ${disease}
Age: ${age}
`;

  const raw = await askGemini(prompt);

  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.estimated_cost;
  } catch {
    return 20000; // fallback
  }
};
