const { askGemini } = require("../../services/gemini.service");
const tools = require("./tools");
const reportTool = require("../../tools/reportTool");
const { getInsuranceAgentLoopPrompt } = require("../../prompts");
const { addLog } = require("../../utils/logger");

async function runInsuranceAgent(query) {
  let context = {};
  let steps = [];

  addLog("Insurance Agent", `Starting insurance analysis for query: "${query}"`, "Formulate Goal", query);

  for (let i = 0; i < 6; i++) {
    const prompt = getInsuranceAgentLoopPrompt(context, query);

    let raw;
    try {
      raw = await askGemini(prompt);
    } catch (err) {
      addLog("Insurance Agent", `Gemini API error: ${err.message}`, "API Error");
      return { error: "LLM error", message: err.message };
    }

    let parsed;
    try {
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      addLog("Insurance Agent", "Invalid response from Gemini model", "Parsing Error", raw);
      return { error: "Invalid LLM response", raw };
    }

    steps.push(parsed.thought);
    addLog("Insurance Agent", parsed.thought, `Execute Step ${i + 1}`, parsed.action, parsed.input);

    if (parsed.action === "final") {
      const finalReport = await reportTool(context);
      addLog("Insurance Agent", "Generating final decision report.", "Complete Task", null, finalReport);
      return {
        result: finalReport,
        steps,
      };
    }

    const tool = tools[parsed.action];

    if (!tool) {
      addLog("Insurance Agent", `Unknown tool invoked: ${parsed.action}`, "Execution Error", parsed.action);
      return { error: "Unknown tool", action: parsed.action };
    }

    const result = await tool(parsed.input);
    addLog("Insurance Agent", `Invoked ${parsed.action} successfully.`, "Tool Response", parsed.input, result);

    context[parsed.action] = result;
  }

  addLog("Insurance Agent", "Maximum agent reasoning iterations reached.", "Incomplete Task");
  return {
    error: "Max steps reached",
    context,
    steps,
  };
}

module.exports = { runInsuranceAgent };
