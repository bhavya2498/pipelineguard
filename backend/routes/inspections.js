const express = require("express");
const router = express.Router();
const Inspection = require("../models/Inspection");

// GET /api/inspections?pipelineId=P-001
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.pipelineId) filter.pipelineId = req.query.pipelineId;
    const inspections = await Inspection.find(filter).sort({ date: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inspections
router.post("/", async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    await inspection.save();
    res.status(201).json(inspection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/inspections/:id
router.put("/:id", async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inspection) return res.status(404).json({ error: "Inspection not found" });
    res.json(inspection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
