module.exports = async function ({ age, disease, policy }) {
  let score = 0.5;

  // Rule-based backbone (stable)
  if (policy.policy_type === "premium") score += 0.2;
  if (age < 50) score += 0.1;
  if (policy.past_claims < 3) score += 0.1;

  // Disease risk
  if (["diabetes", "bp"].includes(disease.toLowerCase())) {
    score += 0.1;
  } else {
    score -= 0.1;
  }

  return {
    probability: Math.min(score, 1),
    risk: score > 0.75 ? "low" : score > 0.5 ? "medium" : "high",
  };
};
