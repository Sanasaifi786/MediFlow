const entityExtractionTool = require("../tools/entityExtractionTool");
const policyTool = require("../tools/policyTool");
const costPredictionTool = require("../tools/costPredictionTool");
const eligibilityTool = require("../tools/eligibilityTool");
const scoringTool = require("../tools/scoringTool");
const reportTool = require("../tools/reportTool");

async function runInsuranceAgent(query) {
  let context = {};

  // 🧩 STEP 1: Extract entities
  context.patient = await entityExtractionTool(query);

  // 🧩 STEP 2: Fetch policy
  context.policy = await policyTool(context.patient.name);

  // 🧩 STEP 3: Predict cost
  context.estimatedCost = await costPredictionTool({
    disease: context.patient.disease,
    age: context.patient.age,
  });

  // 🧩 STEP 4: Eligibility check
  context.eligibility = await eligibilityTool({
    policy: context.policy,
    cost: context.estimatedCost,
  });

  // 🧩 STEP 5: Score calculation (🔥 highlight this)
  context.score = await scoringTool({
    ...context.patient,
    policy: context.policy,
  });

  // 🧩 STEP 6: Final report
  const result = await reportTool(context);

  return result;
}

module.exports = { runInsuranceAgent };
