import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  History,
  Sliders,
  Filter,
  RefreshCw,
  Search,
  ArrowRight,
} from "lucide-react";
import { getSimulations, getPipelines } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

export default function SimulationHistory() {
  const [simulations, setSimulations] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [filterPipeline, setFilterPipeline] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    getSimulations(filterPipeline ? { pipelineId: filterPipeline } : {})
      .then(setSimulations)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    getPipelines().then(setPipelines).catch(() => {});
  }, [filterPipeline]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Operational Simulation Archives</h2>
          <p>Chronological history of what-if parameter tests, calculated health scores, and recommended directives.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/simulator" className="btn btn-primary btn-sm">
            <Sliders size={14} /> New Simulation
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter Pipeline:</label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={filterPipeline}
            onChange={(e) => setFilterPipeline(e.target.value)}
          >
            <option value="">All Pipelines</option>
            {pipelines.map((p) => (
              <option key={p.pipelineId} value={p.pipelineId}>
                {p.pipelineId}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Showing <strong>{simulations.length}</strong> archived simulation run(s)
        </div>
      </div>

      {/* Simulations Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline / Segment</th>
              <th>Tested Input Vector</th>
              <th>Health Score</th>
              <th>Risk Assessment</th>
              <th>Recommended Directive</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  Loading simulation archives...
                </td>
              </tr>
            ) : simulations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No simulation runs recorded yet. Use the Risk Simulator to test hypothetical operating scenarios.
                </td>
              </tr>
            ) : (
              simulations.map((s) => (
                <tr key={s._id}>
                  <td>
                    <strong>{s.pipelineId}</strong>
                    <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>/ {s.segmentId}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 12 }}>
                      <span style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: 4 }}>
                        P: {s.inputValues?.pressure}
                      </span>
                      <span style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: 4 }}>
                        F: {s.inputValues?.flow}
                      </span>
                      <span style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: 4 }}>
                        T: {s.inputValues?.temperature}°C
                      </span>
                      <span style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: 4 }}>
                        V: {s.inputValues?.vibration}
                      </span>
                      <span style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: 4 }}>
                        C: {s.inputValues?.corrosion}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>{s.healthScore}</strong>/100
                  </td>
                  <td>
                    <RiskBadge level={s.riskLevel} />
                  </td>
                  <td style={{ maxWidth: 300 }}>
                    <span style={{ fontSize: 13, color: "var(--text-main)" }}>
                      {s.recommendation}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                    {new Date(s.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
