const express = require("express");
const router = express.Router();
const { runDischargeAgent } = require("../agents/dischargeAgent");

router.post("/generate", async (req, res) => {
  try {
    const { patientId } = req.body;
    
    if (!patientId) {
      return res.status(400).json({ error: "patientId is required" });
    }

    const result = await runDischargeAgent(patientId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in Discharge Agent:", error);
    res.status(500).json({ error: "Failed to process discharge summary" });
  }
});

module.exports = router;
