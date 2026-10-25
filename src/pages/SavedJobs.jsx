import React from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import { useToast } from "../context/ToastContext";
import JobCard from "../components/JobCard";
import { Bookmark, ArrowRight } from "lucide-react";

/**
 * Saved Jobs Page
 * Syllabus Concept: Context API, Array.filter, Array.map, Conditional Rendering
 */
export default function SavedJobs() {
  const { savedJobs, applyToJob } = useJobs();
  const { openModal } = useToast();

  const handleOpenDetails = (job) => {
    openModal(
      job.title,
      <div>
        <p style={{ margin: "0 0 10px 0" }}>
          <strong>{job.company}</strong> · {job.loc} · {job.salary}
        </p>
        <p style={{ margin: "0 0 14px 0", color: "var(--text-muted)" }}>
          {job.description}
        </p>
        <div style={{ marginBottom: "16px" }}>
          <strong style={{ display: "block", marginBottom: "6px" }}>Required Skills:</strong>
          <div className="chips">
            {job.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn primary"
          style={{ width: "100%" }}
          onClick={() => applyToJob(job)}
        >
          Apply Now
        </button>
      </div>
    );
  };

  return (
    <div className="saved-jobs-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Saved Jobs</h1>
          <p>Your bookmarked career opportunities. Review and submit applications when ready.</p>
        </div>

        <div className="page-actions">
          <Link to="/job-search" className="btn outline">
            Browse All Jobs
          </Link>
        </div>
      </div>

      {/* ================= SAVED JOBS LIST ================= */}
      {savedJobs.length > 0 ? (
        <div className="list">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDetailsClick={handleOpenDetails}
              onApplyClick={applyToJob}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "50px 20px" }}>
          <Bookmark size={44} style={{ opacity: 0.25, marginBottom: "12px", color: "var(--primary)" }} />
          <h3>No saved jobs yet</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13.5px", margin: "0 0 20px 0" }}>
            Click the star icon on any job card to bookmark positions you want to revisit.
          </p>
          <Link to="/job-search" className="btn primary">
            Explore Matching Jobs <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
