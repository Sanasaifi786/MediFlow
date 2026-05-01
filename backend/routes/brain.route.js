const express = require("express");
const { processQuery } = require("../brain");

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

module.exports = router;
