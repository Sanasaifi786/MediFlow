module.exports = async function (context) {
  const isEligible = context.eligibilityTool;
  const estimatedCost = context.costPredictionTool;
  const score = context.scoringTool || { probability: 0, risk: "unknown" };
  const patient = context.entityExtractionTool || {};

  return {
    status: isEligible ? "approved" : "rejected",
    claim_amount: estimatedCost,
    confidence: Math.round(score.probability * 100),
    risk: score.risk,
    patient: patient,
  };
};
