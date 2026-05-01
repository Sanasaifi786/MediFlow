const { runInsuranceAgent } = require("./agents/insuranceAgent");
const { runInventoryAgent } = require("./agents/inventory/inventoryAgent");

async function processQuery(query) {
  const lowerQuery = query.toLowerCase();

  // Simple routing logic based on keywords
  if (lowerQuery.includes("inventory") || 
      lowerQuery.includes("stock") || 
      lowerQuery.includes("medicine") || 
      lowerQuery.includes("supplies")) {
    return await runInventoryAgent(query);
  }

  if (lowerQuery.includes("insurance") || 
      lowerQuery.includes("policy") || 
      lowerQuery.includes("claim") || 
      lowerQuery.includes("coverage")) {
    return await runInsuranceAgent(query);
  }

  return {
    error: "I'm not sure which agent should handle this request. Please specify if it's about insurance or inventory.",
    suggestedAgents: ["insurance", "inventory"]
  };
}

module.exports = { processQuery };
