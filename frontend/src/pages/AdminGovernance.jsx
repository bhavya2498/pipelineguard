import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Lock,
  UserCog,
  KeyRound,
} from "lucide-react";
import { getUsers, updateUserRole, getCurrentUser, setCurrentUser } from "../api/client.js";

export default function AdminGovernance() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setCurrentUserState(getCurrentUser());
    loadUsers();

    const handleRoleChanged = () => {
      setCurrentUserState(getCurrentUser());
      loadUsers();
    };

    window.addEventListener("userRoleChanged", handleRoleChanged);
    return () => window.removeEventListener("userRoleChanged", handleRoleChanged);
  }, []);

  const handleRoleToggle = async (userId, newRole) => {
    try {
      setError(null);
      await updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole}`);
      setTimeout(() => setSuccess(null), 3000);

      // If user modified their own role, update localStorage
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, role: newRole });
      }

      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // If logged in user is an Operator, show Access Control notice
  if (currentUser?.role === "Operator") {
    return (
      <div className="card" style={{ maxWidth: 640, margin: "40px auto", textAlign: "center", padding: "40px 32px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--amber-light)",
            color: "var(--amber-warning)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Lock size={28} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>
          Administrator Clearance Required
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          You are currently signed in under the <strong>Operator</strong> profile (<code>{currentUser?.email}</code>).
          The System Governance module governs personnel credentials, role elevations, and high-level infrastructure permissions.
        </p>

        <div style={{ background: "var(--bg-subtle)", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 24, textAlign: "left", fontSize: 13 }}>
          <div style={{ fontWeight: 600, color: "var(--text-main)", marginBottom: 6 }}>
            Active Role Permissions Matrix:
          </div>
          <ul style={{ paddingLeft: 20, color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 4 }}>
            <li><strong>Operator:</strong> Live sensor monitoring, alert triage/acknowledgment, field inspection logging, and maintenance requests.</li>
            <li><strong>Administrator:</strong> Pipeline commissioning/decommissioning, user governance, critical alert resolution sign-off.</li>
          </ul>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setCurrentUser({
              id: "admin-quick-id",
              name: "Administrator",
              email: "admin@pipelineguard.com",
              role: "Administrator",
            });
          }}
        >
          <KeyRound size={16} /> Switch to Administrator Role
        </button>
      </div>
    );
  }

  const operatorCount = users.filter((u) => u.role === "Operator").length;
  const adminCount = users.filter((u) => u.role === "Administrator").length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>System Governance & Access Control</h2>
          <p>Personnel directory, role-based access management, and infrastructure authority configuration.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadUsers}>
          <RefreshCw size={14} /> Refresh Directory
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Overview Stat Grid */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-box purple">
            <Users size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Total System Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box blue">
            <UserCheck size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Field Operators</span>
            <span className="stat-value">{operatorCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <ShieldCheck size={22} />
          </div>
          <div className="stat-card-details">
            <span className="stat-label">System Administrators</span>
            <span className="stat-value">{adminCount}</span>
          </div>
        </div>
      </div>

      {/* Role Authority Summary Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} color="var(--lavender-accent)" /> Active RBAC Authority Specifications
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#f0f7ff", padding: 18, borderRadius: "var(--radius-md)", border: "1px solid #bae6fd" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="role-badge operator">Operator Role</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0369a1" }}>Frontline Safety Operations</span>
            </div>
            <ul style={{ fontSize: 13, color: "#0c4a6e", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Enter and monitor live multi-sensor pipeline telemetry</li>
              <li>Triage and Acknowledge threshold violation alerts</li>
              <li>Resolve standard and preventive maintenance warnings</li>
              <li>Log non-destructive field inspection reports</li>
              <li>Submit preventive maintenance work requests</li>
              <li>Run hypothetical operational What-If simulations</li>
              <li><strong style={{ color: "#b91c1c" }}>Restricted:</strong> Cannot decommission pipelines or override critical emergencies</li>
            </ul>
          </div>

          <div style={{ background: "#faf5ff", padding: 18, borderRadius: "var(--radius-md)", border: "1px solid #e9d5ff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="role-badge administrator">Administrator Role</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#7e22ce" }}>Full System Governance</span>
            </div>
            <ul style={{ fontSize: 13, color: "#581c87", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              <li>Full access to all 10 modules & control center views</li>
              <li>Register, reconfigure, and delete pipeline assets</li>
              <li>Add and update multi-segment infrastructure</li>
              <li>Authorize and resolve CRITICAL emergency incident alerts</li>
              <li>Assign engineering personnel & approve work orders</li>
              <li>Trigger simulated system emergency drills</li>
              <li>Manage user profiles and promote/demote access roles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)" }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Personnel Directory & Role Assignments</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Assigned Role</th>
              <th>Registered At</th>
              <th style={{ textAlign: "right" }}>Role Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                  Loading personnel directory...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                  No registered users on record.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)" }}>{u.email}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role === "Administrator" ? "administrator" : "operator"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "System Default"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {u.role === "Operator" ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRoleToggle(u._id, "Administrator")}
                        title="Elevate permissions to Administrator"
                      >
                        <ShieldCheck size={13} color="var(--lavender-accent)" /> Promote to Admin
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRoleToggle(u._id, "Operator")}
                        title="Demote to Field Operator"
                      >
                        <UserCog size={13} color="var(--blue-primary)" /> Set as Operator
                      </button>
                    )}
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
