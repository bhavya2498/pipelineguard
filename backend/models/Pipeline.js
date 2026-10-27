const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    segmentId: { type: String, required: true },
    name: { type: String, default: "" },
    lastHealthScore: { type: Number, default: 100 },
    lastRiskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },
  },
  { _id: false }
);

const pipelineSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    segments: { type: [segmentSchema], default: [] },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pipeline", pipelineSchema);
