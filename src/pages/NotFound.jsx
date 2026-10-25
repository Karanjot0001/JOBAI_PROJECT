import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

/**
 * 404 Not Found Page
 * Syllabus Concept: React Router (Catch-all route '*'), Conditional Navigation
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "var(--warning-bg)",
          color: "var(--warning)",
          display: "grid",
          placeItems: "center",
          marginBottom: "16px"
        }}
      >
        <AlertTriangle size={36} />
      </div>

      <h1 style={{ fontSize: "48px", fontWeight: 900, margin: "0 0 8px 0", color: "var(--text-heading)" }}>
        404
      </h1>
      <h2 style={{ fontSize: "20px", margin: "0 0 10px 0" }}>
        Page Not Found
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "420px", margin: "0 0 24px 0" }}>
        The route you are trying to access does not exist or may have been relocated.
      </p>

      <Link to="/" className="btn primary">
        <Home size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
