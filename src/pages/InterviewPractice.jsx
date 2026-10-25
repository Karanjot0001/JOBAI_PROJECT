import React, { useState } from "react";
import { technicalTopics, openEndedPracticeQuestions } from "../data/interviewQuestions";
import { useToast } from "../context/ToastContext";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  HelpCircle,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Award
} from "lucide-react";

/**
 * Interview Practice Page
 * Syllabus Concepts Covered:
 * - State Management (useState, multi-mode quiz engine)
 * - Array Methods (filter, map, entries, every)
 * - Conditional Rendering & Modal Alerts
 * - Object Key Mapping & Dynamic Lookup
 * - Keyboard & Button Event Handlers
 */
export default function InterviewPractice() {
  const { showToast, openModal } = useToast();

  const [mode, setMode] = useState("mcq"); // "mcq" or "openEnded"

  // MCQ state
  const [activeTopicKey, setActiveTopicKey] = useState(null);
  const [topicCategoryFilter, setTopicCategoryFilter] = useState("All");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({}); // { [qIndex]: selectedOptionIndex }
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Open-ended practice state
  const [selectedOeIndex, setSelectedOeIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState("");
  const [oeFeedback, setOeFeedback] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Start MCQ interview for chosen topic
  const handleSelectTopic = (key) => {
    setActiveTopicKey(key);
    setQuestionIndex(0);
    setAnswersMap({});
    setShowExplanation(false);
    setIsCompleted(false);
  };

  const handleRestartPractice = () => {
    setQuestionIndex(0);
    setAnswersMap({});
    setShowExplanation(false);
    setIsCompleted(false);
    showToast("Practice session restarted.", "info");
  };

  const handleSelectAnswer = (idx) => {
    if (answersMap[questionIndex] !== undefined) return; // Prevent changing after selection

    const currentTopic = technicalTopics[activeTopicKey];
    const currentQ = currentTopic.questions[questionIndex];

    setAnswersMap((prev) => ({
      ...prev,
      [questionIndex]: idx
    }));
    setShowExplanation(true);

    if (idx === currentQ.correct) {
      showToast("Correct Answer! 🎉", "success");
    } else {
      showToast("Incorrect. Review the explanation below.", "error");
    }
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setShowExplanation(answersMap[questionIndex - 1] !== undefined);
    }
  };

  const handleNextQuestion = () => {
    const currentTopic = technicalTopics[activeTopicKey];
    if (questionIndex < currentTopic.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setShowExplanation(answersMap[questionIndex + 1] !== undefined);
    } else {
      // Calculate score and complete
      setIsCompleted(true);
      const total = currentTopic.questions.length;
      let calculatedScore = 0;
      currentTopic.questions.forEach((q, idx) => {
        if (answersMap[idx] === q.correct) calculatedScore += 1;
      });

      const percentage = Math.round((calculatedScore / total) * 100);
      if (percentage >= 80) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      openModal(
        `${activeTopicKey} Interview Completed!`,
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <h2 style={{ fontSize: "28px", color: "var(--primary)", margin: "0 0 10px 0" }}>
            {calculatedScore} / {total} Correct ({percentage}%)
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
            {percentage >= 80
              ? "Outstanding performance! You possess solid technical mastery in this domain."
              : percentage >= 60
              ? "Good job! You understand the foundational concepts. Review the explanations below."
              : "Keep practicing! Review core fundamentals and attempt this topic assessment again."}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn outline"
              style={{ flex: 1 }}
              onClick={handleRestartPractice}
            >
              <RotateCcw size={14} /> Retake Drill
            </button>
            <button
              type="button"
              className="btn primary"
              style={{ flex: 1 }}
              onClick={() => setActiveTopicKey(null)}
            >
              Choose Another Topic
            </button>
          </div>
        </div>
      );
    }
  };

  // Evaluate open-ended response against model keywords and length
  const handleEvaluateAnswer = (e) => {
    e.preventDefault();
    if (!userAnswerText.trim() || userAnswerText.trim().length < 20) {
      showToast("Please provide a more complete answer (at least 20 words).", "warning");
      return;
    }

    const currentPrompt = openEndedPracticeQuestions[selectedOeIndex];
    const lowerAnswer = userAnswerText.toLowerCase();

    const matchedKeywords = currentPrompt.expectedKeywords.filter((kw) =>
      lowerAnswer.includes(kw.toLowerCase())
    );

    const wordCount = userAnswerText.trim().split(/\s+/).length;
    const keywordCoverage = Math.round((matchedKeywords.length / currentPrompt.expectedKeywords.length) * 100);

    let grade = "Good";
    if (keywordCoverage >= 70 && wordCount >= 60) grade = "Excellent";
    else if (keywordCoverage < 40 || wordCount < 40) grade = "Needs Improvement";

    setOeFeedback({
      wordCount,
      keywordCoverage,
      matchedKeywords,
      missingKeywords: currentPrompt.expectedKeywords.filter((kw) => !lowerAnswer.includes(kw.toLowerCase())),
      grade
    });

    showToast("Answer evaluated by JobAI Practice Engine!", "success");
  };

  // Compute live score
  const currentTopic = activeTopicKey ? technicalTopics[activeTopicKey] : null;
  const currentScore = currentTopic
    ? currentTopic.questions.reduce((acc, q, idx) => (answersMap[idx] === q.correct ? acc + 1 : acc), 0)
    : 0;

  // Filter topics for the topic selection grid
  const filteredTopics = Object.entries(technicalTopics).filter(([key]) => {
    if (topicCategoryFilter === "All") return true;
    if (topicCategoryFilter === "Languages") return key === "Java" || key === "JavaScript";
    if (topicCategoryFilter === "Core CS") return key === "DSA" || key === "OOP";
    if (topicCategoryFilter === "Systems & Data") return key === "DBMS" || key === "SQL" || key === "OS" || key === "Networks";
    return true;
  });

  return (
    <div className="interview-practice-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Technical Interview Preparation</h1>
          <p>Sharpen technical interview skills through multiple-choice drills and open-ended text answers.</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: "flex", gap: "6px", backgroundColor: "var(--bg-card)", padding: "4px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-card)" }}>
          <button
            type="button"
            className={`btn ${mode === "mcq" ? "primary" : "outline"}`}
            style={{ padding: "6px 12px", fontSize: "12.5px" }}
            onClick={() => { setMode("mcq"); setActiveTopicKey(null); }}
          >
            MCQ Practice Drills
          </button>
          <button
            type="button"
            className={`btn ${mode === "openEnded" ? "primary" : "outline"}`}
            style={{ padding: "6px 12px", fontSize: "12.5px" }}
            onClick={() => setMode("openEnded")}
          >
            Open-Ended Text Evaluation
          </button>
        </div>
      </div>

      {/* ================= MODE 1: MCQ PRACTICE ================= */}
      {mode === "mcq" && (
        <>
          {!activeTopicKey ? (
            /* Topic Selection Grid with Category Filter */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>Choose an Interview Category</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                    Select from 8 core computer science and software development interview tracks.
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["All", "Languages", "Core CS", "Systems & Data"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn ${topicCategoryFilter === cat ? "primary" : "outline"}`}
                      style={{ padding: "4px 10px", fontSize: "12px" }}
                      onClick={() => setTopicCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="topic-grid">
                {filteredTopics.map(([key, topic]) => (
                  <div
                    key={key}
                    className="topic-card"
                    onClick={() => handleSelectTopic(key)}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span className="topic-icon">{topic.icon}</span>
                      <span className="chip" style={{ fontSize: "11px", fontWeight: 700 }}>
                        {topic.badge}
                      </span>
                    </div>
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--primary)", fontWeight: 600 }}>
                      <span>{topic.questions.length} Questions</span>
                      <span>Start Practice →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active MCQ Quiz Screen */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn outline"
                    style={{ padding: "6px 12px", fontSize: "12.5px" }}
                    onClick={() => setActiveTopicKey(null)}
                  >
                    <ArrowLeft size={14} /> Back to All Topics
                  </button>
                  <button
                    type="button"
                    className="btn outline"
                    style={{ padding: "6px 12px", fontSize: "12.5px" }}
                    onClick={handleRestartPractice}
                    title="Restart this drill"
                  >
                    <RotateCcw size={13} /> Restart Drill
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Question <strong>{questionIndex + 1}</strong> of {currentTopic.questions.length}
                  </span>
                  <span className="status Applied">
                    Score: {currentScore}/{Object.keys(answersMap).length}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress" style={{ height: "6px", marginBottom: "20px" }}>
                <i
                  style={{
                    width: `${((questionIndex + 1) / currentTopic.questions.length) * 100}%`
                  }}
                />
              </div>

              {/* Question Card */}
              <div className="card" style={{ maxWidth: "760px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="eyebrow" style={{ color: "var(--primary)" }}>
                    {activeTopicKey} Interview Question #{questionIndex + 1}
                  </span>

                  {answersMap[questionIndex] !== undefined && (
                    <button
                      type="button"
                      className="link"
                      style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      onClick={() => setShowExplanation(!showExplanation)}
                    >
                      {showExplanation ? <EyeOff size={13} /> : <Eye size={13} />}
                      {showExplanation ? "Hide Explanation" : "Reveal Explanation"}
                    </button>
                  )}
                </div>

                <h2 style={{ fontSize: "18px", margin: "8px 0 20px 0" }}>
                  {currentTopic.questions[questionIndex].question}
                </h2>

                {/* Answer Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {currentTopic.questions[questionIndex].options.map((opt, idx) => {
                    let btnClass = "answer";
                    const isSelected = answersMap[questionIndex] === idx;
                    const isAnswered = answersMap[questionIndex] !== undefined;
                    const isCorrect = idx === currentTopic.questions[questionIndex].correct;

                    if (isAnswered) {
                      if (isCorrect) btnClass += " selected";
                      else if (isSelected && !isCorrect) btnClass += " answer-wrong";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={btnClass}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswered}
                        style={{
                          backgroundColor: isAnswered && isCorrect ? "var(--success-bg)" : undefined,
                          borderColor: isAnswered && isCorrect ? "var(--success)" : undefined,
                          color: isAnswered && isCorrect ? "var(--success)" : undefined
                        }}
                      >
                        <strong style={{ marginRight: "10px" }}>{String.fromCharCode(65 + idx)}.</strong>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation && (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-card)",
                      marginBottom: "20px",
                      fontSize: "13.5px",
                      lineHeight: 1.6
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: "4px", color: "var(--primary)" }}>
                      💡 Explanation:
                    </strong>
                    {currentTopic.questions[questionIndex].explanation}
                  </div>
                )}

                {/* Navigation Buttons: Previous & Next */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn outline"
                    disabled={questionIndex === 0}
                    onClick={handlePreviousQuestion}
                    style={{ visibility: questionIndex > 0 ? "visible" : "hidden" }}
                  >
                    <ArrowLeft size={14} /> Previous
                  </button>

                  <button
                    type="button"
                    className="btn primary"
                    disabled={answersMap[questionIndex] === undefined}
                    onClick={handleNextQuestion}
                  >
                    {questionIndex === currentTopic.questions.length - 1
                      ? "Finish & View Results"
                      : "Next Question →"}
                  </button>
                </div>
              </div>

              {/* Practice Session Completion Summary */}
              {isCompleted && (
                <div className="card" style={{ maxWidth: "760px", margin: "24px auto 0", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <Award size={20} color="var(--primary)" />
                    <h3 style={{ margin: 0 }}>Topic Practice Review: {activeTopicKey}</h3>
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                    Review each question and explanation from your drill.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentTopic.questions.map((q, idx) => {
                      const userAns = answersMap[idx];
                      const isCorrect = userAns === q.correct;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "12px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--bg-app)",
                            border: isCorrect ? "1px solid rgba(21, 148, 94, 0.3)" : "1px solid rgba(220, 38, 38, 0.3)"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            {isCorrect ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
                            <strong style={{ fontSize: "13px" }}>Question {idx + 1}: {q.question}</strong>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            <span>Your Answer: <strong>{q.options[userAns]}</strong></span> • <span>Correct: <strong style={{ color: "var(--success)" }}>{q.options[q.correct]}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= MODE 2: OPEN-ENDED TEXT RECORDING ================= */}
      {mode === "openEnded" && (
        <div className="grid two" style={{ alignItems: "start" }}>
          {/* Prompt Selector & Text Answer Form */}
          <div className="card form">
            <h3 style={{ margin: "0 0 6px 0" }}>Open-Ended Practice & Text Evaluation</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "0 0 16px 0" }}>
              Practice typing responses to comprehensive behavioral and technical architecture questions.
            </p>

            {/* Prompt Selector Tabs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {openEndedPracticeQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  className={`btn ${selectedOeIndex === idx ? "primary" : "outline"}`}
                  style={{ textAlign: "left", justifyContent: "flex-start", padding: "10px 12px" }}
                  onClick={() => {
                    setSelectedOeIndex(idx);
                    setOeFeedback(null);
                    setShowModelAnswer(false);
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", opacity: 0.85, display: "block" }}>
                      {q.category} • {q.role}
                    </span>
                    <strong style={{ fontSize: "13px" }}>{q.title}</strong>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ padding: "12px", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", display: "block", marginBottom: "4px" }}>
                💡 Strategy Tip:
              </span>
              <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                {openEndedPracticeQuestions[selectedOeIndex].hint}
              </p>
            </div>

            <form onSubmit={handleEvaluateAnswer}>
              <textarea
                rows={7}
                placeholder="Type your interview answer here. Structure your thoughts clearly with technical depth..."
                value={userAnswerText}
                onChange={(e) => setUserAnswerText(e.target.value)}
                required
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Target length: {openEndedPracticeQuestions[selectedOeIndex].idealLength}
                </span>

                <button type="submit" className="btn primary">
                  <Sparkles size={16} /> Evaluate My Answer
                </button>
              </div>
            </form>
          </div>

          {/* Feedback & Model Answer Pane */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <h3 style={{ margin: 0 }}>Automated Evaluation Feedback</h3>
              <button
                type="button"
                className="link"
                style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                onClick={() => setShowModelAnswer(!showModelAnswer)}
              >
                {showModelAnswer ? <EyeOff size={13} /> : <Eye size={13} />}
                {showModelAnswer ? "Hide Model Answer" : "Reveal Model Answer"}
              </button>
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "12.5px", margin: "0 0 16px 0" }}>
              Real-time scoring against industry-standard terminology and model structures.
            </p>

            {oeFeedback ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    padding: "16px",
                    backgroundColor: "var(--bg-app)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "16px",
                    textAlign: "center"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Keyword Match</span>
                    <strong style={{ display: "block", fontSize: "22px", color: "var(--success)" }}>
                      {oeFeedback.keywordCoverage}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Word Count</span>
                    <strong style={{ display: "block", fontSize: "22px", color: "var(--primary)" }}>
                      {oeFeedback.wordCount} words
                    </strong>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                    Detected Key Concepts:
                  </strong>
                  <div className="chips">
                    {oeFeedback.matchedKeywords.map((kw) => (
                      <span key={kw} className="chip" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {oeFeedback.missingKeywords.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>
                      Recommended Concepts to Mention:
                    </strong>
                    <div className="chips">
                      {oeFeedback.missingKeywords.map((kw) => (
                        <span key={kw} className="chip" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--text-muted)" }}>
                <HelpCircle size={38} style={{ opacity: 0.3, marginBottom: "8px" }} />
                <p style={{ margin: 0, fontSize: "13px" }}>Type your answer on the left and submit to receive instant keyword analysis and comparison with benchmark responses.</p>
              </div>
            )}

            {/* Model Answer (toggleable) */}
            {showModelAnswer && (
              <div style={{ borderTop: "1px solid var(--border-card)", paddingTop: "14px", marginTop: "14px" }}>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px", color: "var(--primary)" }}>
                  Benchmark Model Answer:
                </strong>
                <p style={{ fontSize: "12.5px", lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                  {openEndedPracticeQuestions[selectedOeIndex].modelAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
