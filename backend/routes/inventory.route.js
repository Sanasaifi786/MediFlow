const express = require("express");
const { runInventoryAgent } = require("../agents/inventory/inventoryAgent");

const router = express.Router();

router.post("/process", async (req, res) => {
  try {
    const { query, action } = req.body;
    const result = await runInventoryAgent(query, action);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Inventory Agent failed" });
  }
});

module.exports = router;
