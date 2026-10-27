import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Pipelines from "./pages/Pipelines.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Alerts from "./pages/Alerts.jsx";
import Inspections from "./pages/Inspections.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import RiskSimulator from "./pages/RiskSimulator.jsx";
import SimulationHistory from "./pages/SimulationHistory.jsx";
import AdminGovernance from "./pages/AdminGovernance.jsx";

export default function App() {
  return (
    <Routes>
      {/* Page 1: Landing Page */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />

      {/* Page 2: Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Internal Control Center Pages with Shell Layout */}
      <Route element={<Layout />}>
        {/* Page 3: Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Page 4: Pipelines */}
        <Route path="/pipelines" element={<Pipelines />} />

        {/* Page 5: Monitoring */}
        <Route path="/monitoring" element={<Monitoring />} />

        {/* Page 6: Alerts */}
        <Route path="/alerts" element={<Alerts />} />

        {/* Page 7: Inspections */}
        <Route path="/inspections" element={<Inspections />} />

        {/* Page 8: Maintenance */}
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Page 9: Risk Simulator */}
        <Route path="/simulator" element={<RiskSimulator />} />

        {/* Page 10: Simulation History */}
        <Route path="/simulations" element={<SimulationHistory />} />

        {/* System Governance & RBAC Management (Administrator authority) */}
        <Route path="/admin" element={<AdminGovernance />} />
      </Route>
    </Routes>
  );
}
