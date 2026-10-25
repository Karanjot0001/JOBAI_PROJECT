import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { useJobs } from "../context/JobContext";
import { useToast } from "../context/ToastContext";
import MetricRing from "../components/MetricRing";
import JobCard from "../components/JobCard";
import {
  Sparkles,
  Briefcase,
  Activity,
  Clock,
  Compass,
  Headphones,
  Award,
  ChevronRight
} from "lucide-react";

/**
 * Dashboard Page
 * Syllabus Concepts Covered:
 * - Functional Components & Props
 * - React Hooks (useMemo, useContext, useState)
 * - Array methods (filter, map, sort, slice)
 * - Conditional Rendering & Meaningful Empty States
 * - LocalStorage data persistence & real state aggregation
 */
export default function Dashboard() {
  const { user, careerGoal } = useAuth();
  const { analysis } = useResume();
  const { jobs, savedJobIds, applications, applyToJob } = useJobs();
  const { openModal } = useToast();

  // Dynamic time-of-day greeting (lazy state initialization for React compiler purity)
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  });

  // Calculate real profile completion percentage dynamically
  const profileCompletion = useMemo(() => {
    let score = 30; // Base registered account
    if (user?.name) score += 10;
    if (user?.email) score += 10;
    if (analysis) score += 25;
    if (applications.length > 0) score += 15;
    if (savedJobIds.length > 0) score += 10;
    return Math.min(score, 100);
  }, [analysis, user, applications.length, savedJobIds.length]);

  // Real application breakdown counts
  const appCounts = useMemo(() => {
    const interviewing = applications.filter((a) => a.status === "Interviewing").length;
    const offered = applications.filter((a) => a.status === "Offered").length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    return { total: applications.length, interviewing, offered, applied };
  }, [applications]);

  // Top 3 matched jobs sorted by highest match score
  const topJobs = useMemo(() => {
    return [...jobs].sort((a, b) => b.match - a.match).slice(0, 3);
  }, [jobs]);

  // Recent activity summary from real application state and localStorage
  const recentActivities = useMemo(() => {
    const list = [];

    // Latest application
    if (applications.length > 0) {
      const latestApp = applications[0];
      list.push({
        id: "activity-app",
        type: "app",
        title: `Applied for ${latestApp.role} at ${latestApp.company}`,
        subtitle: `Status: ${latestApp.status} • Location: ${latestApp.loc}`,
        date: latestApp.date,
        badge: latestApp.status
      });
    }

    // Latest resume analysis
    if (analysis) {
      list.push({
        id: "activity-resume",
        type: "resume",
        title: `Resume analyzed: ${analysis.fileName}`,
        subtitle: `Resume Score: ${analysis.resumeScore}/100 • ATS: ${analysis.ats}%`,
        date: analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleDateString() : "Active",
        badge: "Verified"
      });
    }

    // Latest skill assessment attempt
    try {
      const savedAttempts = JSON.parse(localStorage.getItem("jobai_skill_attempts") || "[]");
      if (savedAttempts.length > 0) {
        const latestAttempt = savedAttempts[savedAttempts.length - 1];
        list.push({
          id: "activity-quiz",
          type: "quiz",
          title: `Completed ${latestAttempt.topicName} Assessment`,
          subtitle: `Scored ${latestAttempt.percentage}% (${latestAttempt.score}/${latestAttempt.total} correct)`,
          date: latestAttempt.date || "Recent",
          badge: `${latestAttempt.percentage}%`
        });
      }
    } catch (e) {
      console.warn("Could not read assessment history:", e);
    }

    return list;
  }, [applications, analysis]);

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
    <div className="dashboard-page">
      {/* Page Header with Personalized Greeting & Target Role */}
      <div className="page-head">
        <div>
          <h1>
            {greeting}, <span>{user?.name || "Candidate"}</span>! 👋
          </h1>
          <p>
            Targeting: <strong>{careerGoal || "Software Developer"}</strong> • Review your resume analytics, career progress, and job opportunities.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/resume-analyzer" className="btn primary">
            <Sparkles size={16} /> Analyze New Resume
          </Link>
        </div>
      </div>

      {/* ================= REAL STAT CARDS ================= */}
      <div className="grid four" style={{ marginBottom: "22px" }}>
        {/* Resume Score */}
        <div className="stat">
          <div>
            <span>Resume Score</span>
            <strong>{analysis ? `${analysis.resumeScore}/100` : "—"}</strong>
            <small className="green">
              {analysis ? `${analysis.ats}% ATS Match` : "Upload resume"}
            </small>
          </div>
          <MetricRing
            value={analysis ? analysis.resumeScore : 0}
            color="var(--success)"
          />
        </div>

        {/* Dynamic Applications Count */}
        <div className="stat">
          <div>
            <span>Active Applications</span>
            <strong>{appCounts.total}</strong>
            <small className="purple">
              {appCounts.interviewing > 0 ? `${appCounts.interviewing} Interviewing` : `${appCounts.applied} Applied`}
            </small>
          </div>
          <MetricRing
            value={Math.min(appCounts.total * 20, 100)}
            color="var(--primary)"
          />
        </div>

        {/* Real Saved Jobs Count */}
        <div className="stat">
          <div>
            <span>Saved Jobs</span>
            <strong>{savedJobIds.length}</strong>
            <small className="blue">Bookmarked roles</small>
          </div>
          <MetricRing
            value={Math.min(savedJobIds.length * 25, 100)}
            color="var(--info)"
          />
        </div>

        {/* Profile & Career Readiness Completion */}
        <div className="stat">
          <div>
            <span>Profile Readiness</span>
            <strong>{profileCompletion}%</strong>
            <small className="orange">
              {profileCompletion === 100 ? "Fully Prepared" : "Profile in progress"}
            </small>
          </div>
          <MetricRing
            value={profileCompletion}
            color="var(--warning)"
          />
        </div>
      </div>

      {/* ================= QUICK ACTIONS BAR ================= */}
      <div className="card" style={{ marginBottom: "22px", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} color="var(--primary)" />
            <strong style={{ fontSize: "13.5px" }}>Quick Actions:</strong>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link to="/resume-analyzer" className="btn outline" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <Sparkles size={14} /> Resume Analyzer
            </Link>
            <Link to="/job-search" className="btn outline" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <Briefcase size={14} /> Browse Jobs
            </Link>
            <Link to="/applications" className="btn outline" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <Clock size={14} /> Track Applications ({appCounts.total})
            </Link>
            <Link to="/interview-practice" className="btn outline" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <Headphones size={14} /> Interview Practice
            </Link>
            <Link to="/skill-assessment" className="btn outline" style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <Award size={14} /> Skill Assessment
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 3-COL DASHBOARD CARDS ================= */}
      <div className="grid three" style={{ marginBottom: "22px" }}>
        {/* Resume Breakdown */}
        <div className="card">
          <h3>Resume Breakdown</h3>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
            Detailed metrics from your latest resume assessment.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              padding: "12px",
              backgroundColor: "var(--bg-app)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "16px"
            }}
          >
            <div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Detected Skills</span>
              <strong style={{ display: "block", fontSize: "16px" }}>
                {analysis?.detected?.length || 0}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Experience</span>
              <strong style={{ display: "block", fontSize: "16px" }}>
                {analysis?.experience || "Fresher"}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Projects</span>
              <strong style={{ display: "block", fontSize: "16px" }}>
                {analysis?.projects || 0}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Education</span>
              <strong style={{ display: "block", fontSize: "16px" }}>
                {analysis?.education || "In Progress"}
              </strong>
            </div>
          </div>

          <Link to="/resume-analyzer" className="btn outline" style={{ width: "100%" }}>
            View Full Analysis & Checklist →
          </Link>
        </div>

        {/* Target Career & Skill Gaps */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <h3 style={{ margin: 0 }}>Target Role Skill Gaps</h3>
            <span className="chip" style={{ fontSize: "11px", fontWeight: 700 }}>
              {careerGoal || "Developer"}
            </span>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
            In-demand competencies identified for your target career track.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {analysis?.missing && analysis.missing.length > 0 ? (
              analysis.missing.slice(0, 3).map((skill, idx) => {
                const demand = 80 - idx * 15;
                return (
                  <div key={skill}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                      <span>{skill}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>Priority Gap</span>
                    </div>
                    <div className="progress"><i style={{ width: `${demand}%` }} /></div>
                  </div>
                );
              })
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                  <span>React.js & Architecture</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>75% demand</span>
                </div>
                <div className="progress"><i style={{ width: "75%" }} /></div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                  <span>REST APIs & Cloud</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>65% demand</span>
                </div>
                <div className="progress"><i style={{ width: "65%" }} /></div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "16px" }}>
            <Link to="/career-roadmap" className="link" style={{ fontSize: "13px" }}>
              Explore Career Learning Roadmap →
            </Link>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <Activity size={18} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Recent Activity Summary</h3>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            Log of your latest actions, applications, and evaluations.
          </p>

          <div style={{ flex: 1 }}>
            {recentActivities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-card)",
                      fontSize: "12.5px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                      <strong style={{ fontSize: "13px", color: "var(--text-heading)" }}>{act.title}</strong>
                      <span className="chip" style={{ fontSize: "10px", padding: "1px 6px" }}>{act.badge}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "11.5px" }}>
                      <span>{act.subtitle}</span>
                      <span>{act.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 10px", color: "var(--text-muted)" }}>
                <Clock size={32} style={{ opacity: 0.3, marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", margin: "0 0 12px 0" }}>No recent activity recorded yet.</p>
                <Link to="/job-search" className="btn primary" style={{ fontSize: "12px", padding: "6px 12px" }}>
                  Browse Jobs to Apply
                </Link>
              </div>
            )}
          </div>

          <div style={{ marginTop: "14px", borderTop: "1px solid var(--border-card)", paddingTop: "10px" }}>
            <Link to="/applications" className="link" style={{ fontSize: "12.5px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>View All Applications ({applications.length})</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= UPLOAD CTA BANNER ================= */}
      {!analysis && (
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(99, 52, 231, 0.08), rgba(117, 64, 239, 0.14))",
            border: "1px solid rgba(104, 60, 233, 0.25)",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "19px", margin: "0 0 6px 0" }}>
              Upload your resume for AI-powered career insights
            </h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13.5px" }}>
              Instant ATS parsing, keyword analysis, and compatibility scoring.
            </p>
          </div>
          <Link to="/resume-analyzer" className="btn primary">
            Analyze Resume Now
          </Link>
        </div>
      )}

      {/* ================= JOBS & DETECTED SKILLS ================= */}
      <div className="grid two">
        {/* Recommended Jobs */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0 }}>Top Job Recommendations</h3>
            <Link to="/job-search" className="link" style={{ fontSize: "13px" }}>
              View All ({jobs.length}) →
            </Link>
          </div>

          <div className="list">
            {topJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDetailsClick={handleOpenDetails}
                onApplyClick={applyToJob}
              />
            ))}
          </div>
        </div>

        {/* Your Detected Skills */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <h3 style={{ margin: 0 }}>Your Verified Skills</h3>
            {analysis?.detected && (
              <span className="chip" style={{ fontSize: "11px", fontWeight: 700 }}>
                {analysis.detected.length} Detected
              </span>
            )}
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            Extracted from your uploaded resume.
          </p>

          {analysis && analysis.detected && analysis.detected.length > 0 ? (
            <div className="chips" style={{ marginBottom: "20px" }}>
              {analysis.detected.map((skill) => (
                <span
                  key={skill}
                  className="chip"
                  style={{
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    fontWeight: 600,
                    padding: "6px 14px"
                  }}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
              <p>No resume skills detected yet. Upload a resume to populate your verified skill set.</p>
              <Link to="/resume-analyzer" className="btn primary" style={{ display: "inline-flex" }}>
                Upload Resume
              </Link>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
            <Link to="/job-matcher" className="btn outline" style={{ flex: 1, textAlign: "center" }}>
              Test Job Matcher
            </Link>
            <Link to="/skill-assessment" className="btn primary" style={{ flex: 1, textAlign: "center" }}>
              Take Skill Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
