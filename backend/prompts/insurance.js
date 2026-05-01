module.exports = {
  getEntityExtractionPrompt: (text) => `
Extract the patient's name, age, and disease from the following text.
If any are missing, return null for that field.

Return ONLY valid JSON in this format:
{
  "name": "string or null",
  "age": "number or null",
  "disease": "string or null"
}

Text: ${JSON.stringify(text)}
  `,

  getCostPredictionPrompt: (disease, age) => `
Estimate treatment cost in INR.

Return ONLY JSON:
{
  "estimated_cost": number
}

Disease: ${disease}
Age: ${age}
  `,

  getInsuranceAgentLoopPrompt: (context, query) => `
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
  `
};
