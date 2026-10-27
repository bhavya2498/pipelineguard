import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ArrowRight,
  Activity,
  HeartPulse,
  RefreshCw,
  ShieldCheck,
  Users,
  Radio,
} from "lucide-react";
import { getPipelines, getAlerts, getMaintenance, patchAlert, getCurrentUser } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

export default function Dashboard() {
  const [pipelines, setPipelines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      getPipelines(),
      getAlerts({ status: "OPEN" }),
      getMaintenance({ status: "Pending" }),
    ])
      .then(([p, a, m]) => {
        setPipelines(p);
        setAlerts(a);
        setMaintenance(m);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();

    const handleRoleChanged = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("userRoleChanged", handleRoleChanged);
    return () => window.removeEventListener("userRoleChanged", handleRoleChanged);
  }, []);

  const isAdmin = currentUser?.role === "Administrator";

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await patchAlert(alertId, { status: "ACKNOWLEDGED" });
      setActionSuccess("Alert acknowledged successfully");
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <RefreshCw size={36} className="spin" style={{ animation: "spin 1s linear infinite" }} />
        <h4>Loading Dashboard Telemetry...</h4>
        <p>Fetching real-time pipeline status and risk calculations.</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const allSegments = pipelines.flatMap((p) => p.segments || []);
  const lowRiskCount = allSegments.filter((s) => s.lastRiskLevel === "LOW").length;
  const mediumRiskCount = allSegments.filter((s) => s.lastRiskLevel === "MEDIUM").length;
  const highRiskCount = allSegments.filter((s) => s.lastRiskLevel === "HIGH").length;
  const criticalRiskCount = allSegments.filter((s) => s.lastRiskLevel === "CRITICAL").length;
  const atRiskCount = highRiskCount + criticalRiskCount;

  // Average health score across all segments
  const avgHealth = allSegments.length > 0
    ? Math.round(allSegments.reduce((acc, s) => acc + (s.lastHealthScore || 100), 0) / allSegments.length)
    : 100;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>
            {isAdmin ? "Supervisory Command & Governance Dashboard" : "Operator Control Room Dashboard"}
          </h2>
          <p>
            {isAdmin
              ? "System compliance, infrastructure health distribution, and governance oversight."
              : "Real-time field telemetry ingestion, live anomaly alerts, and incident triage."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          {isAdmin ? (
            <Link to="/admin" className="btn btn-secondary btn-sm" style={{ color: "var(--lavender-accent)" }}>
              <Users size={14} /> User Governance
            </Link>
          ) : (
            <Link to="/monitoring" className="btn btn-primary btn-sm">
              <Radio size={14} /> Log Shift Telemetry
            </Link>
          )}
          <Link to="/simulator" className="btn btn-primary btn-sm">
            <Sliders size={14} /> Run What-If Simulation
          </Link>
        </div>
      </div>

      {/* Role Banner */}
      <div className={`role-banner ${isAdmin ? "administrator" : "operator"}`}>
        <div className="role-banner-left">
          {isAdmin ? <ShieldCheck size={18} /> : <Radio size={18} />}
          <span>
            {isAdmin ? (
              <>
                <strong>Administrator Role:</strong> Full governance authority over pipeline asset commissioning, user management, and critical alert resolution.
              </>
            ) : (
              <>
                <strong>Operator Role:</strong> Active pipeline segment telemetry monitoring, alert acknowledgment, and inspection logging enabled.
              </>
            )}
          </span>
        </div>
        <span className={`role-badge ${isAdmin ? "administrator" : "operator"}`}>
          {currentUser?.role || "Operator"}
        </span>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="success-banner">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-box blue">
            <Layers size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Total Pipelines</span>
            <span className="stat-value">{pipelines.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <HeartPulse size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">System Health Avg</span>
            <span className="stat-value">{avgHealth}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box red">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Active Alerts</span>
            <span className="stat-value">{alerts.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box amber">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Segments at Risk</span>
            <span className="stat-value">{atRiskCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">
            <Wrench size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Pending Maintenance</span>
            <span className="stat-value">{maintenance.length}</span>
          </div>
        </div>
      </div>

      {/* Network Risk Distribution Bar Chart */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div className="card-title">
            <Activity size={18} color="var(--blue-primary)" />
            Network Segment Risk Distribution ({allSegments.length} Segments Total)
          </div>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Deterministic Health Engine Bands
          </span>
        </div>

        {allSegments.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No segments registered yet.</p>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                height: 18,
                borderRadius: 9,
                overflow: "hidden",
                backgroundColor: "#e2e8f0",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: `${(lowRiskCount / allSegments.length) * 100}%`,
                  backgroundColor: "var(--green-normal)",
                  transition: "width 0.5s",
                }}
                title={`Low Risk: ${lowRiskCount}`}
              />
              <div
                style={{
                  width: `${(mediumRiskCount / allSegments.length) * 100}%`,
                  backgroundColor: "var(--amber-warning)",
                  transition: "width 0.5s",
                }}
                title={`Medium Risk: ${mediumRiskCount}`}
              />
              <div
                style={{
                  width: `${(highRiskCount / allSegments.length) * 100}%`,
                  backgroundColor: "#f97316",
                  transition: "width 0.5s",
                }}
                title={`High Risk: ${highRiskCount}`}
              />
              <div
                style={{
                  width: `${(criticalRiskCount / allSegments.length) * 100}%`,
                  backgroundColor: "var(--red-critical)",
                  transition: "width 0.5s",
                }}
                title={`Critical Risk: ${criticalRiskCount}`}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green-normal)" }} />
                <span>Normal / Low ({lowRiskCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--amber-warning)" }} />
                <span>Medium ({mediumRiskCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316" }} />
                <span>High Attention ({highRiskCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--red-critical)" }} />
                <span>Critical Hazard ({criticalRiskCount})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Pipelines Table & Active Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Pipelines Table */}
        <div className="table-container">
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)" }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Monitored Pipelines</span>
            <Link to="/pipelines" className="btn btn-secondary btn-sm">
              Manage All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pipeline Name</th>
                <th>Location</th>
                <th>Segments</th>
                <th>Worst Risk</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((p) => {
                const worst = getWorstRisk(p.segments);
                return (
                  <tr key={p.pipelineId}>
                    <td><strong>{p.pipelineId}</strong></td>
                    <td>{p.name}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{p.location}</td>
                    <td>
                      <span className="risk-badge" style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}>
                        {p.segments?.length || 0} segments
                      </span>
                    </td>
                    <td>
                      <RiskBadge level={worst} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Active Alerts Widget */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={18} color="var(--red-critical)" />
              Active System Alerts ({alerts.length})
            </div>
            <Link to="/alerts" style={{ fontSize: 13, color: "var(--blue-primary)", textDecoration: "none", fontWeight: 500 }}>
              View All
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 12px" }}>
              <CheckCircle2 size={32} color="var(--green-normal)" />
              <h4>All systems nominal</h4>
              <p style={{ fontSize: 13 }}>No unacknowledged threshold alerts present.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {alerts.slice(0, 5).map((a) => (
                <div
                  key={a._id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <RiskBadge level={a.severity} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {a.pipelineId} &bull; {a.segmentId}
                      </span>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "3px 8px", fontSize: 11 }}
                      onClick={() => handleAcknowledgeAlert(a._id)}
                    >
                      Acknowledge
                    </button>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                    {a.message}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {new Date(a.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getWorstRisk(segments = []) {
  if (!segments || segments.length === 0) return "LOW";
  const priority = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  for (const lvl of priority) {
    if (segments.some((s) => s.lastRiskLevel === lvl)) return lvl;
  }
  return "LOW";
}
