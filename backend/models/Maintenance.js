const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    pipelineId: { type: String, required: true },
    segmentId: { type: String, required: true },
    issue: { type: String, required: true },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    assignedPerson: { type: String, default: "Unassigned" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
