import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import { CheckCircle2, Circle, Clock, Edit2, RotateCcw } from "lucide-react";

const ROADMAP_KEY = "jobai_roadmap_stages";

const DEFAULT_STAGES = [
  {
    id: 1,
    title: "HTML5, CSS3 & JavaScript ES6+ Fundamentals",
    subtitle: "Semantic markup, CSS Grid & Flexbox, DOM manipulation, asynchronous JS, and Fetch API.",
    status: "done",
    duration: "Completed • Month 1-2"
  },
  {
    id: 2,
    title: "Frontend Engineering with React.js & Vite",
    subtitle: "Functional components, Hooks (useState, useEffect, useMemo), React Router v6, and Context API.",
    status: "current",
    duration: "In Progress • Month 3-4"
  },
  {
    id: 3,
    title: "Backend Development & RESTful APIs",
    subtitle: "Node.js / Express or Java Spring Boot, authentication with JWT, middleware, and microservices.",
    status: "upcoming",
    duration: "Upcoming • Month 5-6"
  },
  {
    id: 4,
    title: "Database Engineering & Storage Systems",
    subtitle: "Relational database design (PostgreSQL/MySQL), NoSQL schema modeling (MongoDB), indexing, and ACID.",
    status: "upcoming",
    duration: "Upcoming • Month 7"
  },
  {
    id: 5,
    title: "Production Projects, Docker & Cloud Deployment",
    subtitle: "Building end-to-end full stack projects, containerization with Docker, CI/CD pipelines, and AWS.",
    status: "upcoming",
    duration: "Upcoming • Month 8-9"
  },
  {
    id: 6,
    title: "Technical Interview Mastery & Placements",
    subtitle: "DSA problem solving, mock technical interviews, resume optimization, and campus hiring.",
    status: "upcoming",
    duration: "Upcoming • Month 10"
  }
];

/**
 * Career Roadmap Page
 * Syllabus Concepts Covered:
 * - Interactive Component State & Two-way Binding
 * - Dynamic Progress Calculation with Array.filter
 * - LocalStorage Persistence & Reset Confirmation Pattern
 * - Form Handling within Accessible Modals
 */
