import React from "react";

/**
 * MetricRing Component
 * Syllabus Concept: Reusable UI Component, Props, Inline Dynamic Styles
 * Renders a circular conic-gradient score ring.
 */
export default function MetricRing({ value = 0, color = "var(--primary)", size = 54 }) {
  const numericValue = typeof value === "number" ? Math.min(100, Math.max(0, value)) : 0;
  const ringStyle = {
    width: `${size}px`,
    height: `${size}px`,
    background: `conic-gradient(${color} 0% ${numericValue}%, var(--border-input) ${numericValue}% 100%)`
  };

  const innerSize = Math.max(28, size - 12);
  const innerStyle = {
    width: `${innerSize}px`,
    height: `${innerSize}px`
  };

  return (
    <div className="ring" style={ringStyle}>
      <div style={{ position: "absolute", borderRadius: "50%", backgroundColor: "var(--bg-card)", ...innerStyle }} />
      <b>{value !== undefined && value !== null ? value : "—"}</b>
    </div>
  );
}
