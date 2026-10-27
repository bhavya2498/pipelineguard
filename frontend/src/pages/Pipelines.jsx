import React, { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  MapPin,
  Lock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { getPipelines, createPipeline, deletePipeline, updatePipeline, getCurrentUser } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

const initialForm = {
  pipelineId: "",
  name: "",
  location: "",
  initialSegmentId: "",
  initialSegmentName: "",
  status: "ACTIVE",
};

export default function Pipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedPipeline, setExpandedPipeline] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // New segment sub-form state
  const [newSegment, setNewSegment] = useState({ segmentId: "", name: "" });

  const loadData = () => {
    setLoading(true);
    getPipelines()
      .then(setPipelines)
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

  const handleCreatePipeline = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAdmin) {
      setError("Access Denied: Only Administrators can commission new pipeline infrastructure.");
      return;
    }

    const segments = [];
    if (form.initialSegmentId.trim()) {
      segments.push({
        segmentId: form.initialSegmentId.trim(),
        name: form.initialSegmentName.trim() || `Segment 1`,
        lastHealthScore: 100,
        lastRiskLevel: "LOW",
      });
    }

    try {
      await createPipeline({
        pipelineId: form.pipelineId.trim(),
        name: form.name.trim(),
        location: form.location.trim(),
        status: form.status,
        segments,
      });
      setForm(initialForm);
      setShowAddForm(false);
      setSuccess(`Pipeline ${form.pipelineId} created successfully`);
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (pipelineId) => {
    if (!isAdmin) {
      setError("Access Denied: Only Administrators can decommission pipelines.");
      return;
    }

    if (!window.confirm(`Are you sure you want to decommission pipeline ${pipelineId}?`)) return;
    try {
      await deletePipeline(pipelineId);
      setSuccess(`Pipeline ${pipelineId} decommissioned`);
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleAddSegment = async (pipeline) => {
    if (!isAdmin) {
      setError("Access Denied: Only Administrators can append segments.");
      return;
    }

    if (!newSegment.segmentId.trim()) return;
    try {
      const updatedSegments = [
        ...(pipeline.segments || []),
        {
          segmentId: newSegment.segmentId.trim(),
          name: newSegment.name.trim() || `Segment ${(pipeline.segments?.length || 0) + 1}`,
          lastHealthScore: 100,
          lastRiskLevel: "LOW",
        },
      ];
      await updatePipeline(pipeline.pipelineId, { segments: updatedSegments });
      setNewSegment({ segmentId: "", name: "" });
      setSuccess(`Segment added to ${pipeline.pipelineId}`);
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const filteredPipelines = pipelines.filter(
    (p) =>
      p.pipelineId.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pipeline Asset Infrastructure</h2>
          <p>Register, inspect, and configure multi-segment transport pipelines.</p>
        </div>
        <div>
          {isAdmin ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={16} /> {showAddForm ? "Close Form" : "Commission New Pipeline"}
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              disabled
              title="Only Administrators can register new pipelines"
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            >
              <Lock size={14} /> Commission Pipeline (Admin Only)
            </button>
          )}
        </div>
      </div>

      {/* Role Context Notification Banner */}
      <div className={`role-banner ${isAdmin ? "administrator" : "operator"}`}>
        <div className="role-banner-left">
          {isAdmin ? <ShieldCheck size={18} /> : <Lock size={18} />}
          <span>
            {isAdmin ? (
              <>
                <strong>Administrator Governance Active:</strong> You have full authority to commission new pipelines, reconfigure segment topology, and decommission assets.
              </>
            ) : (
              <>
                <strong>Operator Clearance:</strong> Pipeline structural commissioning and decommissioning are restricted to System Administrators. You have full clearance to inspect segment health scores and monitor telemetry.
              </>
            )}
          </span>
        </div>
        <span className={`role-badge ${isAdmin ? "administrator" : "operator"}`}>
          {currentUser?.role || "Operator"} Mode
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

      {/* Registration Form Accordion (Administrator only) */}
      {showAddForm && isAdmin && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">
              <Plus size={18} color="var(--blue-primary)" /> Register New Pipeline Asset
            </div>
            <span className="role-badge administrator">Admin Exclusive</span>
          </div>
          <form onSubmit={handleCreatePipeline}>
            <div className="form-grid">
              <div className="form-group">
                <label>Pipeline ID *</label>
                <input
                  className="form-control"
                  placeholder="e.g. P-004"
                  value={form.pipelineId}
                  onChange={(e) => setForm({ ...form, pipelineId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pipeline Name *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Northern Ridge Line"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location / Sector *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Sector 8 - Alpine Pass"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Operational Status</label>
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Initial Segment ID (Optional)</label>
                <input
                  className="form-control"
                  placeholder="e.g. SEG-006"
                  value={form.initialSegmentId}
                  onChange={(e) => setForm({ ...form, initialSegmentId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Segment Name (Optional)</label>
                <input
                  className="form-control"
                  placeholder="e.g. Intake Station"
                  value={form.initialSegmentName}
                  onChange={(e) => setForm({ ...form, initialSegmentName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Pipeline
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div style={{ position: "relative", minWidth: 260 }}>
          <Search
            size={16}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          />
          <input
            className="form-control"
            style={{ paddingLeft: 36 }}
            placeholder="Search pipelines by ID, name, sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Showing <strong>{filteredPipelines.length}</strong> of {pipelines.length} pipelines
        </div>
      </div>

      {/* Pipelines Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Segments Breakdown</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPipelines.map((p) => {
              const isExpanded = expandedPipeline === p.pipelineId;
              return (
                <React.Fragment key={p.pipelineId}>
                  <tr>
                    <td>
                      <strong>{p.pipelineId}</strong>
                    </td>
                    <td>{p.name}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--text-secondary)" }}>
                        <MapPin size={14} color="var(--blue-primary)" />
                        {p.location}
                      </span>
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          background: p.status === "ACTIVE" ? "var(--green-light)" : "var(--amber-light)",
                          color: p.status === "ACTIVE" ? "#065f46" : "#92400e",
                          border: `1px solid ${p.status === "ACTIVE" ? "var(--green-border)" : "var(--amber-border)"}`,
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setExpandedPipeline(isExpanded ? null : p.pipelineId)}
                      >
                        <Activity size={13} />
                        {p.segments?.length || 0} Segments
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {isAdmin ? (
                        <button
                          className="btn btn-danger btn-sm"
                          title="Decommission pipeline"
                          onClick={() => handleDelete(p.pipelineId)}
                        >
                          <Trash2 size={14} /> Decommission
                        </button>
                      ) : (
                        <span className="locked-badge" title="Only Administrators can delete pipelines">
                          <Lock size={12} /> Protected Asset
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Segments Details */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} style={{ background: "#f8fafc", padding: "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-main)" }}>
                            Segments for Pipeline {p.pipelineId} ({p.name})
                          </span>
                        </div>

                        {(!p.segments || p.segments.length === 0) ? (
                          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No segments registered for this pipeline.</p>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 16 }}>
                            {p.segments.map((seg) => (
                              <div
                                key={seg.segmentId}
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid var(--border-light)",
                                  borderRadius: "var(--radius-md)",
                                  padding: "12px 16px",
                                  boxShadow: "var(--shadow-sm)",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <strong>{seg.segmentId}</strong>
                                  <RiskBadge level={seg.lastRiskLevel} />
                                </div>
                                <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 4 }}>
                                  {seg.name || "Main Line"}
                                </div>
                                <div style={{ marginTop: 8, fontSize: 12 }}>
                                  Health Score: <strong>{seg.lastHealthScore || 100}/100</strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Segment Inline (Administrator only) */}
                        {isAdmin ? (
                          <div
                            style={{
                              background: "#ffffff",
                              padding: 12,
                              borderRadius: "var(--radius-md)",
                              border: "1px dashed var(--border-subtle)",
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              maxWidth: 600,
                            }}
                          >
                            <input
                              className="form-control"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              placeholder="New Segment ID (e.g. SEG-007)"
                              value={newSegment.segmentId}
                              onChange={(e) => setNewSegment({ ...newSegment, segmentId: e.target.value })}
                            />
                            <input
                              className="form-control"
                              style={{ padding: "6px 10px", fontSize: 13 }}
                              placeholder="Segment Name (e.g. Hill Pass)"
                              value={newSegment.name}
                              onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAddSegment(p)}
                            >
                              <Plus size={14} /> Add Segment
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, fontStyle: "italic" }}>
                            <Lock size={13} /> Adding segments to pipeline topology requires Administrator privileges.
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
