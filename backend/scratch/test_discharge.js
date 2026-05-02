const mongoose = require("mongoose");
const { runDischargeAgent } = require("../agents/dischargeAgent");

async function test() {
  try {
    await mongoose.connect("mongodb+srv://shivanshlavaniya456_db_user:aRfwbLs5RuqHVgUE@serverv1.x6rjnny.mongodb.net/MediMind?appName=ServerV1");
    console.log("Connected to MongoDB for testing");

    const result = await runDischargeAgent("PAT-1005");
    console.log("Result:", result);
    process.exit(0);
  } catch (err) {
    console.error("Error during test:", err);
    process.exit(1);
  }
}

test();
