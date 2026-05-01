const { askGemini } = require("../services/gemini.service");
const { getEntityExtractionPrompt } = require("../prompts");

module.exports = async function (input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  const prompt = getEntityExtractionPrompt(text);

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
