const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");

// GET /api/pipelines
router.get("/", async (req, res) => {
  try {
    const pipelines = await Pipeline.find().sort({ createdAt: -1 });
    res.json(pipelines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pipelines/:pipelineId
router.get("/:pipelineId", async (req, res) => {
  try {
    const pipeline = await Pipeline.findOne({ pipelineId: req.params.pipelineId });
    if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });
    res.json(pipeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pipelines (Administrator only)
router.post("/", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole === "Operator") {
      return res.status(403).json({
        error: "Access Denied: Only Administrators have permission to register new pipeline infrastructure.",
      });
    }

    const pipeline = new Pipeline(req.body);
    await pipeline.save();
    res.status(201).json(pipeline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/pipelines/:pipelineId (Administrator only)
router.put("/:pipelineId", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole === "Operator") {
      return res.status(403).json({
        error: "Access Denied: Only Administrators have permission to reconfigure pipeline segments or status.",
      });
    }

    const pipeline = await Pipeline.findOneAndUpdate(
      { pipelineId: req.params.pipelineId },
      req.body,
      { new: true }
    );
    if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });
    res.json(pipeline);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/pipelines/:pipelineId (Administrator only)
router.delete("/:pipelineId", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole === "Operator") {
      return res.status(403).json({
        error: "Access Denied: Only Administrators have authority to decommission or delete pipeline assets.",
      });
    }

    const pipeline = await Pipeline.findOneAndDelete({ pipelineId: req.params.pipelineId });
    if (!pipeline) return res.status(404).json({ error: "Pipeline not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
