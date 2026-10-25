import React from "react";
import { useJobs } from "../context/JobContext";
import { Star } from "lucide-react";

/**
 * JobCard Component
 * Syllabus Concept: Reusable Components, Props, Conditional Rendering, Event Handling
 */
export default function JobCard({ job, onDetailsClick, onApplyClick }) {
  const { isJobSaved, toggleSaveJob } = useJobs();
  const saved = isJobSaved(job.id);

  return (
    <div className="job">
      {/* Company Initial Logo */}
      <div className="logo" aria-hidden="true">
        {job.company ? job.company[0] : "J"}
      </div>

      {/* Main Details */}
      <div className="job-main">
        <strong>{job.title}</strong>
        <small>
          {job.company} · {job.loc} · {job.type || "Full Time"} · {job.level || "Fresher"}
        </small>

        {/* Tags */}
        <div className="chips">
          {job.tags &&
            job.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* Match Badge */}
      <span className="match">
        {job.match}% Match
      </span>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          type="button"
          className="btn outline"
          onClick={() => onDetailsClick && onDetailsClick(job)}
        >
          Details
        </button>
        {onApplyClick && (
          <button
            type="button"
            className="btn primary"
            style={{ padding: "6px 12px", fontSize: "12.5px" }}
            onClick={() => onApplyClick(job)}
          >
            Apply
          </button>
        )}
      </div>

      {/* Bookmark Star Button */}
      <button
        type="button"
        className="save-btn"
        onClick={() => toggleSaveJob(job.id)}
        aria-label={saved ? "Remove from saved jobs" : "Save job"}
        title={saved ? "Saved" : "Save for later"}
      >
        <Star size={18} fill={saved ? "#f59e0b" : "none"} color={saved ? "#f59e0b" : "currentColor"} />
      </button>
    </div>
  );
}
