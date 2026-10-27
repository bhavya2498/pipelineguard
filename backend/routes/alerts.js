const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// GET /api/alerts?status=OPEN
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.pipelineId) filter.pipelineId = req.query.pipelineId;
    const alerts = await Alert.find(filter).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alerts (Manual alert creation - Admin drill only)
router.post("/", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole === "Operator") {
      return res.status(403).json({
        error: "Access Denied: Only Administrators can trigger manual test or drill alerts.",
      });
    }

    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/alerts/:id (acknowledge/resolve with role enforcement)
router.patch("/:id", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    const existingAlert = await Alert.findById(req.params.id);
    if (!existingAlert) return res.status(404).json({ error: "Alert not found" });

    // Role check: Only Administrators can resolve CRITICAL severity alerts
    if (
      req.body.status === "RESOLVED" &&
      existingAlert.severity === "CRITICAL" &&
      userRole === "Operator"
    ) {
      return res.status(403).json({
        error: "Access Denied: Critical emergency alerts require Administrator authorization to resolve.",
      });
    }

    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
