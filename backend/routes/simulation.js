const express = require("express");
const router = express.Router();
const Simulation = require("../models/Simulation");
const { runSimulation } = require("../services/healthEngine");

// POST /api/simulation
// body: { pipelineId, segmentId, pressure, flow, temperature, vibration, corrosion }
router.post("/", async (req, res) => {
  try {
    const { pipelineId, segmentId, pressure, flow, temperature, vibration, corrosion } = req.body;
    const inputValues = { pressure, flow, temperature, vibration, corrosion };

    const { healthScore, riskLevel, recommendation, breakdown } = runSimulation(inputValues);

    const simulation = new Simulation({
      pipelineId,
      segmentId,
      inputValues,
      healthScore,
      riskLevel,
      recommendation,
    });
    await simulation.save();

    res.status(201).json({ ...simulation.toObject(), breakdown });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/simulations?pipelineId=P-001
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.pipelineId) filter.pipelineId = req.query.pipelineId;
    const simulations = await Simulation.find(filter).sort({ timestamp: -1 }).limit(100);
    res.json(simulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
