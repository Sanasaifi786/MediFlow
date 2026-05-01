module.exports = async function (input) {
  const name = typeof input === 'object' && input.name ? input.name : input;
  // Simulate a database lookup
  const policies = {
    "Ravi Kumar": { policy_type: "premium", coverage_limit: 500000, past_claims: 1 },
    "John Doe": { policy_type: "basic", coverage_limit: 100000, past_claims: 0 }
  };
  
  if (name && typeof name === 'string' && policies[name]) {
    return policies[name];
  }
  
  // Default fallback policy
  return {
    policy_type: "standard",
    coverage_limit: 200000,
    past_claims: 0,
  };
};
