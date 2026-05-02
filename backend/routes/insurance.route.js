const express = require("express");
const { runInsuranceAgent } = require("../agents/insurance/insuranceAgent");
const Insurance = require("../models/insuranceModel");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const policies = await Insurance.find({}).populate("patient_id", "name age disease");
    res.json({
      success: true,
      policies
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch policies" });
  }
});

router.post("/process", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    const result = await runInsuranceAgent(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Agent failed",
    });
  }
});
// 🧪 TEST ROUTE (debug mode)
router.get("/test", async (req, res) => {
  try {
    const sampleQuery =
      "Process insurance claim for 45 year old diabetic patient Ravi Kumar";

    const result = await runInsuranceAgent(sampleQuery);

    res.json({
      success: true,
      message: "Test route executed successfully",
      input: sampleQuery,
      output: result,
    });
  } catch (error) {
    console.error("Test Route Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
module.exports = router;
