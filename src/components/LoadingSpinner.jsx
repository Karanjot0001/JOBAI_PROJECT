import React from "react";

/**
 * Reusable Loading Spinner Component
 * Syllabus Concept: Conditional Rendering, CSS Animation, Props
 */
export default function LoadingSpinner({ text = "Loading...", size = "md" }) {
  const sizeMap = {
    sm: "20px",
    md: "32px",
    lg: "48px"
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        gap: "12px"
      }}
      role="status"
    >
      <div
        style={{
          width: dim,
          height: dim,
          border: "3px solid var(--border-input)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}
      />
      {text && (
        <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 500 }}>
          {text}
        </span>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
