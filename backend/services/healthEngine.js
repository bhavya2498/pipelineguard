/**
 * PipelineGuard Health & Risk Engine
 * Prototype rule-based scoring — weights/thresholds are configurable placeholders,
 * not values specified by any real pipeline-safety standard.
 */

// Ideal/safe ranges per parameter. Anything outside "safe" adds risk points.
const THRESHOLDS = {
  pressure: { safeMax: 85, criticalMax: 110, weight: 0.25 },
  flow: { safeMax: 90, criticalMax: 120, weight: 0.15 },
  temperature: { safeMax: 60, criticalMax: 90, weight: 0.15 },
  vibration: { safeMax: 60, criticalMax: 85, weight: 0.25 },
  corrosion: { safeMax: 15, criticalMax: 35, weight: 0.20 },
};

/**
 * Returns a 0-100 risk contribution for a single parameter.
 * 0 = well within safe range, 100 = at/above critical threshold.
 */
function parameterRisk(value, { safeMax, criticalMax }) {
  if (value <= safeMax) return 0;
  if (value >= criticalMax) return 100;
  return ((value - safeMax) / (criticalMax - safeMax)) * 100;
}

/**
 * readings: { pressure, flow, temperature, vibration, corrosion }
 * Returns { healthScore, riskLevel, breakdown }
 */
function calculateHealthScore(readings) {
  let overallRisk = 0;
  const breakdown = {};

  for (const [param, cfg] of Object.entries(THRESHOLDS)) {
    const value = Number(readings[param]) || 0;
    const risk = parameterRisk(value, cfg);
    breakdown[param] = { value, risk: Math.round(risk) };
    overallRisk += risk * cfg.weight;
  }

  const healthScore = Math.max(0, Math.round(100 - overallRisk));
  const riskLevel = calculateRiskLevel(healthScore);

  return { healthScore, riskLevel, breakdown };
}

/**
 * Maps a health score to a risk band.
 */
function calculateRiskLevel(healthScore) {
  if (healthScore >= 80) return "LOW";
  if (healthScore >= 60) return "MEDIUM";
  if (healthScore >= 35) return "HIGH";
  return "CRITICAL";
}

/**
 * Checks each parameter against its safe threshold and returns
 * a list of alert objects for anything that's out of range.
 */
function checkThresholds(readings, { pipelineId, segmentId }) {
  const alerts = [];

  for (const [param, cfg] of Object.entries(THRESHOLDS)) {
    const value = Number(readings[param]) || 0;
    if (value > cfg.safeMax) {
      const severity = value >= cfg.criticalMax ? "CRITICAL" : "HIGH";
      alerts.push({
        pipelineId,
        segmentId,
        parameter: param,
        message: `${param.toUpperCase()} above safe threshold (${value} > ${cfg.safeMax})`,
        severity,
        status: "OPEN",
      });
    }
  }

  return alerts;
}

/**
 * Combines health score, risk level, open-alert count and inspection
 * result into a maintenance priority recommendation.
 */
function calculateMaintenancePriority({
  healthScore,
  riskLevel,
  openAlertCount = 0,
  lastInspectionResult = "Normal",
}) {
  let score = 0;

  if (riskLevel === "CRITICAL") score += 4;
  else if (riskLevel === "HIGH") score += 3;
  else if (riskLevel === "MEDIUM") score += 1;

  if (healthScore < 40) score += 2;
  else if (healthScore < 60) score += 1;

  score += Math.min(openAlertCount, 3);

  if (lastInspectionResult === "Needs Attention") score += 1;
  if (lastInspectionResult === "Critical") score += 3;

  if (score >= 6) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
}

/**
 * Produces a short human-readable recommendation for the Risk Simulator.
 */
function recommendAction(riskLevel) {
  switch (riskLevel) {
    case "CRITICAL":
      return "Immediate shutdown and emergency inspection recommended";
    case "HIGH":
      return "Schedule inspection within 48 hours";
    case "MEDIUM":
      return "Schedule routine inspection this month";
    default:
      return "No action needed — continue routine monitoring";
  }
}

/**
 * Runs a full simulation for the Risk Simulator page — same engine as live
 * monitoring, but doesn't persist to the monitoring collection.
 */
function runSimulation(inputValues) {
  const { healthScore, riskLevel, breakdown } = calculateHealthScore(inputValues);
  const recommendation = recommendAction(riskLevel);
  return { healthScore, riskLevel, recommendation, breakdown };
}

module.exports = {
  THRESHOLDS,
  calculateHealthScore,
  calculateRiskLevel,
  checkThresholds,
  calculateMaintenancePriority,
  recommendAction,
  runSimulation,
};
