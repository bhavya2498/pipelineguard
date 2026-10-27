const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true },
    segmentId: { type: String, required: true },
    date: { type: Date, required: true },
    result: {
      type: String,
      enum: ["Normal", "Needs Attention", "Critical"],
      default: "Normal",
    },
    report: { type: String, default: "" },
    nextInspection: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inspection", inspectionSchema);
