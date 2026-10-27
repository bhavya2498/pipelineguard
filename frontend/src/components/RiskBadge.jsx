import React from "react";

export default function RiskBadge({ level }) {
  const norm = (level || "LOW").toUpperCase();
  let badgeClass = "low";

  if (norm === "CRITICAL") badgeClass = "critical";
  else if (norm === "HIGH") badgeClass = "high";
  else if (norm === "MEDIUM") badgeClass = "medium";
  else badgeClass = "low";

  return (
    <span className={`risk-badge ${badgeClass}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "currentColor",
        }}
      />
      {norm}
    </span>
  );
}
