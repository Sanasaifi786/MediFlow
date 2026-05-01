const express = require("express");
const { processQuery } = require("../brain");
const { getLogs, clearLogs } = require("../utils/logger");

const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });
    
    const result = await processQuery(query);
    res.json(result);
  } catch (error) {
    console.error("Brain Error:", error);
    res.status(500).json({ error: "The brain failed to process the request" });
  }
});

router.get("/logs", (req, res) => {
  res.json({
    success: true,
    logs: getLogs()
  });
});

router.delete("/logs", (req, res) => {
  clearLogs();
  res.json({
    success: true,
    message: "Logs cleared successfully"
  });
});

module.exports = router;
