const { askGemini } = require("../../services/gemini.service");
const tools = require("./tools");
const reportTool = require("../../tools/reportTool");
const { getInsuranceAgentLoopPrompt } = require("../../prompts");

async function runInsuranceAgent(query) {
  let context = {};
  let steps = [];

  for (let i = 0; i < 6; i++) {
    const prompt = getInsuranceAgentLoopPrompt(context, query);

    let raw;
    try {
      raw = await askGemini(prompt);
    } catch (err) {
      return { error: "LLM error", message: err.message };
    }

    let parsed;
    try {
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return { error: "Invalid LLM response", raw };
    }

    steps.push(parsed.thought);

    if (parsed.action === "final") {
      return {
        result: await reportTool(context),
        steps,
      };
    }

    const tool = tools[parsed.action];

    if (!tool) {
      return { error: "Unknown tool", action: parsed.action };
    }

    const result = await tool(parsed.input);

    context[parsed.action] = result;
  }

  return {
    error: "Max steps reached",
    context,
    steps,
  };
}

module.exports = { runInsuranceAgent };
