const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true },
    segmentId: { type: String, required: true },
    parameter: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["OPEN", "ACKNOWLEDGED", "RESOLVED"],
      default: "OPEN",
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
