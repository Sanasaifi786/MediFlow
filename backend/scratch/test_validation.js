const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const { processQuery } = require("../brain");

async function test() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_DB_URI);
  console.log("Connected successfully.");

  console.log("\n--- Testing Discharge Agent with a non-existent patient ---");
  try {
    const result = await processQuery("Generate discharge summary for non_existent_patient");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }

  console.log("\n--- Testing Insurance Agent with a non-existent patient ---");
  try {
    const result = await processQuery("Check insurance for non_existent_patient");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }

  console.log("\n--- Testing Inventory Agent with a non-existent item ---");
  try {
    const result = await processQuery("Check stock for non_existent_medicine");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }

  console.log("\n--- Testing Inventory Update for a non-existent item directly ---");
  try {
    const { runInventoryAgent } = require("../agents/inventory/inventoryAgent");
    const result = await runInventoryAgent("Update stock of non_existent_medicine by 50", "update");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB.");
}

test().catch(console.error);
