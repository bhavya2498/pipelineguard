const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { seedData } = require("./seed");

const pipelineRoutes = require("./routes/pipelines");
const monitoringRoutes = require("./routes/monitoring");
const alertRoutes = require("./routes/alerts");
const inspectionRoutes = require("./routes/inspections");
const maintenanceRoutes = require("./routes/maintenance");
const simulationRoutes = require("./routes/simulation");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "PipelineGuard API running", version: "1.0.0" }));

app.use("/api/pipelines", pipelineRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/simulations", simulationRoutes); // GET history alias
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pipelineguard";

async function startServer() {
  let connected = false;

  // 1. Attempt connection to configured MONGO_URI (e.g. MongoDB Atlas)
  try {
    console.log("Attempting to connect to configured MongoDB URI...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log("Connected successfully to MongoDB (" + (MONGO_URI.includes("mongodb+srv") ? "MongoDB Atlas" : MONGO_URI) + ")");
    connected = true;

    // Check if pipelines collection has data, if empty seed it
    const Pipeline = require("./models/Pipeline");
    const count = await Pipeline.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Populating initial seed data...");
      await seedData();
    }
  } catch (err) {
    console.warn("Could not connect to external MongoDB URI:", err.message);
    console.warn("To use MongoDB Atlas, ensure your IP address is whitelisted in Atlas (Network Access -> Allow 0.0.0.0/0).");
    console.log("Starting embedded in-memory MongoDB fallback so the application runs seamlessly...");
  }

  // 2. If external connection failed, fall back to embedded in-memory MongoDB
  if (!connected) {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log("Connected to embedded in-memory MongoDB at:", memoryUri);
      console.log("Populating initial demonstration data...");
      await seedData();
    } catch (memErr) {
      console.error("Critical: Failed to start embedded MongoDB:", memErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`PipelineGuard API listening on port ${PORT}`);
  });
}

startServer();
