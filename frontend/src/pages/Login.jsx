import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Radio,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Shield,
  Zap,
} from "lucide-react";
import { loginUser, registerUser, setCurrentUser } from "../api/client.js";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("operator@pipelineguard.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Operator");
  const [selectedDemo, setSelectedDemo] = useState("operator"); // "operator" | "admin"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelectDemoRole = (type) => {
    setError(null);
    setIsRegister(false);
    setSelectedDemo(type);

    if (type === "operator") {
      setEmail("operator@pipelineguard.com");
      setPassword("password123");
    } else {
      setEmail("admin@pipelineguard.com");
      setPassword("adminpassword");
    }
  };

  const handleQuickSignIn = async (type) => {
    setError(null);
    setIsRegister(false);
    setSelectedDemo(type);
    setLoading(true);

    const loginEmail = type === "operator" ? "operator@pipelineguard.com" : "admin@pipelineguard.com";
    const loginPassword = type === "operator" ? "password123" : "adminpassword";
    setEmail(loginEmail);
    setPassword(loginPassword);

    try {
      const user = await loginUser({ email: loginEmail, password: loginPassword });
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const user = await registerUser({ name, email, password, role });
        setCurrentUser(user);
        navigate("/dashboard");
      } else {
        const user = await loginUser({ email, password });
        setCurrentUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 520, width: "100%" }}>
        {/* Navigation Back */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Back to Platform Overview
          </Link>
        </div>

        {/* Header */}
        <div className="auth-header">
          <div className="brand-icon" style={{ margin: "0 auto 12px", width: 48, height: 48 }}>
            <ShieldCheck size={26} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>
            {isRegister ? "Register Credentials" : "Enterprise Access Portal"}
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 4 }}>
            {isRegister
              ? "Provision access for operations or administrative personnel"
              : "Select a demo access role or authenticate with your enterprise credentials"}
          </p>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: 20 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Role-Based Demo Selection */}
        {!isRegister && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                Role-Based Demo Access
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Click to switch or quick sign-in</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Operator Role Card */}
              <div
                onClick={() => handleSelectDemoRole("operator")}
                style={{
                  border: `2px solid ${selectedDemo === "operator" ? "var(--blue-primary)" : "var(--border-light)"}`,
                  background: selectedDemo === "operator" ? "var(--blue-light)" : "#ffffff",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  position: "relative",
                  boxShadow: selectedDemo === "operator" ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Radio size={16} color="var(--blue-primary)" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-main)" }}>Operator</span>
                  </div>
                  {selectedDemo === "operator" && <CheckCircle2 size={16} color="var(--blue-primary)" />}
                </div>

                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--blue-primary)",
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  Field Telemetry & Alerts
                </span>

                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                  Real-time telemetry, alert acknowledgment, sensor logging & simulations.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickSignIn("operator");
                  }}
                  disabled={loading}
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: "var(--radius-sm)",
                    background: selectedDemo === "operator" ? "var(--blue-primary)" : "var(--bg-subtle)",
                    color: selectedDemo === "operator" ? "#ffffff" : "var(--text-main)",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Zap size={12} /> Quick Sign In
                </button>
              </div>

              {/* Administrator Role Card */}
              <div
                onClick={() => handleSelectDemoRole("admin")}
                style={{
                  border: `2px solid ${selectedDemo === "admin" ? "var(--lavender-accent)" : "var(--border-light)"}`,
                  background: selectedDemo === "admin" ? "var(--lavender-light)" : "#ffffff",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  position: "relative",
                  boxShadow: selectedDemo === "admin" ? "0 4px 12px rgba(139, 92, 246, 0.15)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={16} color="var(--lavender-accent)" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-main)" }}>Administrator</span>
                  </div>
                  {selectedDemo === "admin" && <CheckCircle2 size={16} color="var(--lavender-accent)" />}
                </div>

                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "var(--lavender-accent)",
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  Full Asset Governance
                </span>

                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                  Asset commissioning, critical overrides, user RBAC & network administration.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickSignIn("admin");
                  }}
                  disabled={loading}
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: "var(--radius-sm)",
                    background: selectedDemo === "admin" ? "var(--lavender-accent)" : "var(--bg-subtle)",
                    color: selectedDemo === "admin" ? "#ffffff" : "var(--text-main)",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Zap size={12} /> Quick Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isRegister && (
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} /> Full Name & Title
              </label>
              <input
                className="form-control"
                placeholder="e.g. Alex Morgan, Senior Field Engineer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={14} /> Corporate Work Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="operator@pipelineguard.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Shield size={14} /> System Role Assignment
              </label>
              <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Operator">Operator (Field Telemetry & Alert Triage)</option>
                <option value="Administrator">Administrator (Asset Governance & System RBAC)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: 6,
              padding: "12px",
              fontSize: 14.5,
              background:
                !isRegister && selectedDemo === "admin"
                  ? "var(--lavender-accent)"
                  : "var(--blue-primary)",
            }}
            disabled={loading}
          >
            {loading ? (
              "Authenticating..."
            ) : isRegister ? (
              <>
                <UserPlus size={16} /> Register Profile
              </>
            ) : (
              <>
                <LogIn size={16} /> Authenticate as {selectedDemo === "admin" ? "Administrator" : "Operator"}
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: "1px solid var(--border-light)",
            textAlign: "center",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          {isRegister ? "Already hold an assigned profile?" : "Need to provision a new user role?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--blue-primary)",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isRegister ? "Sign In instead" : "Register here"}
          </button>
        </div>
      </div>
    </div>
  );
}
