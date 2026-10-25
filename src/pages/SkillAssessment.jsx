import React, { useState, useEffect } from "react";
import { skillAssessmentTopics } from "../data/skillAssessmentData";
import { useToast } from "../context/ToastContext";
import confetti from "canvas-confetti";
import { ArrowLeft, Award, RotateCcw, CheckCircle2, XCircle, History, BookOpen } from "lucide-react";

const ATTEMPTS_KEY = "jobai_skill_attempts";

/**
 * Skill Assessment Page
 * Syllabus Concepts Covered:
 * - State Management (controlled test progression, tracking choices)
 * - Array Methods (map, filter, reduce, find)
 * - LocalStorage Persistence (recording past test scores & best attempts)
 * - Conditional Rendering & Modal Feedback
 * - CSS Animations & Transitions
 */
export default function SkillAssessment() {
  const { showToast, openModal } = useToast();

  const [activeTopicId, setActiveTopicId] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [isAssessmentDone, setIsAssessmentDone] = useState(false);
  const [attemptsHistory, setAttemptsHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(ATTEMPTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeTopic = activeTopicId ? skillAssessmentTopics[activeTopicId] : null;

  // Sync attempts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attemptsHistory));
    } catch (e) {
      console.warn("Storage sync error for skill attempts:", e);
    }
  }, [attemptsHistory]);

  const handleStartAssessment = (topicId) => {
    setActiveTopicId(topicId);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsAssessmentDone(false);
  };

  const handleSelectOption = (idx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: idx
    }));
  };

  const handleNextOrFinish = () => {
    if (selectedAnswers[currentQIndex] === undefined) {
      showToast("Please choose an answer before proceeding.", "warning");
      return;
    }

    // Check if this was the final question
    if (currentQIndex === activeTopic.questions.length - 1) {
      finishAssessment();
      return;
    }

    // Advance to next question
    setCurrentQIndex((prev) => prev + 1);
  };

  const finishAssessment = () => {
    setIsAssessmentDone(true);
    const total = activeTopic.questions.length;
    let score = 0;
    activeTopic.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score += 1;
    });

    const percentage = Math.round((score / total) * 100);

    // Save attempt to history
    const newAttempt = {
      id: `attempt-${Date.now()}`,
      topicId: activeTopic.id,
      topicName: activeTopic.name,
      score,
      total,
      percentage,
      date: new Date().toLocaleDateString()
    };
    setAttemptsHistory((prev) => [...prev, newAttempt]);

    if (percentage >= 80) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }

    openModal(
      `${activeTopic.name} Assessment Complete!`,
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: percentage >= 70 ? "var(--success-bg)" : "var(--primary-light)",
            color: percentage >= 70 ? "var(--success)" : "var(--primary)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px auto"
          }}
        >
          <Award size={32} />
        </div>

        <h2 style={{ fontSize: "26px", margin: "0 0 6px 0", color: "var(--text-heading)" }}>
          {percentage}% Score ({score}/{total} Correct)
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
          {percentage >= 80
            ? "Distinction! Outstanding mastery of core concepts."
            : percentage >= 60
            ? "Proficient! Solid foundation. Review incorrect answers below."
            : "Keep practicing! Review core concepts and retake the assessment."}
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn outline"
            style={{ flex: 1 }}
            onClick={() => handleStartAssessment(activeTopicId)}
          >
            <RotateCcw size={14} /> Retake Assessment
          </button>
          <button
            type="button"
            className="btn primary"
            style={{ flex: 1 }}
            onClick={() => setActiveTopicId(null)}
          >
            Skill Library
          </button>
        </div>
      </div>
    );
  };

  // Find previous best percentage for a given topic
  const getTopicBest = (topicId) => {
    const attempts = attemptsHistory.filter((a) => a.topicId === topicId);
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.percentage));
  };

  return (
    <div className="skill-assessment-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Technical Skill Assessments</h1>
          <p>Validate your programming knowledge with structured, timed evaluations and track certification scores.</p>
        </div>
      </div>

      {!activeTopic ? (
        /* ================= TOPIC SELECTION ================= */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px 0" }}>Available Skill Certifications</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                Select a subject to test your proficiency across 10 structured questions.
              </p>
            </div>

            {attemptsHistory.length > 0 && (
              <span className="chip" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <History size={13} /> {attemptsHistory.length} Test Attempt(s) Logged
              </span>
            )}
          </div>

          <div className="topic-grid">
            {Object.entries(skillAssessmentTopics).map(([id, topic]) => {
              const bestScore = getTopicBest(id);
              return (
                <div
                  key={id}
                  className="topic-card"
                  onClick={() => handleStartAssessment(id)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span
                      style={{
                        backgroundColor: `${topic.color}20`,
                        color: topic.color,
                        fontWeight: 800,
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      {topic.badge}
                    </span>
                    <span className="chip" style={{ fontSize: "11px" }}>
                      {topic.difficulty}
                    </span>
                  </div>

                  <h3>{topic.name}</h3>
                  <p>{topic.subtitle}</p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", borderTop: "1px solid var(--border-card)", paddingTop: "10px", marginTop: "10px" }}>
                    <span style={{ color: "var(--text-muted)" }}>
                      {bestScore !== null ? `Best: ${bestScore}%` : "Not attempted"}
                    </span>
                    <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                      Start Test →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= ACTIVE ASSESSMENT ================= */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className="btn outline"
                style={{ padding: "6px 12px", fontSize: "12.5px" }}
                onClick={() => setActiveTopicId(null)}
              >
                <ArrowLeft size={14} /> Change Topic
              </button>
              <button
                type="button"
                className="btn outline"
                style={{ padding: "6px 12px", fontSize: "12.5px" }}
                onClick={() => handleStartAssessment(activeTopicId)}
                title="Restart this assessment"
              >
                <RotateCcw size={13} /> Retake Test
              </button>
            </div>

            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {activeTopic.name} • Question <strong>{currentQIndex + 1}</strong> of {activeTopic.questions.length}
            </span>
          </div>

          <div className="grid two" style={{ alignItems: "start" }}>
            {/* Question Card on Left */}
            <div className="card question">
              <span className="eyebrow" style={{ color: activeTopic.color }}>
                {activeTopic.name} • Question {currentQIndex + 1}
              </span>

              <h2 style={{ fontSize: "19px", margin: "10px 0 22px 0" }}>
                {activeTopic.questions[currentQIndex].q}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
                {activeTopic.questions[currentQIndex].options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQIndex] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`answer ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectOption(idx)}
                    >
                      <strong style={{ marginRight: "10px" }}>{String.fromCharCode(65 + idx)}.</strong>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  className="btn outline"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  style={{ visibility: currentQIndex > 0 ? "visible" : "hidden" }}
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                <button
                  type="button"
                  className="btn primary"
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  onClick={handleNextOrFinish}
                >
                  {currentQIndex === activeTopic.questions.length - 1
                    ? "Finish Assessment & Grade"
                    : "Next Question →"}
                </button>
              </div>
            </div>

            {/* Assessment Progress & Breakdown on Right */}
            <div className="card">
              <h3 style={{ marginBottom: "6px" }}>Assessment Progress</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "0 0 16px 0" }}>
                Complete all questions to unlock your certification score.
              </p>

              <div className="progress" style={{ height: "10px", marginBottom: "14px" }}>
                <i
                  style={{
                    width: `${((currentQIndex + 1) / activeTopic.questions.length) * 100}%`
                  }}
                />
              </div>

              {/* Live Answered Tracker */}
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "var(--bg-app)",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  marginBottom: "16px"
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Questions Answered
                </span>
                <strong style={{ fontSize: "28px", color: "var(--primary)" }}>
                  {Object.keys(selectedAnswers).length} / {activeTopic.questions.length}
                </strong>
                {getTopicBest(activeTopic.id) !== null && (
                  <small style={{ color: "var(--success)", display: "block", fontWeight: 600, marginTop: "4px" }}>
                    Your Previous Best: {getTopicBest(activeTopic.id)}%
                  </small>
                )}
              </div>

              {/* Instructions */}
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                <strong>Test Rules:</strong>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px" }}>
                  <li>Navigate freely between questions to review choices.</li>
                  <li>Click &quot;Finish Assessment &amp; Grade&quot; on the final question to submit.</li>
                  <li>Your percentage is saved to localStorage for profile tracking.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ================= POST-ASSESSMENT BREAKDOWN ================= */}
          {isAssessmentDone && (
            <div className="card" style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <BookOpen size={20} color="var(--primary)" />
                  <h3 style={{ margin: 0 }}>Correct &amp; Incorrect Answer Breakdown</h3>
                </div>

                <button
                  type="button"
                  className="btn outline"
                  onClick={() => handleStartAssessment(activeTopicId)}
                >
                  <RotateCcw size={14} /> Retake Assessment
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeTopic.questions.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const isCorrect = userChoice === q.correct;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--bg-app)",
                        border: isCorrect ? "1px solid rgba(21, 148, 94, 0.3)" : "1px solid rgba(220, 38, 38, 0.3)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        {isCorrect ? (
                          <CheckCircle2 size={18} color="var(--success)" />
                        ) : (
                          <XCircle size={18} color="var(--danger)" />
                        )}
                        <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                          Question {idx + 1}: {q.q}
                        </strong>
                      </div>

                      <div style={{ display: "flex", gap: "16px", fontSize: "12.5px", color: "var(--text-muted)", marginLeft: "26px" }}>
                        <span>
                          Your Answer: <strong style={{ color: isCorrect ? "var(--success)" : "var(--danger)" }}>{q.options[userChoice] || "Skipped"}</strong>
                        </span>
                        {!isCorrect && (
                          <span>
                            Correct Answer: <strong style={{ color: "var(--success)" }}>{q.options[q.correct]}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
