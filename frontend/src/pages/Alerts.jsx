import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Check,
  Plus,
  RefreshCw,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { getAlerts, patchAlert, createAlert, getPipelines, getCurrentUser } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Manual trigger state
  const [manualAlert, setManualAlert] = useState({
    pipelineId: "",
    segmentId: "",
    parameter: "pressure",
    severity: "HIGH",
    message: "",
  });

  const loadData = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (pipelineFilter) params.pipelineId = pipelineFilter;

    getAlerts(params)
      .then(setAlerts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    getPipelines().then(setPipelines).catch(() => {});

    const handleRoleChanged = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("userRoleChanged", handleRoleChanged);
    return () => window.removeEventListener("userRoleChanged", handleRoleChanged);
  }, [statusFilter, pipelineFilter]);

  const isAdmin = currentUser?.role === "Administrator";

  const updateAlertStatus = async (alertId, newStatus, severity) => {
    try {
      setError(null);
      // Operator check for critical resolve
      if (newStatus === "RESOLVED" && severity === "CRITICAL" && !isAdmin) {
        setError("Access Denied: Resolving CRITICAL hazard emergencies requires Administrator authorization.");
        return;
      }

      await patchAlert(alertId, { status: newStatus });
      setSuccess(`Alert status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleCreateManualAlert = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Access Denied: Only Administrators can trigger manual test or drill alerts.");
      return;
    }

    try {
      await createAlert({
        ...manualAlert,
        status: "OPEN",
      });
      setShowManualForm(false);
      setManualAlert({
        pipelineId: "",
        segmentId: "",
        parameter: "pressure",
        severity: "HIGH",
        message: "",
      });
      setSuccess("Manual test alert triggered successfully");
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Operational Incident & Threshold Alerts</h2>
          <p>Real-time exception management, threshold alarms, and operator acknowledgment lifecycle.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          {isAdmin ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowManualForm(!showManualForm)}
            >
              <Plus size={16} /> {showManualForm ? "Close Form" : "Trigger Drill Alert"}
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              disabled
              title="Manual emergency drill alarms require Administrator authorization"
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            >
              <Lock size={14} /> Trigger Drill Alert (Admin Only)
            </button>
          )}
        </div>
      </div>

      {/* Role Context Notification Banner */}
      <div className={`role-banner ${isAdmin ? "administrator" : "operator"}`}>
        <div className="role-banner-left">
          {isAdmin ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
          <span>
            {isAdmin ? (
              <>
                <strong>Administrator Command Active:</strong> You hold full sign-off authority to resolve CRITICAL emergency incidents and dispatch system-wide drill alarms.
              </>
            ) : (
              <>
                <strong>Operator Incident Triage Active:</strong> Operators are authorized to investigate and <strong>Acknowledge</strong> all incoming alerts. Resolving <strong>CRITICAL</strong> emergency hazards requires Administrator sign-off.
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

      {success && (
        <div className="success-banner">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Manual Alert Modal / Form (Administrator only) */}
      {showManualForm && isAdmin && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={18} color="var(--red-critical)" />
              Simulate / Raise Manual Incident Alert
            </div>
            <span className="role-badge administrator">Admin Exclusive Drill</span>
          </div>
          <form onSubmit={handleCreateManualAlert}>
            <div className="form-grid">
              <div className="form-group">
                <label>Pipeline ID *</label>
                <select
                  className="form-control"
                  value={manualAlert.pipelineId}
                  onChange={(e) => {
                    const selP = pipelines.find((p) => p.pipelineId === e.target.value);
                    setManualAlert({
                      ...manualAlert,
                      pipelineId: e.target.value,
                      segmentId: selP?.segments?.[0]?.segmentId || "",
                    });
                  }}
                  required
                >
                  <option value="">Select Pipeline...</option>
                  {pipelines.map((p) => (
                    <option key={p.pipelineId} value={p.pipelineId}>
                      {p.pipelineId} ({p.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Segment ID *</label>
                <input
                  className="form-control"
                  placeholder="e.g. SEG-002"
                  value={manualAlert.segmentId}
                  onChange={(e) => setManualAlert({ ...manualAlert, segmentId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parameter</label>
                <select
                  className="form-control"
                  value={manualAlert.parameter}
                  onChange={(e) => setManualAlert({ ...manualAlert, parameter: e.target.value })}
                >
                  <option value="pressure">Pressure</option>
                  <option value="flow">Flow Rate</option>
                  <option value="temperature">Temperature</option>
                  <option value="vibration">Vibration</option>
                  <option value="corrosion">Corrosion Rate</option>
                </select>
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select
                  className="form-control"
                  value={manualAlert.severity}
                  onChange={(e) => setManualAlert({ ...manualAlert, severity: e.target.value })}
                >
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Alert Message *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Sudden acoustic surge detected at manifold weld"
                  value={manualAlert.message}
                  onChange={(e) => setManualAlert({ ...manualAlert, message: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowManualForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Dispatch Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs & Pipeline Selector */}
      <div className="filter-bar">
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${statusFilter === "" ? "active" : ""}`}
            onClick={() => setStatusFilter("")}
          >
            All Alerts
          </button>
          <button
            className={`tab-pill ${statusFilter === "OPEN" ? "active" : ""}`}
            onClick={() => setStatusFilter("OPEN")}
          >
            Open
          </button>
          <button
            className={`tab-pill ${statusFilter === "ACKNOWLEDGED" ? "active" : ""}`}
            onClick={() => setStatusFilter("ACKNOWLEDGED")}
          >
            Acknowledged
          </button>
          <button
            className={`tab-pill ${statusFilter === "RESOLVED" ? "active" : ""}`}
            onClick={() => setStatusFilter("RESOLVED")}
          >
            Resolved
          </button>
        </div>

        <div className="filter-group">
          <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Filter Pipeline:</label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={pipelineFilter}
            onChange={(e) => setPipelineFilter(e.target.value)}
          >
            <option value="">All Pipelines</option>
            {pipelines.map((p) => (
              <option key={p.pipelineId} value={p.pipelineId}>
                {p.pipelineId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline / Segment</th>
              <th>Parameter</th>
              <th>Incident Message</th>
              <th>Severity</th>
              <th>Lifecycle Status</th>
              <th>Triggered Time</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No alerts matching the selected criteria.
                </td>
              </tr>
            ) : (
              alerts.map((a) => {
                const isResolved = a.status === "RESOLVED";
                const isAck = a.status === "ACKNOWLEDGED";
                const isCritical = a.severity === "CRITICAL";
                const canResolve = isAdmin || !isCritical;

                return (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.pipelineId}</strong>
                      <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>/ {a.segmentId}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontWeight: 500 }}>
                        {a.parameter}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{a.message}</span>
                    </td>
                    <td>
                      <RiskBadge level={a.severity} />
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          background:
                            a.status === "OPEN"
                              ? "var(--red-light)"
                              : a.status === "ACKNOWLEDGED"
                              ? "var(--amber-light)"
                              : "var(--green-light)",
                          color:
                            a.status === "OPEN"
                              ? "#991b1b"
                              : a.status === "ACKNOWLEDGED"
                              ? "#92400e"
                              : "#065f46",
                          border: `1px solid ${
                            a.status === "OPEN"
                              ? "var(--red-border)"
                              : a.status === "ACKNOWLEDGED"
                              ? "var(--amber-border)"
                              : "var(--green-border)"
                          }`,
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                      {new Date(a.timestamp).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                        {!isAck && !isResolved && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => updateAlertStatus(a._id, "ACKNOWLEDGED", a.severity)}
                            title="Acknowledge alert for field inspection"
                          >
                            Ack
                          </button>
                        )}
                        {!isResolved && (
                          canResolve ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => updateAlertStatus(a._id, "RESOLVED", a.severity)}
                              title="Resolve incident"
                            >
                              <Check size={13} /> Resolve
                            </button>
                          ) : (
                            <span
                              className="locked-badge"
                              title="Resolving CRITICAL emergencies requires Administrator authorization"
                            >
                              <Lock size={11} /> Admin Sign-off
                            </span>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
