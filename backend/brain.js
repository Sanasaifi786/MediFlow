const { runInsuranceAgent } = require("./agents/insurance/insuranceAgent");
const { runInventoryAgent } = require("./agents/inventory/inventoryAgent");
const { runDischargeAgent } = require("./agents/dischargeAgent");
const { addLog } = require("./utils/logger");

async function processQuery(query) {
  const lowerQuery = query.toLowerCase();

  addLog("Brain Agent", `Analyzing user query: "${query}"`, "Intent Detection");

  // Simple routing logic based on keywords
  if (
    lowerQuery.includes("inventory") ||
    lowerQuery.includes("stock") ||
    lowerQuery.includes("medicine") ||
    lowerQuery.includes("supplies")
  ) {
    addLog("Brain Agent", "Intent recognized as inventory management.", "Route Task", query, "Inventory Agent");
    return await runInventoryAgent(query);
  }

  if (
    lowerQuery.includes("insurance") ||
    lowerQuery.includes("policy") ||
    lowerQuery.includes("claim") ||
    lowerQuery.includes("coverage")
  ) {
    addLog("Brain Agent", "Intent recognized as insurance processing.", "Route Task", query, "Insurance Agent");
    return await runInsuranceAgent(query);
  }

  if (
    lowerQuery.includes("discharge") ||
    lowerQuery.includes("summary") ||
    lowerQuery.includes("report")
  ) {
    addLog("Brain Agent", "Intent recognized as patient discharge management.", "Route Task", query, "Discharge Agent");
    // Extract a patientId if mentioned in query (e.g. P12453)
    const match = query.match(/P\d+/i) || query.match(/patient\s+([a-zA-Z0-9]+)/i);
    const patientId = match ? match[1] || match[0] : query;
    return await runDischargeAgent(patientId);
  }

  addLog("Brain Agent", "Query intent is ambiguous. Asking user for clarification.", "Fallback", query);
  return {
    error:
      "I'm not sure which agent should handle this request. Please specify if it's about insurance, inventory, or discharge.",
    suggestedAgents: ["insurance", "inventory", "discharge"],
  };
}

module.exports = { processQuery };
