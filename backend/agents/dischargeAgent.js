const timelineExtractionTool = require("../tools/timelineExtractionTool");
const validationTool = require("../tools/validationTool");
const clinicalSummaryTool = require("../tools/clinicalSummaryTool");
const patientSummaryTool = require("../tools/patientSummaryTool");

async function runDischargeAgent(patientId) {
  let context = {};

  // 🧩 STEP 1: Extract patient timeline data
  context.timeline = await timelineExtractionTool(patientId);

  // 🧩 STEP 2: Validate the completeness of the timeline data
  context.validation = await validationTool(context.timeline);

  if (!context.validation.isComplete) {
    return {
      status: "failed",
      message: "Medical data is incomplete. Cannot generate discharge summary.",
      missingFields: context.validation.missingFields,
      validationMessage: context.validation.validationMessage
    };
  }

  // 🧩 STEP 3: Generate Doctor-level Clinical Summary
  context.clinicalSummary = await clinicalSummaryTool(context.timeline);

  // 🧩 STEP 4: Generate Patient-friendly Summary
  context.patientSummary = await patientSummaryTool(context.clinicalSummary);

  // 🧩 STEP 5: Final Report Output
  return {
    status: "success",
    patientId: context.timeline.patientId,
    patientName: context.timeline.name,
    dischargeDate: context.timeline.dischargeDate,
    summaries: {
      clinicalSummary: context.clinicalSummary,
      patientSummary: context.patientSummary,
    }
  };
}

module.exports = { runDischargeAgent };