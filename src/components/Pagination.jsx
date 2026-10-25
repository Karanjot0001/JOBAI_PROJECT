import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Controls
 * Syllabus Concept: Reusable UI Component, Props, Event Handling, Conditional Rendering
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "24px"
      }}
    >
      <button
        type="button"
        className="btn outline"
        style={{ padding: "6px 12px" }}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`btn ${p === currentPage ? "primary" : "outline"}`}
          style={{ minWidth: "36px", padding: "6px 10px" }}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className="btn outline"
        style={{ padding: "6px 12px" }}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next Page"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
