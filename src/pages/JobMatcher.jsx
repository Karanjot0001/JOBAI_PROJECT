import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { useToast } from "../context/ToastContext";
import { Sparkles, FileText } from "lucide-react";

/**
 * Job Matcher Page
 * Syllabus Concept: Array methods (filter, map), String manipulation, Controlled Form State, Dynamic CSS
 */
export default function JobMatcher() {
  const { analysis } = useResume();
  const { showToast } = useToast();

  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const sampleJDs = [
    {
      label: "Full Stack React/Node JD",
      text: "We are seeking a Full Stack Developer proficient in React.js, JavaScript, Node.js, HTML, CSS, SQL, and Git. The role involves designing REST APIs and building modern web apps."
    },
    {
      label: "Java Backend JD",
      text: "Hiring a Java Developer with strong knowledge of Core Java, Spring Boot, REST APIs, SQL, and Docker. Experience with microservices and Git version control is required."
    },
    {
      label: "Data Analyst JD",
      text: "Looking for a Data Analyst skilled in Python, SQL, Excel, and Power BI. Experience with Pandas, data extraction, and business reporting is essential."
    }
  ];

  const handleAnalyzeMatch = () => {
    if (!analysis || !analysis.detected) {
      showToast("Please upload or analyze a resume first.", "warning");
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 25) {
      showToast("Please paste a meaningful job description (at least 25 characters).", "warning");
      return;
    }

    const lowerJd = jobDescription.toLowerCase();

    // Check which detected resume skills are mentioned in the JD
    const matchedSkills = analysis.detected.filter((skill) =>
      lowerJd.includes(skill.toLowerCase().replace(".", ""))
    );

    // Missing skills from resume that appear in the JD
    const missingSkills = (analysis.missing || []).filter((gap) =>
      lowerJd.includes(gap.toLowerCase().replace(".", ""))
    );

    // Calculate score
    const baseScore = 50;
    const score = Math.min(98, Math.max(35, Math.round(baseScore + matchedSkills.length * 8 - missingSkills.length * 4)));

    let advice = "";
    if (score >= 80) {
      advice = "Excellent match! Your skills strongly align with this position's core requirements.";
    } else if (score >= 65) {
      advice = "Good match. You satisfy the core requirements, but review the missing skills before interviewing.";
    } else {
      advice = "Moderate match. Consider upskilling in the missing technologies highlighted below.";
    }

    setMatchResult({
      score,
      matched: matchedSkills,
      missing: missingSkills,
      advice,
      totalResumeSkills: analysis.detected.length
    });

    showToast(`Job match analyzed: ${score}% Compatibility`, "success");
  };

  return (
    <div className="job-matcher-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>AI Job Matcher</h1>
          <p>Compare any raw job description directly against your analyzed resume to calculate compatibility.</p>
        </div>
      </div>

      {!analysis && (
        <div className="card" style={{ marginBottom: "20px", borderLeft: "4px solid var(--warning)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <strong style={{ display: "block" }}>No Resume Analysis Active</strong>
              <small style={{ color: "var(--text-muted)" }}>Upload a resume first so the matcher knows your skills.</small>
            </div>
            <Link to="/resume-analyzer" className="btn primary">
              Upload Resume First
            </Link>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid two" style={{ alignItems: "start" }}>
        {/* ================= LEFT: JOB DESCRIPTION INPUT ================= */}
        <div className="card form">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <h3 style={{ margin: 0 }}>Paste Job Description</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Target: <strong>{analysis?.detected?.length || 0} skills detected</strong>
            </span>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "0 0 12px 0" }}>
            Paste the requirements section or full job listing from LinkedIn, Indeed, or company careers pages.
          </p>

          {/* Quick sample fillers */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", alignSelf: "center" }}>Quick Fill:</span>
            {sampleJDs.map((sample) => (
              <button
                key={sample.label}
                type="button"
                className="btn outline"
                style={{ padding: "4px 8px", fontSize: "11.5px" }}
                onClick={() => setJobDescription(sample.text)}
              >
                {sample.label}
              </button>
            ))}
          </div>

          <textarea
            style={{ width: "100%", minHeight: "180px" }}
            placeholder="Paste raw job description text here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            type="button"
            className="btn primary"
            style={{ width: "100%", padding: "12px" }}
            onClick={handleAnalyzeMatch}
          >
            <Sparkles size={16} /> Analyze Job Match
          </button>
        </div>

        {/* ================= RIGHT: MATCH RESULT PANE ================= */}
        <div className="card">
          <h3 style={{ marginBottom: "6px" }}>Match Compatibility Result</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "0 0 18px 0" }}>
            Automated alignment between job keywords and your verified skills.
          </p>

          {matchResult ? (
            <div>
              {/* Summary Score Boxes */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: "var(--bg-app)",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  marginBottom: "18px"
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Match Score</span>
                  <strong style={{ display: "block", fontSize: "24px", color: matchResult.score >= 75 ? "var(--success)" : "var(--primary)" }}>
                    {matchResult.score}%
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Matched Skills</span>
                  <strong style={{ display: "block", fontSize: "24px", color: "var(--success)" }}>
                    {matchResult.matched.length}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Missing Gaps</span>
                  <strong style={{ display: "block", fontSize: "24px", color: "var(--danger)" }}>
                    {matchResult.missing.length}
                  </strong>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bar" style={{ height: "14px", marginBottom: "16px" }}>
                <i className="m" style={{ width: `${matchResult.score}%` }} />
                <i className="x" style={{ width: `${100 - matchResult.score}%` }} />
              </div>

              {/* Advice Message */}
              <div
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: matchResult.score >= 75 ? "var(--success-bg)" : "var(--primary-light)",
                  color: matchResult.score >= 75 ? "var(--success)" : "var(--primary)",
                  fontWeight: 500,
                  fontSize: "13.5px",
                  marginBottom: "20px"
                }}
              >
                {matchResult.advice}
              </div>

              {/* Matched Skills Chips */}
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  Skills You Have for This Role ({matchResult.matched.length}):
                </strong>
                {matchResult.matched.length > 0 ? (
                  <div className="chips">
                    {matchResult.matched.map((s) => (
                      <span
                        key={s}
                        className="chip"
                        style={{ backgroundColor: "var(--success-bg)", color: "var(--success)", fontWeight: 600 }}
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                    No exact keyword matches found in this job description.
                  </p>
                )}
              </div>

              {/* Missing Skills Chips */}
              {matchResult.missing.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                    High-Priority Skills to Learn:
                  </strong>
                  <div className="chips">
                    {matchResult.missing.map((s) => (
                      <span
                        key={s}
                        className="chip"
                        style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", fontWeight: 600 }}
                      >
                        ✗ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link to="/career-roadmap" className="btn outline" style={{ width: "100%" }}>
                View Personalized Roadmap for These Gaps →
              </Link>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
              <FileText size={42} style={{ opacity: 0.3, marginBottom: "10px" }} />
              <p style={{ margin: 0 }}>Paste a job description on the left and click "Analyze Job Match" to see your compatibility score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
