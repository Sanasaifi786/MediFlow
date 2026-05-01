module.exports = async function ({ policy, cost }) {
  return cost <= policy.coverage_limit;
};
