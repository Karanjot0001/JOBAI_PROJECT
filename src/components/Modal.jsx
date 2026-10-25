import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Reusable Accessible Modal Component
 * Syllabus Concept: Conditional Rendering, useEffect (keydown events), Accessibility (ARIA), Children Props
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = "520px" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="modal"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {title && (
          <h2 id="modal-title" style={{ marginTop: 0, marginBottom: "16px", fontSize: "20px" }}>
            {title}
          </h2>
        )}

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
