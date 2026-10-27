import React, { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  RefreshCw,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { getMaintenance, createMaintenance, patchMaintenance, getPipelines, getCurrentUser } from "../api/client.js";

const initialForm = {
  pipelineId: "",
  segmentId: "",
  issue: "",
  assignedPerson: "",
  dueDate: "",
};

export default function Maintenance() {
  const [tasks, setTasks] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const loadData = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;

    getMaintenance(params)
      .then(setTasks)
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
  }, [statusFilter]);

  const isAdmin = currentUser?.role === "Administrator";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
      };
      const res = await createMaintenance(payload);
      setForm(initialForm);
      setShowForm(false);
      setSuccess(`Maintenance task dispatched! Priority auto-computed as: ${res.priority}`);
      setTimeout(() => setSuccess(null), 4000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await patchMaintenance(taskId, { status: newStatus });
      setSuccess(`Task marked as ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Preventive & Corrective Maintenance Work Orders</h2>
          <p>Prioritized work orders driven by health scoring, sensor warnings, and inspection reports.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} /> {showForm ? "Close Form" : "Create Work Order"}
          </button>
        </div>
      </div>

      {/* Role Context Notification Banner */}
      <div className={`role-banner ${isAdmin ? "administrator" : "operator"}`}>
        <div className="role-banner-left">
          {isAdmin ? <ShieldCheck size={18} /> : <Wrench size={18} />}
          <span>
            {isAdmin ? (
              <>
                <strong>Administrator Maintenance Governance:</strong> Assign technical specialists, monitor cross-sector repair timelines, and oversee work order compliance.
              </>
            ) : (
              <>
                <strong>Operator Maintenance Request & Execution:</strong> Operators report degraded pipeline anomalies. You are authorized to begin ("Start") and close ("Complete") work orders.
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

      {/* Create Maintenance Work Order Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">
              <Wrench size={18} color="var(--blue-primary)" /> Dispatch New Maintenance Task
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Priority is auto-calculated from health score & open alerts
            </span>
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
                  placeholder="e.g. SEG-004"
                  value={form.segmentId}
                  onChange={(e) => setForm({ ...form, segmentId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Specialist</label>
                <input
                  className="form-control"
                  placeholder={isAdmin ? "e.g. Marcus Vance (Mechanical Lead)" : "e.g. Self or Duty Technician"}
                  value={form.assignedPerson}
                  onChange={(e) => setForm({ ...form, assignedPerson: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Target Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Maintenance Scope & Issue Description *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Replace isolation valve seal and perform pressure hydrostatic test"
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
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
              <button type="submit" className="btn btn-primary">
                Dispatch Work Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div className="tab-pill-group">
          <button
            className={`tab-pill ${statusFilter === "" ? "active" : ""}`}
            onClick={() => setStatusFilter("")}
          >
            All Tasks
          </button>
          <button
            className={`tab-pill ${statusFilter === "Pending" ? "active" : ""}`}
            onClick={() => setStatusFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`tab-pill ${statusFilter === "In Progress" ? "active" : ""}`}
            onClick={() => setStatusFilter("In Progress")}
          >
            In Progress
          </button>
          <button
            className={`tab-pill ${statusFilter === "Completed" ? "active" : ""}`}
            onClick={() => setStatusFilter("Completed")}
          >
            Completed
          </button>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Showing <strong>{tasks.length}</strong> maintenance task(s)
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pipeline / Segment</th>
              <th>Maintenance Issue</th>
              <th>Calculated Priority</th>
              <th>Assigned Specialist</th>
              <th>Progress Status</th>
              <th>Target Due Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px", color: "var(--text-muted)" }}>
                  No maintenance records matching this status.
                </td>
              </tr>
            ) : (
              tasks.map((m) => {
                let priorityBg = "var(--green-light)";
                let priorityText = "#065f46";
                let priorityBorder = "var(--green-border)";

                if (m.priority === "HIGH") {
                  priorityBg = "var(--red-light)";
                  priorityText = "#991b1b";
                  priorityBorder = "var(--red-border)";
                } else if (m.priority === "MEDIUM") {
                  priorityBg = "var(--amber-light)";
                  priorityText = "#92400e";
                  priorityBorder = "var(--amber-border)";
                }

                return (
                  <tr key={m._id}>
                    <td>
                      <strong>{m.pipelineId}</strong>
                      <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>/ {m.segmentId}</span>
                    </td>
                    <td style={{ maxWidth: 320 }}>
                      <span style={{ fontWeight: 500 }}>{m.issue}</span>
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          background: priorityBg,
                          color: priorityText,
                          border: `1px solid ${priorityBorder}`,
                        }}
                      >
                        {m.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <User size={13} color="var(--text-muted)" />
                        {m.assignedPerson || "Unassigned"}
                      </span>
                    </td>
                    <td>
                      <span
                        className="risk-badge"
                        style={{
                          background:
                            m.status === "Completed"
                              ? "var(--green-light)"
                              : m.status === "In Progress"
                              ? "var(--blue-light)"
                              : "var(--bg-subtle)",
                          color:
                            m.status === "Completed"
                              ? "#065f46"
                              : m.status === "In Progress"
                              ? "var(--blue-primary)"
                              : "var(--text-secondary)",
                          border: `1px solid ${
                            m.status === "Completed"
                              ? "var(--green-border)"
                              : m.status === "In Progress"
                              ? "var(--blue-border)"
                              : "var(--border-light)"
                          }`,
                        }}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td>
                      {m.dueDate ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                          <Calendar size={13} color="var(--blue-primary)" />
                          {new Date(m.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        {m.status !== "In Progress" && m.status !== "Completed" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUpdateStatus(m._id, "In Progress")}
                            title="Start Task"
                          >
                            <Play size={12} /> Start
                          </button>
                        )}
                        {m.status !== "Completed" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateStatus(m._id, "Completed")}
                            title="Complete Task"
                          >
                            <CheckCircle2 size={13} /> Complete
                          </button>
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
