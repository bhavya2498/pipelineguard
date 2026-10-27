require("dotenv").config();
const mongoose = require("mongoose");
const Pipeline = require("./models/Pipeline");
const Monitoring = require("./models/Monitoring");
const Alert = require("./models/Alert");
const Inspection = require("./models/Inspection");
const Maintenance = require("./models/Maintenance");
const Simulation = require("./models/Simulation");
const User = require("./models/User");
const { calculateHealthScore } = require("./services/healthEngine");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pipelineguard";

const pipelines = [
  {
    pipelineId: "P-001",
    name: "North Corridor Line",
    location: "Sector 7 - Northern Plains",
    status: "ACTIVE",
    segments: [
      { segmentId: "SEG-001", name: "Segment A - Compressor Inlet", lastHealthScore: 100, lastRiskLevel: "LOW" },
      { segmentId: "SEG-002", name: "Segment B - Mountain Cross", lastHealthScore: 100, lastRiskLevel: "LOW" },
    ],
  },
  {
    pipelineId: "P-002",
    name: "East Valley Line",
    location: "Sector 12 - Agricultural Basin",
    status: "ACTIVE",
    segments: [
      { segmentId: "SEG-003", name: "Segment A - River Underpass", lastHealthScore: 100, lastRiskLevel: "LOW" },
    ],
  },
  {
    pipelineId: "P-003",
    name: "Coastal Trunk Line",
    location: "Sector 4 - Offshore Terminal",
    status: "ACTIVE",
    segments: [
      { segmentId: "SEG-004", name: "Segment A - High-Saline Shore", lastHealthScore: 100, lastRiskLevel: "LOW" },
      { segmentId: "SEG-005", name: "Segment B - Port Storage Tie-in", lastHealthScore: 100, lastRiskLevel: "LOW" },
    ],
  },
];

const sampleReadings = [
  { pipelineId: "P-001", segmentId: "SEG-001", pressure: 82, flow: 74, temperature: 46, vibration: 18, corrosion: 6 },
  { pipelineId: "P-001", segmentId: "SEG-002", pressure: 95, flow: 88, temperature: 58, vibration: 65, corrosion: 12 },
  { pipelineId: "P-002", segmentId: "SEG-003", pressure: 62, flow: 55, temperature: 40, vibration: 30, corrosion: 4 },
  { pipelineId: "P-003", segmentId: "SEG-004", pressure: 105, flow: 92, temperature: 78, vibration: 82, corrosion: 28 },
  { pipelineId: "P-003", segmentId: "SEG-005", pressure: 70, flow: 60, temperature: 42, vibration: 25, corrosion: 8 },
];

const sampleAlerts = [
  {
    pipelineId: "P-003",
    segmentId: "SEG-004",
    parameter: "vibration",
    message: "VIBRATION above safe threshold (82 > 60)",
    severity: "HIGH",
    status: "OPEN",
    timestamp: new Date(Date.now() - 45 * 60000),
  },
  {
    pipelineId: "P-003",
    segmentId: "SEG-004",
    parameter: "corrosion",
    message: "CORROSION above safe threshold (28 > 15)",
    severity: "HIGH",
    status: "OPEN",
    timestamp: new Date(Date.now() - 50 * 60000),
  },
  {
    pipelineId: "P-001",
    segmentId: "SEG-002",
    parameter: "pressure",
    message: "PRESSURE above safe threshold (95 > 85)",
    severity: "HIGH",
    status: "ACKNOWLEDGED",
    timestamp: new Date(Date.now() - 120 * 60000),
  },
  {
    pipelineId: "P-002",
    segmentId: "SEG-003",
    parameter: "flow",
    message: "FLOW fluctuation settled within parameters",
    severity: "MEDIUM",
    status: "RESOLVED",
    timestamp: new Date(Date.now() - 360 * 60000),
  },
];

const sampleInspections = [
  {
    pipelineId: "P-001",
    segmentId: "SEG-001",
    date: new Date(Date.now() - 7 * 86400000),
    result: "Normal",
    report: "Ultrasonic thickness measurement nominal. No wall loss detected.",
    nextInspection: new Date(Date.now() + 60 * 86400000),
  },
  {
    pipelineId: "P-003",
    segmentId: "SEG-004",
    date: new Date(Date.now() - 3 * 86400000),
    result: "Needs Attention",
    report: "Slight localized surface pitting observed near flange seam due to marine air.",
    nextInspection: new Date(Date.now() + 14 * 86400000),
  },
  {
    pipelineId: "P-001",
    segmentId: "SEG-002",
    date: new Date(Date.now() - 14 * 86400000),
    result: "Normal",
    report: "Inline PIG inspection passed. Internal coating intact.",
    nextInspection: new Date(Date.now() + 90 * 86400000),
  },
];

