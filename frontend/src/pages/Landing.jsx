import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Sliders,
  AlertTriangle,
  Wrench,
  Layers,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Flame,
  Droplets,
  Factory,
  Anchor,
  Zap,
  Lock,
  FileCheck,
  Gauge,
  Radio,
  Clock,
  Cpu,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="landing-shell">
      {/* Enterprise Navigation Bar */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="brand-icon">
            <ShieldCheck size={22} />
          </div>
          <div className="brand-info">
            <h1 style={{ fontSize: 19 }}>PipelineGuard</h1>
            <span>Industrial Safety & Integrity</span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--text-secondary)",
          }}
          className="desktop-only"
        >
          <a href="#capabilities" style={{ color: "inherit", textDecoration: "none" }}>
            Capabilities
          </a>
          <a href="#digital-twin" style={{ color: "inherit", textDecoration: "none" }}>
            Digital Twin
          </a>
          <a href="#industries" style={{ color: "inherit", textDecoration: "none" }}>
            Industries
          </a>
          <a href="#governance" style={{ color: "inherit", textDecoration: "none" }}>
            Role Governance
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            Launch Console <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" style={{ paddingBottom: 20 }}>
        <div className="hero-pill">
          <ShieldCheck size={14} />
          <span>Industrial Infrastructure Telemetry & Risk Mitigation</span>
        </div>

        <h1 className="hero-title" style={{ maxWidth: 960, margin: "0 auto 20px" }}>
          Next-Generation Pipeline Safety & <span>Predictive Integrity Intelligence</span>
        </h1>

        <p className="hero-subtitle" style={{ maxWidth: 780 }}>
          Continuous multi-sensor telemetry processing, dynamic multi-segment health index scoring,
          automated threshold breach alerting, and digital-twin operational risk simulation for mission-critical
          energy and utility transmission networks.
        </p>

        <div className="hero-cta-group">
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: "13px 26px", fontSize: 15 }}>
            Open Control Center <ArrowRight size={18} />
          </Link>
          <Link to="/simulator" className="btn btn-secondary" style={{ padding: "13px 26px", fontSize: 15 }}>
            <Sliders size={18} /> Digital Twin Simulator
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: "13px 26px", fontSize: 15 }}>
            Role-Based Access
          </Link>
        </div>

        {/* Industrial Pipeline Hero Image Showcase with Live Telemetry Overlays */}
        <div className="hero-showcase-container" id="digital-twin">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
            alt="Industrial Pipeline Infrastructure"
            className="hero-showcase-image"
          />
          <div className="hero-showcase-overlay" />

          {/* Floating Telemetry Badge 1: Top-Left Segment Metrics */}
          <div
            className="hero-telemetry-badge"
            style={{ top: 24, left: 24, textAlign: "left", maxWidth: 320 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="pulse-indicator" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>
                  Live Network Telemetry
                </span>
              </div>
              <span className="badge badge-success" style={{ fontSize: 10 }}>Active</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue-primary)", marginTop: 2 }}>
              North Corridor & East Valley Line
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", gap: 10, marginTop: 2 }}>
              <span>P: <strong>72.4 bar</strong></span>
              <span>Flow: <strong>1,240 m³/h</strong></span>
              <span>Temp: <strong>28.5°C</strong></span>
            </div>
          </div>

          {/* Floating Telemetry Badge 2: Top-Right Health Gauge */}
          <div
            className="hero-telemetry-badge"
            style={{ top: 24, right: 24, textAlign: "left", minWidth: 220 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Activity size={16} color="var(--green-normal)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>
                Integrity Health Index
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: "var(--green-normal)" }}>96.4</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ 100 Nominal</span>
            </div>
            <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
              Corrosion rate: 0.03 mm/yr (Low Risk)
            </span>
          </div>

          {/* Floating Telemetry Badge 3: Bottom-Center Alert Monitor */}
          <div
            className="hero-telemetry-badge"
            style={{
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: "10px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} color="var(--blue-primary)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main)" }}>
                Automated Safety Monitoring
              </span>
            </div>
            <div style={{ height: 16, width: 1, background: "var(--border-light)" }} />
            <div style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
              0 Critical Breaches &bull; ISO 55000 / API 1160 Architecture
            </div>
          </div>
        </div>

        {/* Mission-Critical Key Metrics Strip */}
        <div
          className="card"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
            textAlign: "center",
            padding: "28px 24px",
            background: "#ffffff",
          }}
        >
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--blue-primary)", letterSpacing: -0.5 }}>
              99.98%
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginTop: 4 }}>
              Transmission Reliability
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
              Continuous uptime across pipeline networks
            </div>
          </div>

          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--green-normal)", letterSpacing: -0.5 }}>
              &lt; 1.2s
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginTop: 4 }}>
              Telemetry Ingestion Latency
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
              High-frequency multi-sensor processing
            </div>
          </div>

          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--lavender-accent)", letterSpacing: -0.5 }}>
              5-Vector
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginTop: 4 }}>
              Integrity Risk Scoring
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
              Pressure, flow, temperature, vibration & corrosion
            </div>
          </div>

          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--amber-warning)", letterSpacing: -0.5 }}>
              0 Incidents
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)", marginTop: 4 }}>
              Unplanned Downtime
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
              Predictive mitigation & prioritized work orders
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Section */}
      <section className="landing-section" id="capabilities">
        <div className="section-title-wrap">
          <div className="hero-pill" style={{ marginBottom: 12 }}>
            <Activity size={14} />
            <span>Industrial Integrity Capabilities</span>
          </div>
          <h2>Engineered for High-Pressure Transmission Safety</h2>
          <p>
            From field telemetry acquisition to predictive digital-twin simulations, PipelineGuard empowers
            operators and asset engineers to anticipate integrity hazards before failure occurs.
          </p>
        </div>

        <div className="features-grid" style={{ padding: 0 }}>
          {/* Card 1: Sensor Telemetry Processing */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "var(--blue-light)", color: "var(--blue-primary)" }}>
              <Activity size={26} />
            </div>
            <h3>Continuous Multi-Sensor Telemetry</h3>
            <p>
              High-frequency acquisition of pressure transients, differential flow rates, temperature variations,
              and acoustic vibration spectra across distributed pipeline segments.
            </p>
          </div>

          {/* Card 2: Deterministic Health Scoring */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "var(--green-light)", color: "var(--green-normal)" }}>
              <BarChart3 size={26} />
            </div>
            <h3>Predictive Integrity Health Scoring</h3>
            <p>
              Comprehensive multi-factor degradation assessment transforms hydraulic readings and wall loss into
              an actionable 0–100 segment health index with standardized risk bands.
            </p>
          </div>

          {/* Card 3: Automated Severity Alerts */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "var(--red-light)", color: "var(--red-critical)" }}>
              <AlertTriangle size={26} />
            </div>
            <h3>Automated Anomaly Triage & Alerts</h3>
            <p>
              Sub-second threshold breach detection triggers prioritized HIGH and CRITICAL alerts with lifecycle
              acknowledgment, root cause tagging, and emergency isolation triggers.
            </p>
          </div>

          {/* Card 4: What-If Risk Simulation */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "var(--lavender-light)", color: "var(--lavender-accent)" }}>
              <Sliders size={26} />
            </div>
            <h3>Digital Twin Operational Risk Simulator</h3>
            <p>
              Interactive operational sandbox allows engineering teams to simulate hydraulic surges, valve closures,
              and wall thinning scenarios to evaluate risk before field execution.
            </p>
          </div>

          {/* Card 5: Maintenance Orchestration */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "#fef3c7", color: "var(--amber-warning)" }}>
              <Wrench size={26} />
            </div>
            <h3>Orchestrated Maintenance Work Orders</h3>
            <p>
              Condition-based maintenance dispatch automates work order creation, technical technician assignments,
              valve maintenance, and pipeline sleeve reinforcement schedules.
            </p>
          </div>

          {/* Card 6: Regulatory NDT Inspection Audits */}
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: "#ecfdf5", color: "#059669" }}>
              <FileCheck size={26} />
            </div>
            <h3>Regulatory Compliance & NDT Audits</h3>
            <p>
              Centralized digital logging for ultrasonic thickness gauging, inline inspection (ILI) smart pigging,
              and cathodic protection compliance audits.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Deployment Sectors Section */}
      <section className="landing-section" id="industries" style={{ background: "#ffffff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <div className="section-title-wrap">
          <div className="hero-pill" style={{ marginBottom: 12 }}>
            <Layers size={14} />
            <span>Industrial Applications</span>
          </div>
          <h2>Securing Critical Transmission Across Sectors</h2>
          <p>
            PipelineGuard adapts seamlessly across midstream energy, municipal utilities, and complex industrial process networks.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {/* Sector 1: Hydrocarbons */}
          <div className="industry-card">
            <div className="industry-tag" style={{ background: "var(--blue-light)", color: "var(--blue-primary)" }}>
              <Flame size={12} /> Midstream Energy
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Natural Gas & Hydrocarbons</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Long-distance transmission trunklines, compressor station headers, and high-pressure custody transfer skids.
            </p>
          </div>

          {/* Sector 2: Municipal Water */}
          <div className="industry-card">
            <div className="industry-tag" style={{ background: "var(--green-light)", color: "var(--green-normal)" }}>
              <Droplets size={12} /> Public Utilities
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Municipal Water & Sewerage</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              High-diameter potable transmission mains, aqueducts, reservoir conveyance, and distribution pressure-reducing valves.
            </p>
          </div>

          {/* Sector 3: Chemical & Refining */}
          <div className="industry-card">
            <div className="industry-tag" style={{ background: "var(--lavender-light)", color: "var(--lavender-accent)" }}>
              <Factory size={12} /> Chemical & Refining
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Industrial Process Piping</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Corrosive liquid conveyance, high-temperature manifolds, inter-facility pipeline corridors, and hazardous chemical transport.
            </p>
          </div>

          {/* Sector 4: Offshore */}
          <div className="industry-card">
            <div className="industry-tag" style={{ background: "#fef3c7", color: "var(--amber-warning)" }}>
              <Anchor size={12} /> Marine Infrastructure
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Offshore & Subsea Flowlines</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Severe marine environments, riser stress telemetry, seabed flowlines, and remote deepwater tieback integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Governance Architecture */}
      <section className="landing-section" id="governance">
        <div className="section-title-wrap">
          <div className="hero-pill" style={{ marginBottom: 12 }}>
            <Lock size={14} />
            <span>Role-Based Operational Security</span>
          </div>
          <h2>Defense-in-Depth Access Governance</h2>
          <p>
            Separation of operational duties ensures telemetry integrity, prevents unauthorized segment modifications,
            and enforces audit-ready accountability.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {/* Operator Role */}
          <div className="card" style={{ padding: 32, borderLeft: "4px solid var(--blue-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Radio size={22} color="var(--blue-primary)" />
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Pipeline Operator Role</h3>
            </div>
            <span className="badge badge-info" style={{ marginBottom: 14 }}>Real-Time Control Room</span>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
              Dedicated to continuous field observation, rapid anomaly detection, and frontline safety response:
            </p>
            <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <li>Real-time sensor telemetry surveillance across all pipeline segments</li>
              <li>Out-of-tolerance alert acknowledgment and frontline triage</li>
              <li>Field NDT inspection logging and wall thickness recordings</li>
              <li>Interactive what-if operational risk simulation sandbox</li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Access Operator Portal <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Administrator Role */}
          <div className="card" style={{ padding: 32, borderLeft: "4px solid var(--lavender-accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <ShieldCheck size={22} color="var(--lavender-accent)" />
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>System Administrator Role</h3>
            </div>
            <span className="badge badge-purple" style={{ marginBottom: 14 }}>Infrastructure Governance</span>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
              Authorized for asset commissioning, safety rule management, and enterprise administrative controls:
            </p>
            <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <li>Full pipeline commissioning, segment configuration, and decommissioning</li>
              <li>Critical alert resolution and emergency drill triggering</li>
              <li>User RBAC role assignment and access administration</li>
              <li>Preventive maintenance work order dispatch and lifecycle authorization</li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Access Administrator Portal <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Call to Action Banner */}
      <section style={{ padding: "40px 48px 80px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)",
            borderRadius: "var(--radius-lg)",
            padding: "56px 40px",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14, letterSpacing: -0.6 }}>
            Safeguard Your Critical Pipeline Infrastructure Today
          </h2>
          <p style={{ fontSize: 16, color: "#cbd5e1", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Experience real-time telemetry processing, deterministic integrity scoring, and proactive operational risk simulations.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{
                background: "#ffffff",
                color: "#1e3a8a",
                padding: "13px 28px",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
              }}
            >
              Launch Control Console <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.25)",
                padding: "13px 28px",
                fontSize: 15,
              }}
            >
              Sign In with Demo Role
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid var(--border-light)",
          padding: "48px 48px 36px",
          color: "var(--text-secondary)",
          fontSize: 13,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="brand-icon" style={{ width: 32, height: 32 }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: 14 }}>PipelineGuard™ Platform</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Industrial Safety & Predictive Pipeline Integrity Architecture
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12.5 }}>
            <span>ISO 55000 Asset Management</span>
            <span>&bull;</span>
            <span>API 1160 Pipeline Integrity</span>
            <span>&bull;</span>
            <span>ASME B31.8 / B31.4 Telemetry Standards</span>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1200,
            margin: "24px auto 0",
            paddingTop: 20,
            borderTop: "1px solid var(--border-light)",
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          &copy; {new Date().getFullYear()} PipelineGuard Infrastructure Intelligence. All operational rights reserved.
        </div>
      </footer>
    </div>
  );
}
