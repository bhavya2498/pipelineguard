import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sliders,
  Play,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  History,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { runSimulation, getPipelines } from "../api/client.js";
import RiskBadge from "../components/RiskBadge.jsx";

const initialForm = {
  pipelineId: "P-001",
  segmentId: "SEG-001",
  pressure: 75,
  flow: 65,
  temperature: 45,
  vibration: 25,
  corrosion: 8,
};

const presets = [
  {
    name: "Nominal Operating",
    description: "All parameters well within safe design bounds",
    values: { pressure: 70, flow: 60, temperature: 40, vibration: 20, corrosion: 6 },
  },
  {
    name: "High Vibration Warning",
    description: "Compressor harmonic anomaly exceeding safe limits",
    values: { pressure: 84, flow: 78, temperature: 55, vibration: 75, corrosion: 10 },
  },
  {
    name: "Offshore Severe Corrosion",
    description: "Saline wall loss past safety envelope",
    values: { pressure: 80, flow: 72, temperature: 48, vibration: 30, corrosion: 32 },
  },
  {
    name: "Critical Overpressure",
    description: "Emergency surge threatening immediate rupture",
    values: { pressure: 115, flow: 105, temperature: 85, vibration: 88, corrosion: 26 },
  },
];

export default function RiskSimulator() {
  const [form, setForm] = useState(initialForm);
  const [pipelines, setPipelines] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getPipelines()
      .then((data) => {
        setPipelines(data);
        if (data.length > 0) {
          setForm((prev) => ({
            ...prev,
            pipelineId: data[0].pipelineId,
            segmentId: data[0].segments?.[0]?.segmentId || "SEG-001",
          }));
        }
      })
      .catch(() => {});

    // Run initial simulation for default values
    executeSimulation(initialForm);
  }, []);

  const handleChange = (field, val) => {
    const updated = { ...form, [field]: Number(val) };
    setForm(updated);
  };

  const executeSimulation = async (inputData) => {
    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const payload = {
        pipelineId: inputData.pipelineId || form.pipelineId,
        segmentId: inputData.segmentId || form.segmentId,
        pressure: Number(inputData.pressure),
        flow: Number(inputData.flow),
        temperature: Number(inputData.temperature),
        vibration: Number(inputData.vibration),
        corrosion: Number(inputData.corrosion),
      };

      const data = await runSimulation(payload);
      setResult(data);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (presetValues) => {
    const updated = { ...form, ...presetValues };
    setForm(updated);
    executeSimulation(updated);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Predictive Risk & What-If Simulation Sandbox</h2>
          <p>Test hypothetical pipeline operational states to forecast health scores, risk classifications, and emergency protocols.</p>
        </div>
        <Link to="/simulations" className="btn btn-secondary btn-sm">
          <History size={15} /> View Simulation History
        </Link>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Quick Loaders */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.3 }}>
          Load Demonstration Scenarios:
        </span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleApplyPreset(p.values)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="simulator-layout">
        {/* Sliders Input Panel */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="form-group">
                <label>Target Pipeline Asset</label>
                <select
                  className="form-control"
                  value={form.pipelineId}
                  onChange={(e) => {
                    const selP = pipelines.find((p) => p.pipelineId === e.target.value);
                    setForm({
                      ...form,
                      pipelineId: e.target.value,
                      segmentId: selP?.segments?.[0]?.segmentId || "SEG-001",
                    });
                  }}
                >
                  {pipelines.map((p) => (
                    <option key={p.pipelineId} value={p.pipelineId}>
                      {p.pipelineId} ({p.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Segment Identifier</label>
                <input
                  className="form-control"
                  value={form.segmentId}
                  onChange={(e) => setForm({ ...form, segmentId: e.target.value })}
                  placeholder="e.g. SEG-001"
                />
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-name">Pressure (PSI)</span>
              <span
                className="slider-val-badge"
                style={{
                  background: form.pressure > 85 ? "var(--red-light)" : "var(--green-light)",
                  color: form.pressure > 85 ? "#991b1b" : "#065f46",
                }}
              >
                {form.pressure} psi
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={form.pressure}
              className="slider-input"
              onChange={(e) => handleChange("pressure", e.target.value)}
            />
            <div className="slider-thresholds">
              <span>0 psi</span>
              <span>Safe &le; 85</span>
              <span>Critical &ge; 110</span>
              <span>150 psi</span>
            </div>
          </div>

          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-name">Flow Rate (m³/h)</span>
              <span
                className="slider-val-badge"
                style={{
                  background: form.flow > 90 ? "var(--red-light)" : "var(--green-light)",
                  color: form.flow > 90 ? "#991b1b" : "#065f46",
                }}
              >
                {form.flow} m³/h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={form.flow}
              className="slider-input"
              onChange={(e) => handleChange("flow", e.target.value)}
            />
            <div className="slider-thresholds">
              <span>0 m³/h</span>
              <span>Safe &le; 90</span>
              <span>Critical &ge; 120</span>
              <span>150 m³/h</span>
            </div>
          </div>

          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-name">Temperature (°C)</span>
              <span
                className="slider-val-badge"
                style={{
                  background: form.temperature > 60 ? "var(--red-light)" : "var(--green-light)",
                  color: form.temperature > 60 ? "#991b1b" : "#065f46",
                }}
              >
                {form.temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={form.temperature}
              className="slider-input"
              onChange={(e) => handleChange("temperature", e.target.value)}
            />
            <div className="slider-thresholds">
              <span>0°C</span>
              <span>Safe &le; 60°C</span>
              <span>Critical &ge; 90°C</span>
              <span>120°C</span>
            </div>
          </div>

          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-name">Vibration (Hz)</span>
              <span
                className="slider-val-badge"
                style={{
                  background: form.vibration > 60 ? "var(--red-light)" : "var(--green-light)",
                  color: form.vibration > 60 ? "#991b1b" : "#065f46",
                }}
              >
                {form.vibration} Hz
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.vibration}
              className="slider-input"
              onChange={(e) => handleChange("vibration", e.target.value)}
            />
            <div className="slider-thresholds">
              <span>0 Hz</span>
              <span>Safe &le; 60</span>
              <span>Critical &ge; 85</span>
              <span>100 Hz</span>
            </div>
          </div>

          <div className="slider-card">
            <div className="slider-header">
              <span className="slider-name">Corrosion Wall Loss (%)</span>
              <span
                className="slider-val-badge"
                style={{
                  background: form.corrosion > 15 ? "var(--red-light)" : "var(--green-light)",
                  color: form.corrosion > 15 ? "#991b1b" : "#065f46",
                }}
              >
                {form.corrosion}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={form.corrosion}
              className="slider-input"
              onChange={(e) => handleChange("corrosion", e.target.value)}
            />
            <div className="slider-thresholds">
              <span>0%</span>
              <span>Safe &le; 15%</span>
              <span>Critical &ge; 35%</span>
              <span>50%</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 12 }}
            onClick={() => executeSimulation(form)}
            disabled={loading}
          >
            {loading ? "Calculating..." : <><Play size={16} /> Run & Save Simulation</>}
          </button>
        </div>

        {/* Real-Time Result Gauge & Recommendation Card */}
        <div>
          {result && (
            <div className="result-gauge-card">
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>
                Simulated Operational Outcome
              </h3>

              {/* Gauge Display */}
              <div
                className="health-gauge-circle"
                style={{
                  border: `8px solid ${
                    result.riskLevel === "LOW"
                      ? "var(--green-normal)"
                      : result.riskLevel === "MEDIUM"
                      ? "var(--amber-warning)"
                      : result.riskLevel === "HIGH"
                      ? "#f97316"
                      : "var(--red-critical)"
                  }`,
                }}
              >
                <div
                  className="health-gauge-value"
                  style={{
                    color:
                      result.riskLevel === "LOW"
                        ? "var(--green-normal)"
                        : result.riskLevel === "MEDIUM"
                        ? "var(--amber-warning)"
                        : result.riskLevel === "HIGH"
                        ? "#f97316"
                        : "var(--red-critical)",
                  }}
                >
                  {result.healthScore}
                </div>
                <div className="health-gauge-label">Health Score</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <RiskBadge level={result.riskLevel} />
              </div>

              {/* Recommendation Callout */}
              <div className={`recommendation-box ${result.riskLevel}`}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  HealthEngine Recommended Directive
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {result.recommendation}
                </div>
              </div>

              {/* Breakdown Bars */}
              {result.breakdown && (
                <div className="breakdown-list">
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>
                    Parameter Risk Contributions:
                  </div>

                  {Object.entries(result.breakdown).map(([param, data]) => (
                    <div key={param}>
                      <div className="breakdown-item-header">
                        <span style={{ textTransform: "capitalize" }}>{param}: {data.value}</span>
                        <span>{data.risk}% risk</span>
                      </div>
                      <div className="breakdown-bar-track">
                        <div
                          className="breakdown-bar-fill"
                          style={{
                            width: `${data.risk}%`,
                            backgroundColor:
                              data.risk > 70
                                ? "var(--red-critical)"
                                : data.risk > 30
                                ? "var(--amber-warning)"
                                : "var(--green-normal)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {savedSuccess && (
                <div style={{ marginTop: 20, fontSize: 12.5, color: "var(--green-normal)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <CheckCircle2 size={15} /> Saved automatically to Simulation History
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
