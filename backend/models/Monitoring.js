const mongoose = require("mongoose");

const monitoringSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true },
    segmentId: { type: String, required: true },
    pressure: { type: Number, required: true },
    flow: { type: Number, required: true },
    temperature: { type: Number, required: true },
    vibration: { type: Number, required: true },
    corrosion: { type: Number, required: true },
    healthScore: { type: Number },
    riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Monitoring", monitoringSchema);
