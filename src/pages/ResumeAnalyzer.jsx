import React, { useState, useRef } from "react";
import { useResume } from "../context/ResumeContext";
import { useToast } from "../context/ToastContext";
import { analyzeResumeText, compareResumeWithJob } from "../utils/resumeParser";
import MetricRing from "../components/MetricRing";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  UploadCloud,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Building,
  ListChecks,
  Compass
} from "lucide-react";
import mammoth from "mammoth";

/**
 * Resume Analyzer Page
 * Syllabus Concepts Covered:
 * - File API & Drag/Drop Events (FileReader, ArrayBuffer)
 * - useRef (hidden file input trigger)
 * - useState & controlled forms
 * - Array methods (map, filter, reduce)
 * - String manipulation & Regex keyword extraction
 * - Asynchronous operations (async/await, try/catch/finally)
 */
export default function ResumeAnalyzer() {
  const { analysis, updateAnalysis } = useResume();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState("");

  // Target Company Resume Optimization state
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetJd, setTargetJd] = useState("");
  const [targetMatchResult, setTargetMatchResult] = useState(null);

  const fileInputRef = useRef(null);

  // Read file as text
  const extractTextFromFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();

    // Plain text
    if (ext === "txt") {
      return await file.text();
    }

    // DOCX via Mammoth
    if (ext === "docx") {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;
    }

    // PDF files: try text extraction or fallback
    if (ext === "pdf") {
      try {
        const buffer = await file.arrayBuffer();
        const textDecoder = new TextDecoder("utf-8");
        const raw = textDecoder.decode(buffer);
        const matches = raw.match(/\((.*?)\)|\[(.*?)\]/g);
        if (matches && matches.length > 30) {
          return matches.map((m) => m.replace(/[()[\]]/g, "")).join(" ");
        }
      } catch (e) {
        console.warn("PDF extraction fallback triggered:", e);
      }
      throw new Error(
        "PDF contains scanned/rasterized images or complex binary encoding. Please upload a DOCX/TXT file or use the 'Paste Resume Text' option."
      );
    }

    throw new Error("Unsupported format. Please upload a .txt, .docx, or .pdf file.");
  };

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit. Please upload a smaller file.", "error");
      return;
    }

    setLoading(true);
    try {
      const text = await extractTextFromFile(file);
      const result = analyzeResumeText(text, file.name);
      updateAnalysis(result);
      setTargetMatchResult(null); // Reset target comparison for new file
    } catch (error) {
      showToast(error.message || "Failed to analyze resume.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualPasteSubmit = (e) => {
    e.preventDefault();
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      showToast("Please paste at least 50 characters of resume content.", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = analyzeResumeText(pastedText, "pasted_resume.txt");
      updateAnalysis(result);
      setShowPasteModal(false);
      setPastedText("");
      setTargetMatchResult(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRunTargetOptimization = (e) => {
    e.preventDefault();
    if (!analysis) {
      showToast("Upload or analyze a resume first.", "warning");
      return;
    }
    if (!targetJd.trim() || targetJd.trim().length < 30) {
      showToast("Please paste a meaningful job description (at least 30 characters).", "warning");
      return;
    }

    const result = compareResumeWithJob(analysis, targetCompany, targetRole, targetJd);
    setTargetMatchResult(result);
    showToast(`Target match calculated: ${result.matchPercentage}% compatibility`, "success");
  };

  const handleDownloadAnalysis = () => {
    if (!analysis) {
      showToast("Analyze a resume first.", "warning");
      return;
    }

    const checklistText = (analysis.checklist || [])
      .map((item) => `• [${item.detected ? "DETECTED" : "NEEDS ACTION"}] ${item.label}: ${item.detail}\n  Recommendation: ${item.recommendation}`)
      .join("\n\n");

    const targetOptimizationText = targetMatchResult
      ? `\n================================================\nTARGET ROLE OPTIMIZATION:\nCompany: ${targetMatchResult.targetCompany}\nRole: ${targetMatchResult.targetRole}\nMatch Percentage: ${targetMatchResult.matchPercentage}%\nMatched Keywords: ${targetMatchResult.matchedKeywords.join(", ") || "None"}\nMissing Keywords: ${targetMatchResult.missingKeywords.join(", ") || "None"}\nSuggestions:\n${targetMatchResult.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`
      : "";

    const report = `================================================
JOBAI AI RESUME ANALYSIS REPORT
Date: ${new Date().toLocaleDateString()}
File: ${analysis.fileName}
================================================

OVERALL SCORES:
• Resume Score: ${analysis.resumeScore}/100
• ATS Compatibility: ${analysis.ats}%

DETECTED DETAILS:
• Experience Level: ${analysis.experience}
• Education Detected: ${analysis.education}
• Estimated Projects: ${analysis.projects}
• Total Key Technical Keywords: ${analysis.keywords}

RESUME IMPROVEMENT CHECKLIST:
${checklistText}

DETECTED SKILLS (${analysis.detected.length}):
${analysis.detected.join(", ")}

IDENTIFIED SKILL GAPS:
${analysis.missing?.length ? analysis.missing.join(", ") : "None. Core tech stack detected."}

ACTIONABLE IMPROVEMENT RECOMMENDATIONS:
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}
${targetOptimizationText}
================================================
Note: Analysis generated via client-side heuristic evaluation.
`;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JobAI_Analysis_${analysis.fileName.replace(/\.[^/.]+$/, "")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Analysis report downloaded.", "success");
  };

  // Calculate checklist counts
  const checklistItems = analysis?.checklist || [];
  const detectedChecklistCount = checklistItems.filter((item) => item.detected).length;

  return (
    <div className="resume-analyzer-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>AI Resume Analyzer</h1>
          <p>Client-side ATS keyword evaluation, structural verification checklist, and target role optimization.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn outline"
            onClick={() => setShowPasteModal(true)}
          >
            <ClipboardList size={16} /> Paste Resume Text
          </button>

          {analysis && (
            <button
              type="button"
              className="btn primary"
              onClick={handleDownloadAnalysis}
            >
              <Download size={16} /> Download Report
            </button>
          )}
        </div>
      </div>

      {/* ================= UPLOAD ZONE ================= */}
      <div
        className="card"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? "2px dashed var(--primary)" : "2px dashed var(--border-input)",
          backgroundColor: isDragOver ? "var(--primary-light)" : "var(--bg-card)",
          padding: "36px 20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "24px",
          transition: "var(--transition)"
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
        />

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 14px auto"
          }}
        >
          <UploadCloud size={28} />
        </div>

        <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>
          Upload your resume for instant analysis
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 16px 0" }}>
          Supports <strong>PDF, DOCX, or TXT</strong> files up to 5MB. 100% private client-side browser processing.
        </p>

        <button
          type="button"
          className="btn primary"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Choose Resume File
        </button>

        {analysis && (
          <p style={{ marginTop: "14px", fontSize: "12px", color: "var(--success)", fontWeight: 600 }}>
            ✓ Currently displaying analysis for: {analysis.fileName}
          </p>
        )}
      </div>

      {loading && <LoadingSpinner text="Reading resume text, detecting keywords, and calculating ATS score..." />}

      {/* ================= ANALYSIS RESULTS ================= */}
      {analysis && !loading && (
        <>
          {/* Stat Metric Grid */}
          <div className="grid four" style={{ marginBottom: "22px" }}>
            <div className="stat">
              <div>
                <span>Resume Score</span>
                <strong>{analysis.resumeScore}/100</strong>
                <small className="green">Comprehensive</small>
              </div>
              <MetricRing value={analysis.resumeScore} color="var(--success)" />
            </div>

            <div className="stat">
              <div>
                <span>ATS Score</span>
                <strong>{analysis.ats}%</strong>
                <small className="blue">Keyword match</small>
              </div>
              <MetricRing value={analysis.ats} color="var(--info)" />
            </div>

            <div className="stat">
              <div>
                <span>Skills Detected</span>
                <strong>{analysis.keywords}</strong>
                <small className="purple">From resume text</small>
              </div>
              <MetricRing value={Math.min(analysis.keywords * 10, 100)} color="var(--primary)" />
            </div>

            <div className="stat">
              <div>
                <span>Checklist Score</span>
                <strong>{detectedChecklistCount}/{checklistItems.length}</strong>
                <small className="orange">Sections Verified</small>
              </div>
              <MetricRing
                value={Math.round((detectedChecklistCount / (checklistItems.length || 1)) * 100)}
                color="var(--warning)"
              />
            </div>
          </div>

          {/* ================= FEATURE 2: RESUME IMPROVEMENT CHECKLIST ================= */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ListChecks size={20} color="var(--primary)" /> Resume Improvement Checklist
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Evaluates 8 fundamental sections required by technical recruiters and automated screening software.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="chip" style={{ fontWeight: 700, backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
                  {detectedChecklistCount} of {checklistItems.length} Verified
                </span>
              </div>
            </div>

            {/* Checklist Progress Bar */}
            <div className="progress" style={{ height: "8px", marginBottom: "18px" }}>
              <i style={{ width: `${(detectedChecklistCount / (checklistItems.length || 1)) * 100}%` }} />
            </div>

            {/* Checklist Items Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px" }}>
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-app)",
                    border: item.detected ? "1px solid rgba(21, 148, 94, 0.25)" : "1px solid rgba(232, 135, 9, 0.35)",
                    transition: "var(--transition)"
                  }}
                >
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>
                    {item.detected ? (
                      <CheckCircle size={20} color="var(--success)" />
                    ) : (
                      <XCircle size={20} color="var(--warning)" />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                      <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>{item.label}</strong>
                      <span
                        className="chip"
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          backgroundColor: item.detected ? "var(--success-bg)" : "var(--warning-bg)",
                          color: item.detected ? "var(--success)" : "var(--warning)"
                        }}
                      >
                        {item.detected ? "✓ Detected" : "⚠️ Needs Action"}
                      </span>
                    </div>

                    <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--text-muted)" }}>
                      {item.detail}
                    </p>

                    <div style={{ fontSize: "12px", color: item.detected ? "var(--text-main)" : "var(--warning)", lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600 }}>Tip: </span>{item.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= FEATURE 3: TARGET COMPANY RESUME OPTIMIZATION ================= */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Building size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Target Company Resume Optimization</h3>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
              Compare your resume directly against a specific company job description to uncover role-specific keyword alignments and gaps.
            </p>

            <form onSubmit={handleRunTargetOptimization} className="form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>
                    Target Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, TCS, Infosys"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>
                    Desired Job Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer, Full Stack Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "4px" }}>
                  Paste Job Description (Requirements & Responsibilities)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste the target job requirements or responsibilities here to calculate keyword overlap..."
                  value={targetJd}
                  onChange={(e) => setTargetJd(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <small style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>
                  * Estimated keyword-based recommendations, not an official ATS score or hiring guarantee.
                </small>
                <button type="submit" className="btn primary">
                  <Compass size={16} /> Compare Resume with Target Role
                </button>
              </div>
            </form>

            {/* Target Optimization Results Pane */}
            {targetMatchResult && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-card)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px" }}>
                      Optimization for {targetMatchResult.targetRole} at {targetMatchResult.targetCompany}
                    </h4>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Based on client-side keyword and technical taxonomy matching.
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: targetMatchResult.matchPercentage >= 70 ? "var(--success)" : "var(--primary)" }}>
                      {targetMatchResult.matchPercentage}% Compatibility
                    </span>
                  </div>
                </div>

                <div className="progress" style={{ height: "8px", marginBottom: "16px" }}>
                  <i style={{ width: `${targetMatchResult.matchPercentage}%` }} />
                </div>

                {/* Matched vs Missing Keywords */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
                  <div>
                    <strong style={{ fontSize: "12.5px", display: "block", marginBottom: "6px", color: "var(--success)" }}>
                      ✓ Matched Keywords ({targetMatchResult.matchedKeywords.length}):
                    </strong>
                    {targetMatchResult.matchedKeywords.length > 0 ? (
                      <div className="chips">
                        {targetMatchResult.matchedKeywords.map((k) => (
                          <span key={k} className="chip" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)", fontWeight: 600 }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No exact keyword overlaps found.</span>
                    )}
                  </div>

                  <div>
                    <strong style={{ fontSize: "12.5px", display: "block", marginBottom: "6px", color: "var(--danger)" }}>
                      ✗ Missing Role Keywords ({targetMatchResult.missingKeywords.length}):
                    </strong>
                    {targetMatchResult.missingKeywords.length > 0 ? (
                      <div className="chips">
                        {targetMatchResult.missingKeywords.map((k) => (
                          <span key={k} className="chip" style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", fontWeight: 600 }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>All identified role keywords present!</span>
                    )}
                  </div>
                </div>

                {/* Suggestions List */}
                <div>
                  <strong style={{ fontSize: "12.5px", display: "block", marginBottom: "6px", color: "var(--primary)" }}>
                    Actionable Improvement Suggestions:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "var(--text-main)", lineHeight: 1.6 }}>
                    {targetMatchResult.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Two-Column Deep Breakdown: Skills & Recommendations */}
          <div className="grid two">
            {/* Extracted Skills */}
            <div className="card">
              <h3 style={{ marginBottom: "8px" }}>Extracted Skills ({analysis.detected.length})</h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 14px 0" }}>
                Identified through technical taxonomy matching.
              </p>

              <div className="chips" style={{ marginBottom: "20px" }}>
                {analysis.detected.map((skill) => (
                  <span
                    key={skill}
                    className="chip"
                    style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 600 }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>

              <hr style={{ border: 0, borderTop: "1px solid var(--border-card)", margin: "18px 0" }} />

              <h4 style={{ margin: "0 0 10px 0", fontSize: "15px" }}>Identified Skill Gaps</h4>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                High-demand industry keywords missing from this resume:
              </p>
              <div className="chips" style={{ marginBottom: "20px" }}>
                {(analysis.missing || []).map((gap) => (
                  <span
                    key={gap}
                    className="chip"
                    style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", fontWeight: 600 }}
                  >
                    ✗ {gap}
                  </span>
                ))}
              </div>

              <div style={{ backgroundColor: "var(--bg-app)", padding: "14px", borderRadius: "var(--radius-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                  <span>Experience:</span>
                  <strong>{analysis.experience}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>Education:</span>
                  <strong>{analysis.education}</strong>
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="card">
              <h3 style={{ marginBottom: "8px" }}>Personalized Recommendations</h3>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 16px 0" }}>
                Follow these recommendations to improve your ATS score before applying.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {analysis.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px",
                      backgroundColor: "var(--bg-app)",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "13px" }}>{rec}</span>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: "var(--info-bg)", border: "1px solid rgba(8, 127, 191, 0.2)", borderRadius: "var(--radius-sm)", padding: "14px" }}>
                <h4 style={{ margin: "0 0 4px 0", color: "var(--info)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={15} /> What JobAI ATS Checks:
                </h4>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--text-main)", lineHeight: 1.6 }}>
                  <li>Technical keywords aligned with developer roles</li>
                  <li>Structural sections (Education, Experience, Skills, Projects)</li>
                  <li>Contact info integrity (Professional email and phone)</li>
                  <li>Measurable outcomes and action-oriented verbs</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= PASTE RESUME TEXT MODAL ================= */}
      {showPasteModal && (
        <div className="modal-bg" onClick={() => setShowPasteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <h2 style={{ marginTop: 0 }}>Paste Resume Content</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Copy and paste text directly from your resume document to run client-side ATS analysis.
            </p>

            <form onSubmit={handleManualPasteSubmit}>
              <textarea
                style={{ width: "100%", minHeight: "180px", marginBottom: "16px" }}
                placeholder="Paste your resume text here (Summary, Skills, Experience, Education)..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setShowPasteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Analyze Pasted Text
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
