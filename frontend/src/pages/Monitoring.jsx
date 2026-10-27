import React, { useEffect, useState } from "react";
import {
  Activity,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Thermometer,
  Droplets,
  Zap,
  TrendingDown,
  RefreshCw,
  ShieldCheck,
  Radio,
  Sparkles,
} from "lucide-react";
import { getMonitoring, postMonitoring, getPipelines, getCurrentUser } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

const emptyForm = {
  pipelineId: "",
  segmentId: "",
  pressure: "",
  flow: "",
  temperature: "",
  vibration: "",
  corrosion: "",
};

export default function Monitoring() {
  const [readings, setReadings] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPipelineFilter, setSelectedPipelineFilter] = useState("");
  const [showForm, setShowForm] = useState(true); // Default open for operators
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const loadData = () => {
    setLoading(true);
    getMonitoring(selectedPipelineFilter ? { pipelineId: selectedPipelineFilter } : {})
      .then(setReadings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    getPipelines().then((data) => {
      setPipelines(data);
      if (data.length > 0 && !form.pipelineId) {
        setForm((prev) => ({
          ...prev,
          pipelineId: data[0].pipelineId,
          segmentId: data[0].segments?.[0]?.segmentId || "SEG-001",
        }));
      }
    }).catch(() => {});

    const handleRoleChanged = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener("userRoleChanged", handleRoleChanged);
    return () => window.removeEventListener("userRoleChanged", handleRoleChanged);
  }, [selectedPipelineFilter]);

  const isAdmin = currentUser?.role === "Administrator";

  const handleApplyPreset = (presetValues) => {
    setForm((prev) => ({
      ...prev,
      ...presetValues,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const payload = {
        pipelineId: form.pipelineId,
        segmentId: form.segmentId,
        pressure: Number(form.pressure),
        flow: Number(form.flow),
        temperature: Number(form.temperature),
        vibration: Number(form.vibration),
        corrosion: Number(form.corrosion),
      };

      const res = await postMonitoring(payload);
      setForm((prev) => ({
        ...prev,
        pressure: "",
        flow: "",
        temperature: "",
        vibration: "",
        corrosion: "",
      }));

      if (res.alertsCreated && res.alertsCreated.length > 0) {
        setSuccess(
          `Telemetry logged! Calculated Health Score: ${res.reading.healthScore} (${res.reading.riskLevel}). Auto-dispatched ${res.alertsCreated.length} alert(s) to the control room!`
        );
      } else {
        setSuccess(
          `Telemetry logged! Calculated Health Score: ${res.reading.healthScore} (${res.reading.riskLevel}). Operational envelope nominal.`
        );
      }
      setTimeout(() => setSuccess(null), 5000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Sensor Telemetry & Health Monitoring</h2>
          <p>Continuous operational ingestion, multi-variable health computation, and threshold tracking.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} /> {showForm ? "Hide Form" : "Log Sensor Reading"}
          </button>
        </div>
      </div>

      {/* Role Context Notification Banner */}
      <div className={`role-banner ${isAdmin ? "administrator" : "operator"}`}>
        <div className="role-banner-left">
          {isAdmin ? <ShieldCheck size={18} /> : <Radio size={18} />}
          <span>
            {isAdmin ? (
              <>
                <strong>Administrator Telemetry Audit Mode:</strong> Reviewing incoming data streams and verifying automated HealthEngine threshold triggers across all monitored sectors.
              </>
            ) : (
              <>
                <strong>Operator Shift Telemetry Active:</strong> Operators are responsible for continuous sensor logging and immediate response when parameter bounds exceed tolerance envelopes.
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

      {/* Sensor Ingestion Card */}
      {showForm && (
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} color="var(--blue-primary)" />
              {isAdmin ? "Supervisory Telemetry Submission" : "Operator Shift Telemetry Ingestion"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Quick Test Ingestion:
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: "3px 8px" }}
                onClick={() => handleApplyPreset({ pressure: 74, flow: 68, temperature: 44, vibration: 22, corrosion: 6 })}
              >
                Normal
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: "3px 8px" }}
                onClick={() => handleApplyPreset({ pressure: 82, flow: 72, temperature: 52, vibration: 78, corrosion: 9 })}
              >
                High Vibration
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: "3px 8px" }}
                onClick={() => handleApplyPreset({ pressure: 108, flow: 95, temperature: 74, vibration: 84, corrosion: 28 })}
              >
                Surge Anomaly
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Pipeline ID *</label>
                <select
                  className="form-control"
                  value={form.pipelineId}
                  onChange={(e) => {
                    const selP = pipelines.find((p) => p.pipelineId === e.target.value);
                    setForm({
                      ...form,
                      pipelineId: e.target.value,
                      segmentId: selP?.segments?.[0]?.segmentId || "",
                    });
                  }}
                  required
                >
                  <option value="">Select Pipeline...</option>
                  {pipelines.map((p) => (
                    <option key={p.pipelineId} value={p.pipelineId}>
                      {p.pipelineId} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Segment ID *</label>
                <input
                  className="form-control"
                  placeholder="e.g. SEG-001"
                  value={form.segmentId}
                  onChange={(e) => setForm({ ...form, segmentId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pressure (PSI) [Safe &le; 85]</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 78"
                  value={form.pressure}
                  onChange={(e) => setForm({ ...form, pressure: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Flow Rate (m³/h) [Safe &le; 90]</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 70"
                  value={form.flow}
                  onChange={(e) => setForm({ ...form, flow: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Temperature (°C) [Safe &le; 60]</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 45"
                  value={form.temperature}
                  onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vibration (Hz) [Safe &le; 60]</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 24"
                  value={form.vibration}
                  onChange={(e) => setForm({ ...form, vibration: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Corrosion Rate (%) [Safe &le; 15]</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 8"
                  value={form.corrosion}
                  onChange={(e) => setForm({ ...form, corrosion: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Processing Health Scoring..." : "Submit Sensor Reading"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Threshold Indicator Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
            Filter by Pipeline:
          </label>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={selectedPipelineFilter}
            onChange={(e) => setSelectedPipelineFilter(e.target.value)}
          >
            <option value="">All Pipelines</option>
            {pipelines.map((p) => (
              <option key={p.pipelineId} value={p.pipelineId}>
                {p.pipelineId} ({p.name})
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Showing <strong>{readings.length}</strong> recorded telemetry readings
        </div>
      </div>

      {/* Sensor Readings Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline / Segment</th>
              <th>Pressure</th>
              <th>Flow</th>
              <th>Temp</th>
              <th>Vibration</th>
              <th>Corrosion</th>
              <th>Health Score</th>
              <th>Risk Level</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                  No monitoring readings available for this filter.
                </td>
              </tr>
            ) : (
              readings.map((r) => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.pipelineId}</strong>
                    <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>/ {r.segmentId}</span>
                  </td>
                  <td>
                    <span style={{ color: r.pressure > 85 ? "var(--red-critical)" : "inherit", fontWeight: r.pressure > 85 ? 600 : "normal" }}>
                      {r.pressure} psi
                    </span>
                  </td>
                  <td>
                    <span style={{ color: r.flow > 90 ? "var(--red-critical)" : "inherit", fontWeight: r.flow > 90 ? 600 : "normal" }}>
                      {r.flow} m³/h
                    </span>
                  </td>
                  <td>
                    <span style={{ color: r.temperature > 60 ? "var(--red-critical)" : "inherit", fontWeight: r.temperature > 60 ? 600 : "normal" }}>
                      {r.temperature}°C
                    </span>
                  </td>
                  <td>
                    <span style={{ color: r.vibration > 60 ? "var(--red-critical)" : "inherit", fontWeight: r.vibration > 60 ? 600 : "normal" }}>
                      {r.vibration}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: r.corrosion > 15 ? "var(--red-critical)" : "inherit", fontWeight: r.corrosion > 15 ? 600 : "normal" }}>
                      {r.corrosion}%
                    </span>
                  </td>
                  <td>
                    <strong>{r.healthScore}</strong>/100
                  </td>
                  <td>
                    <RiskBadge level={r.riskLevel} />
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                    {new Date(r.timestamp).toLocaleString()}
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
