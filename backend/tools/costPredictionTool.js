const { askGemini } = require("../services/gemini.service");
const { getCostPredictionPrompt } = require("../prompts");

module.exports = async function ({ disease, age }) {
  const prompt = getCostPredictionPrompt(disease, age);

  const raw = await askGemini(prompt);

  try {
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.estimated_cost;
  } catch {
    return 20000; // fallback
  }
};
