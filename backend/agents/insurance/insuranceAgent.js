const { askGemini } = require("../../services/gemini.service");
const tools = require("./tools");
const reportTool = require("../../tools/reportTool");

async function runInsuranceAgent(query) {
  let context = {};
  let steps = [];

  for (let i = 0; i < 6; i++) {
    const prompt = `
You are an insurance AI agent. Your goal is to extract information, check the user's policy, estimate costs, verify eligibility, and calculate a risk score before outputting the final result.

Available tools:
- entityExtractionTool: Extracts patient name, age, and disease. Input: user query text.
- policyTool: Gets policy info. Input: { "name": "patient name" }.
- costPredictionTool: Estimates cost. Input: { "disease": "disease name", "age": number }.
- eligibilityTool: Checks if cost is covered. Input: { "policy": { coverage_limit: number }, "cost": number }.
- scoringTool: Calculates risk. Input: { "age": number, "disease": "name", "policy": { policy_type: string, past_claims: number } }.

Current context:
${JSON.stringify(context)}

User query:
${query}

Decide next step. If all tools have been used and you have eligibility and scoring, return action "final".

Return STRICT JSON:
{
  "thought": "...",
  "action": "tool_name OR final",
  "input": {} or string
}
`;

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
