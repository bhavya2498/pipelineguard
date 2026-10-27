import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Filter,
  RefreshCw,
} from "lucide-react";
import { getInspections, createInspection, getPipelines } from "../api/client.js";

const initialForm = {
  pipelineId: "",
  segmentId: "",
  date: new Date().toISOString().split("T")[0],
  result: "Normal",
  report: "",
  nextInspection: "",
};

export default function Inspections() {
  const [inspections, setInspections] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPipeline, setFilterPipeline] = useState("");

  const loadData = () => {
    setLoading(true);
    getInspections(filterPipeline ? { pipelineId: filterPipeline } : {})
      .then(setInspections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    getPipelines().then(setPipelines).catch(() => {});
  }, [filterPipeline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createInspection({
        ...form,
        date: new Date(form.date),
        nextInspection: form.nextInspection ? new Date(form.nextInspection) : undefined,
      });
      setForm(initialForm);
      setShowForm(false);
      setSuccess("Inspection log recorded successfully");
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
          <h2>Physical & Ultrasonic Inspection Logs</h2>
          <p>Document field audit reports, non-destructive evaluations, and track future inspection compliance.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} /> {showForm ? "Close Form" : "Log New Inspection"}
          </button>
        </div>
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

      {/* Log Inspection Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">
              <ClipboardCheck size={18} color="var(--blue-primary)" /> Record Field Inspection Report
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
                      {p.pipelineId} ({p.name})
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
                <label>Inspection Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Evaluation Result</label>
                <select
                  className="form-control"
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                >
                  <option value="Normal">Normal — No Action Required</option>
                  <option value="Needs Attention">Needs Attention — Preventive Repair</option>
                  <option value="Critical">Critical — Immediate Intervention</option>
                </select>
              </div>

              <div className="form-group">
                <label>Next Scheduled Inspection</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.nextInspection}
                  onChange={(e) => setForm({ ...form, nextInspection: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Engineering Findings & Report Notes</label>
                <input
                  className="form-control"
                  placeholder="e.g. Radiographic test revealed minor wall thinning at elbow joint."
                  value={form.report}
                  onChange={(e) => setForm({ ...form, report: e.target.value })}
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
              <button type="submit" className="btn btn-primary">
                Save Inspection Record
              </button>
            </div>
          </form>
        </div>
      )}

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
          Showing <strong>{inspections.length}</strong> recorded inspection audit(s)
        </div>
      </div>

      {/* Inspections Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline / Segment</th>
              <th>Date Conducted</th>
              <th>Evaluation Result</th>
              <th>Audit Findings & Report</th>
              <th>Next Inspection Due</th>
            </tr>
          </thead>
          <tbody>
            {inspections.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No inspection logs on record for this filter.
                </td>
              </tr>
            ) : (
              inspections.map((i) => {
                let badgeColor = "var(--green-light)";
                let textColor = "#065f46";
                let borderColor = "var(--green-border)";

                if (i.result === "Needs Attention") {
                  badgeColor = "var(--amber-light)";
                  textColor = "#92400e";
                  borderColor = "var(--amber-border)";
                } else if (i.result === "Critical") {
                  badgeColor = "var(--red-light)";
                  textColor = "#991b1b";
                  borderColor = "var(--red-border)";
                }

                return (
                  <tr key={i._id}>
                    <td>
                      <strong>{i.pipelineId}</strong>
                      <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>/ {i.segmentId}</span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={13} color="var(--blue-primary)" />
                        {new Date(i.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          background: badgeColor,
                          color: textColor,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        {i.result}
                      </span>
                    </td>
                    <td style={{ maxWidth: 350 }}>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {i.report || "Routine visual check complete. No anomalies."}
                      </span>
                    </td>
                    <td>
                      {i.nextInspection ? (
                        <span style={{ fontSize: 13 }}>
                          {new Date(i.nextInspection).toLocaleDateString()}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>None scheduled</span>
                      )}
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