const sampleMaintenance = [
  {
    pipelineId: "P-003",
    segmentId: "SEG-004",
    issue: "Replace valve seal and recoat cathodic protective barrier",
    priority: "HIGH",
    assignedPerson: "Elena Rostova",
    status: "Pending",
    dueDate: new Date(Date.now() + 5 * 86400000),
  },
  {
    pipelineId: "P-001",
    segmentId: "SEG-002",
    issue: "Recalibrate vibration sensor and replace mounting dampener",
    priority: "MEDIUM",
    assignedPerson: "Marcus Vance",
    status: "In Progress",
    dueDate: new Date(Date.now() + 8 * 86400000),
  },
  {
    pipelineId: "P-002",
    segmentId: "SEG-003",
    issue: "Annual flange torque inspection and valve lubrication",
    priority: "LOW",
    assignedPerson: "Samir Patel",
    status: "Completed",
    dueDate: new Date(Date.now() - 2 * 86400000),
  },
];

const sampleSimulations = [
  {
    pipelineId: "P-003",
    segmentId: "SEG-004",
    inputValues: { pressure: 108, flow: 95, temperature: 88, vibration: 84, corrosion: 34 },
    healthScore: 16,
    riskLevel: "CRITICAL",
    recommendation: "Immediate shutdown and emergency inspection recommended",
    timestamp: new Date(Date.now() - 90 * 60000),
  },
  {
    pipelineId: "P-001",
    segmentId: "SEG-001",
    inputValues: { pressure: 74, flow: 68, temperature: 44, vibration: 22, corrosion: 8 },
    healthScore: 98,
    riskLevel: "LOW",
    recommendation: "No action needed — continue routine monitoring",
    timestamp: new Date(Date.now() - 240 * 60000),
  },
];

const sampleUsers = [
  {
    name: "Operator",
    email: "operator@pipelineguard.com",
    password: "password123",
    role: "Operator",
  },
  {
    name: "Administrator",
    email: "admin@pipelineguard.com",
    password: "adminpassword",
    role: "Administrator",
  },
];

async function seedData() {
  console.log("Seeding initial PipelineGuard dataset...");
  await Pipeline.deleteMany({});
  await Monitoring.deleteMany({});
  await Alert.deleteMany({});
  await Inspection.deleteMany({});
  await Maintenance.deleteMany({});
  await Simulation.deleteMany({});
  try {
    await User.collection.dropIndexes();
  } catch (e) {}
  await User.deleteMany({});

  await Pipeline.insertMany(pipelines);
  console.log(`Inserted ${pipelines.length} pipelines.`);

  for (const reading of sampleReadings) {
    const { healthScore, riskLevel } = calculateHealthScore(reading);
    await Monitoring.create({ ...reading, healthScore, riskLevel });

    await Pipeline.updateOne(
      { pipelineId: reading.pipelineId, "segments.segmentId": reading.segmentId },
      {
        $set: {
          "segments.$.lastHealthScore": healthScore,
          "segments.$.lastRiskLevel": riskLevel,
        },
      }
    );
  }
  console.log(`Inserted ${sampleReadings.length} monitoring readings and updated segment health.`);

  await Alert.insertMany(sampleAlerts);
  console.log(`Inserted ${sampleAlerts.length} initial alerts.`);

  await Inspection.insertMany(sampleInspections);
  console.log(`Inserted ${sampleInspections.length} initial inspections.`);

  await Maintenance.insertMany(sampleMaintenance);
  console.log(`Inserted ${sampleMaintenance.length} initial maintenance tasks.`);

  await Simulation.insertMany(sampleSimulations);
  console.log(`Inserted ${sampleSimulations.length} initial simulations.`);

  await User.insertMany(sampleUsers);
  console.log(`Inserted ${sampleUsers.length} default users.`);

  console.log("PipelineGuard dataset seeding completed successfully.");
}

async function runStandalone() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB at", MONGO_URI);
  await seedData();
  await mongoose.disconnect();
}

if (require.main === module) {
  runStandalone().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
}

module.exports = { seedData };
