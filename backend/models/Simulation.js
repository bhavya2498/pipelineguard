const mongoose = require("mongoose");

const simulationSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true },
    segmentId: { type: String, required: true },
    inputValues: {
      pressure: Number,
      flow: Number,
      temperature: Number,
      vibration: Number,
      corrosion: Number,
    },
    healthScore: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    recommendation: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Simulation", simulationSchema);