export default function CareerRoadmap() {
  const { careerGoal, setCareerGoal } = useAuth();
  const { showToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(careerGoal);

  // Roadmap Stages state with LocalStorage persistence
  const [stages, setStages] = useState(() => {
    try {
      const stored = localStorage.getItem(ROADMAP_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STAGES;
    } catch {
      return DEFAULT_STAGES;
    }
  });

  // Persist milestone status updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(stages));
    } catch (e) {
      console.warn("Error persisting roadmap progress:", e);
    }
  }, [stages]);

  const completedCount = stages.filter((s) => s.status === "done").length;
  const progressPercentage = Math.round((completedCount / stages.length) * 100);

  const handleToggleStageStatus = (id) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === id) {
          const nextStatus = stage.status === "done" ? "upcoming" : "done";
          showToast(`Milestone updated to ${nextStatus === "done" ? "Completed" : "Upcoming"}.`, "info");
          return { ...stage, status: nextStatus };
        }
        return stage;
      })
    );
  };

  const handleResetProgress = () => {
    setStages(DEFAULT_STAGES);
    try {
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(DEFAULT_STAGES));
    } catch (e) {
      console.warn("Storage reset error:", e);
    }
    setIsResetModalOpen(false);
    showToast("Roadmap progress reset to initial curriculum defaults.", "info");
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!newGoalInput.trim()) {
      showToast("Career goal cannot be empty.", "warning");
      return;
    }
    setCareerGoal(newGoalInput.trim());
    setIsEditModalOpen(false);
    showToast(`Career goal updated to: ${newGoalInput.trim()}`, "success");
  };

  return (
    <div className="career-roadmap-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Career Roadmap & Milestones</h1>
          <p>Your step-by-step technical learning curriculum structured toward your dream career role.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn outline"
            onClick={() => {
              setNewGoalInput(careerGoal);
              setIsEditModalOpen(true);
            }}
          >
            <Edit2 size={15} /> Edit Career Goal
          </button>

          <button
            type="button"
            className="btn outline"
            onClick={() => setIsResetModalOpen(true)}
            title="Reset roadmap progress"
          >
            <RotateCcw size={15} /> Reset Progress
          </button>
        </div>
      </div>

      {/* ================= GOAL OVERVIEW CARD ================= */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>YOUR TARGET CAREER GOAL</span>
            <h2 style={{ fontSize: "24px", margin: "4px 0", color: "var(--text-heading)" }}>
              {careerGoal}
            </h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>
              Estimated duration: <strong>8–10 months</strong> • Skill Level: <strong>Intermediate to Advanced</strong>
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Roadmap Progress</span>
            <h3 style={{ margin: 0, fontSize: "24px", color: "var(--primary)" }}>
              {progressPercentage}%
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress" style={{ height: "10px", marginBottom: "8px" }}>
          <i style={{ width: `${progressPercentage}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", flexWrap: "wrap", gap: "6px" }}>
          <span>{completedCount} of {stages.length} milestones completed</span>
          <span>Click on any milestone card below to toggle completion</span>
        </div>
      </div>

      {/* ================= TIMELINE STEPS ================= */}
      <div className="timeline">
        {stages.map((stage, idx) => {
          const isDone = stage.status === "done";
          const isCurrent = stage.status === "current";

          return (
            <div
              key={stage.id}
              className={`step ${isDone ? "done" : isCurrent ? "current" : ""}`}
              style={{
                cursor: "pointer",
                padding: "18px 20px",
                transition: "var(--transition)"
              }}
              onClick={() => handleToggleStageStatus(stage.id)}
              title="Click to toggle completion status"
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ marginTop: "2px" }}>
                  {isDone ? (
                    <CheckCircle2 size={22} color="var(--success)" />
                  ) : isCurrent ? (
                    <Clock size={22} color="var(--primary)" />
                  ) : (
                    <Circle size={22} color="var(--border-input)" />
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>
                      PHASE {idx + 1}
                    </span>
                    <span
                      className={`status ${isDone ? "Offered" : isCurrent ? "Interviewing" : "Applied"}`}
                      style={{ fontSize: "11px", padding: "2px 8px" }}
                    >
                      {isDone ? "Completed" : isCurrent ? "In Progress" : "Upcoming"}
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 6px 0", fontSize: "16px" }}>
                    {stage.title}
                  </h3>

                  <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {stage.subtitle}
                  </p>

                  <small style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
                    {stage.duration}
                  </small>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span className="link" style={{ fontSize: "12px" }}>
                  {isDone ? "Mark as Incomplete" : "Mark as Completed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= EDIT CAREER GOAL MODAL ================= */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Career Goal"
      >
        <form onSubmit={handleSaveGoal} className="form">
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
            Updating your career goal customizes your recommended job openings, skill gap benchmarks, and interview practice questions.
          </p>

          <InputField
            label="Target Career Role"
            name="goal"
            as="select"
            value={newGoalInput}
            onChange={(e) => setNewGoalInput(e.target.value)}
            options={[
              "Full Stack Developer",
              "Frontend Developer",
              "Backend Developer",
              "AI/ML Engineer",
              "Data Scientist",
              "Data Analyst",
              "DevOps Engineer",
              "Cloud Engineer"
            ]}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px" }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save Career Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= RESET CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Roadmap Progress"
      >
        <div style={{ padding: "6px 0" }}>
          <p style={{ fontSize: "13.5px", color: "var(--text-main)", margin: "0 0 16px 0", lineHeight: 1.6 }}>
            Are you sure you want to reset your milestone completion progress? This will reset your checklist back to the curriculum initial state.
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={handleResetProgress}
            >
              Yes, Reset Progress
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
