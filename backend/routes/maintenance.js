const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");
const Alert = require("../models/Alert");
const Inspection = require("../models/Inspection");
const Monitoring = require("../models/Monitoring");
const { calculateMaintenancePriority } = require("../services/healthEngine");

// GET /api/maintenance?status=Pending
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.pipelineId) filter.pipelineId = req.query.pipelineId;
    const items = await Maintenance.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/maintenance
// If priority is omitted, it's auto-calculated from the segment's current
// health score, open alerts, and last inspection result.
router.post("/", async (req, res) => {
  try {
    const body = { ...req.body };

    if (!body.priority) {
      const latestReading = await Monitoring.findOne({
        pipelineId: body.pipelineId,
        segmentId: body.segmentId,
      }).sort({ timestamp: -1 });

      const openAlertCount = await Alert.countDocuments({
        pipelineId: body.pipelineId,
        segmentId: body.segmentId,
        status: "OPEN",
      });

      const lastInspection = await Inspection.findOne({
        pipelineId: body.pipelineId,
        segmentId: body.segmentId,
      }).sort({ date: -1 });

      body.priority = calculateMaintenancePriority({
        healthScore: latestReading ? latestReading.healthScore : 100,
        riskLevel: latestReading ? latestReading.riskLevel : "LOW",
        openAlertCount,
        lastInspectionResult: lastInspection ? lastInspection.result : "Normal",
      });
    }

    const item = new Maintenance(body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/maintenance/:id
router.patch("/:id", async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Maintenance record not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
