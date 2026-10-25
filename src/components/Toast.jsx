import React from "react";
import { useToast } from "../context/ToastContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * Toast Notification Banner Component
 * Syllabus Concept: Conditional Rendering, Context Consumption, CSS Transitions
 */
export default function Toast() {
  const { toast, hideToast } = useToast();

  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 size={18} color="#10b981" />;
      case "error":
        return <AlertCircle size={18} color="#ef4444" />;
      case "warning":
        return <AlertTriangle size={18} color="#f59e0b" />;
      case "info":
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div className="toast" role="status" aria-live="polite">
      {getIcon()}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={hideToast}
        style={{ marginLeft: "8px", color: "inherit", opacity: 0.8, display: "flex", alignItems: "center" }}
        aria-label="Dismiss message"
      >
        <X size={14} />
      </button>
    </div>
  );
}
