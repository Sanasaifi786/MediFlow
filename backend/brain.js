const { runInsuranceAgent } = require("./agents/insurance/insuranceAgent");
const { runInventoryAgent } = require("./agents/inventory/inventoryAgent");
const { runDischargeAgent } = require("./agents/dischargeAgent");

async function processQuery(query) {
  const lowerQuery = query.toLowerCase();

  // Simple routing logic based on keywords
  if (
    lowerQuery.includes("inventory") ||
    lowerQuery.includes("stock") ||
    lowerQuery.includes("medicine") ||
    lowerQuery.includes("supplies")
  ) {
    return await runInventoryAgent(query);
  }

  if (
    lowerQuery.includes("insurance") ||
    lowerQuery.includes("policy") ||
    lowerQuery.includes("claim") ||
    lowerQuery.includes("coverage")
  ) {
    return await runInsuranceAgent(query);
  }

  if (
    lowerQuery.includes("discharge") ||
    lowerQuery.includes("summary") ||
    lowerQuery.includes("report")
  ) {
    // Extract a patientId if mentioned in query (e.g. P12453)
    const match = query.match(/P\d+/i) || query.match(/patient\s+([a-zA-Z0-9]+)/i);
    const patientId = match ? match[1] || match[0] : query;
    return await runDischargeAgent(patientId);
  }

  return {
    error:
      "I'm not sure which agent should handle this request. Please specify if it's about insurance, inventory, or discharge.",
    suggestedAgents: ["insurance", "inventory", "discharge"],
  };
}

module.exports = { processQuery };
