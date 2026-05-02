const { runInsuranceAgent } = require("./agents/insurance/insuranceAgent");
const { runInventoryAgent } = require("./agents/inventory/inventoryAgent");
const { runDischargeAgent } = require("./agents/dischargeAgent");
const { addLog } = require("./utils/logger");
const { askGemini } = require("./services/gemini.service");
const { getBrainRouterPrompt } = require("./prompts");

async function processQuery(query) {
  addLog("Brain Agent", `Analyzing user query with AI Router: "${query}"`, "Intent Detection");

  const prompt = getBrainRouterPrompt(query);
  let parsed;

  try {
    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (error) {
    addLog("Brain Agent", `AI Router failed: ${error.message}. Falling back to ambiguous.`, "Routing Error");
    return {
      error: "The AI router failed to understand your request. Please try rephrasing.",
      suggestedAgents: ["insurance", "inventory", "discharge"]
    };
  }

  addLog("Brain Agent", `AI Intent detected: ${parsed.intent}`, "Route Decision", query, parsed);

  switch (parsed.intent) {
    case "inventory":
      addLog("Brain Agent", "Routing to Inventory Agent.", "Route Task", query, "Inventory Agent");
      return await runInventoryAgent(query);

    case "insurance":
      addLog("Brain Agent", "Routing to Insurance Agent.", "Route Task", query, "Insurance Agent");
      return await runInsuranceAgent(query);

    case "discharge":
      addLog("Brain Agent", "Routing to Discharge Agent.", "Route Task", query, "Discharge Agent");
      const patientId = parsed.patientId || query;
      return await runDischargeAgent(patientId);

    case "unknown":
    default:
      addLog("Brain Agent", "Query intent is unrelated or ambiguous.", "Fallback", query);
      return {
        error: parsed.message || "I'm not sure which agent should handle this request. Please specify if it's about insurance, inventory, or patient discharge."
      };
  }
}

module.exports = { processQuery };
