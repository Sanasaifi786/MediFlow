module.exports = async function (name) {
  return {
    policy_type: "premium",
    coverage_limit: 50000,
    past_claims: 2,
  };
};
