const { checkStock, updateStock, getLowStock } = require("./tools");
const { SYSTEM_PROMPT } = require("./prompts");

async function runInventoryAgent(query, action = "check") {
  console.log(`[InventoryAgent] Processing query: ${query} with action: ${action}`);
  
  let result;
  
  // Basic routing within the agent based on action or query keywords
  if (action === "update" || query.toLowerCase().includes("update") || query.toLowerCase().includes("add") || query.toLowerCase().includes("remove") || query.toLowerCase().includes("deduct")) {
    const amountMatch = query.match(/(-?\d+)/);
    let amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    
    // If the query implies deduction, ensure amount is negative
    if (query.toLowerCase().includes("remove") || query.toLowerCase().includes("deduct")) {
      amount = -Math.abs(amount);
    }
    
    // Naive item extraction: first word that isn't a command
    const words = query.split(" ");
    const itemName = words.find(w => !["update", "add", "remove", "deduct", "stock", "by", "of"].includes(w.toLowerCase()) && isNaN(w));
    
    result = await updateStock(itemName || "Unknown", amount);
  } else if (action === "low_stock" || query.toLowerCase().includes("low") || query.toLowerCase().includes("alert")) {
    result = await getLowStock();
  } else {
    // Default to check stock
    const words = query.split(" ");
    const itemName = words.find(w => !["check", "stock", "for", "item"].includes(w.toLowerCase()));
    result = await checkStock(itemName || "Unknown");
  }

  return {
    agent: "InventoryAgent",
    query: query,
    timestamp: new Date().toISOString(),
    data: result
  };
}

module.exports = { runInventoryAgent };
