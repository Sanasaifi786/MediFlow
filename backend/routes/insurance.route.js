const express = require("express");
const { runInsuranceAgent } = require("../agents/insuranceAgent");

const router = express.Router();

router.post("/process", async (req, res) => {
  try {
    const result = await runInsuranceAgent(req.body.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Agent failed" });
  }
});

module.exports = router;
