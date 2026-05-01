module.exports = async function ({ age, disease, policy }) {
  let score = 0.5;

  if (policy.policy_type === "premium") score += 0.2;
  if (age < 50) score += 0.1;
  if (disease === "diabetes") score += 0.1;
  if (policy.past_claims < 3) score += 0.1;

  return {
    probability: score,
    risk: score > 0.7 ? "low" : "medium",
  };
};
