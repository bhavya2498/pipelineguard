const express = require("express");
const router = express.Router();
const Monitoring = require("../models/Monitoring");
const Alert = require("../models/Alert");
const Pipeline = require("../models/Pipeline");
const { calculateHealthScore, checkThresholds } = require("../services/healthEngine");

// GET /api/monitoring?pipelineId=P-001&segmentId=SEG-001
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.pipelineId) filter.pipelineId = req.query.pipelineId;
    if (req.query.segmentId) filter.segmentId = req.query.segmentId;
    const readings = await Monitoring.find(filter).sort({ timestamp: -1 }).limit(200);
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/monitoring
// body: { pipelineId, segmentId, pressure, flow, temperature, vibration, corrosion }
router.post("/", async (req, res) => {
  try {
    const { pipelineId, segmentId, pressure, flow, temperature, vibration, corrosion } = req.body;

    const { healthScore, riskLevel } = calculateHealthScore({
      pressure,
      flow,
      temperature,
      vibration,
      corrosion,
    });

    const reading = new Monitoring({
      pipelineId,
      segmentId,
      pressure,
      flow,
      temperature,
      vibration,
      corrosion,
      healthScore,
      riskLevel,
    });
    await reading.save();

    // Generate alerts for anything out of range
    const alertsToCreate = checkThresholds(
      { pressure, flow, temperature, vibration, corrosion },
      { pipelineId, segmentId }
    );
    let createdAlerts = [];
    if (alertsToCreate.length > 0) {
      createdAlerts = await Alert.insertMany(alertsToCreate);
    }

    // Keep the pipeline's segment summary in sync
    await Pipeline.updateOne(
      { pipelineId, "segments.segmentId": segmentId },
      {
        $set: {
          "segments.$.lastHealthScore": healthScore,
          "segments.$.lastRiskLevel": riskLevel,
        },
      }
    );

    res.status(201).json({ reading, alertsCreated: createdAlerts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
