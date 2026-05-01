module.exports = async function (context) {
  return {
    status: context.eligibility ? "approved" : "rejected",
    claim_amount: context.estimatedCost,
    confidence: Math.round(context.score.probability * 100),
    risk: context.score.risk,
    patient: context.patient,
  };
};
