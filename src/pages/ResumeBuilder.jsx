import React, { useState, useMemo } from "react";
import { useResume } from "../context/ResumeContext";
import { useToast } from "../context/ToastContext";
import { exportResumeToPdf } from "../utils/pdfGenerator";
import InputField from "../components/InputField";
import {
  Download,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

/**
 * Resume Builder Page
 * Syllabus Concepts Covered:
 * - Controlled Forms & Two-Way Data Binding
 * - Complex Component State (arrays of objects, dynamic lists)
 * - Array manipulation (map, filter, concat, spread operator)
 * - Form Validation with inline error states
 * - PDF generation via Client-side Canvas/Document engine
 * - Responsive Grid & Flexbox layouts
 */
export default function ResumeBuilder() {
  const { builderData, updateBuilderData } = useResume();
  const { showToast } = useToast();

  const [template, setTemplate] = useState("modern"); // "modern" or "classic"
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize skills as array of strings
  const initialSkills = useMemo(() => {
    if (Array.isArray(builderData?.skills)) return builderData.skills;
    if (typeof builderData?.skills === "string" && builderData.skills.trim()) {
      return builderData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return ["Java", "Python", "JavaScript", "React.js", "SQL", "Git", "REST APIs"];
  }, [builderData]);

  // Initialize projects as array of objects
  const initialProjects = useMemo(() => {
    if (Array.isArray(builderData?.projects)) return builderData.projects;
    if (typeof builderData?.projects === "string" && builderData.projects.trim()) {
      return [
        {
          id: "proj-1",
          title: "AI Resume Analyzer & Job Matcher",
          tech: "React.js, Vite, CSS3",
          description:
            "Engineered an ATS evaluation tool analyzing keyword density, structure, and job compatibility. Built responsive dashboard with real-time score rings and localStorage persistence."
        }
      ];
    }
    return [
      {
        id: "proj-1",
        title: "AI Resume Analyzer & Job Matcher",
        tech: "React.js, Vite, CSS3",
        description:
          "Engineered an ATS evaluation tool analyzing keyword density, structure, and job compatibility."
      }
    ];
  }, [builderData]);

  // Initialize experiences as array of objects
  const initialExperience = useMemo(() => {
    if (Array.isArray(builderData?.experience)) return builderData.experience;
    if (typeof builderData?.experience === "string" && builderData.experience.trim()) {
      return [
        {
          id: "exp-1",
          role: "Software Development Intern",
          company: "Tech Solutions",
          duration: "May 2024 - July 2024",
          description:
            "Designed and implemented 4 reusable React components improving page speed by 25%. Collaborated with senior engineers to integrate RESTful backend microservices."
        }
      ];
    }
    return [
      {
        id: "exp-1",
        role: "Software Development Intern",
        company: "Tech Solutions",
        duration: "May 2024 - July 2024",
        description:
          "Designed and implemented reusable React components and integrated RESTful endpoints."
      }
    ];
  }, [builderData]);

  // Main Form State
  const [formData, setFormData] = useState({
    name: builderData?.name || "Sujal Gupta",
    role: builderData?.role || "Full Stack Developer",
    email: builderData?.email || "sujal@example.com",
    phone: builderData?.phone || "+91 98765 43210",
    location: builderData?.location || "Chandigarh, India",
    summary:
      builderData?.summary ||
      "Passionate Computer Science student with hands-on experience in modern JavaScript, React.js, and Java backend development. Dedicated to crafting responsive, high-performance web applications.",
    education:
      builderData?.education ||
      "B.Tech in Computer Science & Engineering (2022 - 2026)\nCGPA: 8.8 / 10 • Key Coursework: Data Structures, DBMS, Web Engineering, OOP",
    skills: initialSkills,
    projects: initialProjects,
    experience: initialExperience
  });

  const [newSkillInput, setNewSkillInput] = useState("");

  // Handle general text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Skill Tags Management
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Skill already added.", "info");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }));
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Project Management (Add / Remove / Edit)
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: "New Project Title",
      tech: "Tech Stack (e.g. React, Node.js)",
      description: "Brief bullet points highlighting technical architecture and results."
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const handleUpdateProject = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    }));
  };

  const handleRemoveProject = (id) => {
    if (formData.projects.length <= 1) {
      showToast("Keep at least one project entry in your resume.", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  // Experience Management (Add / Remove / Edit)
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: "Position / Internship Title",
      company: "Company / Organization",
      duration: "Duration (e.g. June 2024 - Aug 2024)",
      description: "Key responsibilities, team collaboration, and deliverables achieved."
    };
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const handleUpdateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    }));
  };

  const handleRemoveExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));
  };

  // Calculate Resume Completeness Percentage
  const completeness = useMemo(() => {
    let score = 0;
    if (formData.name?.trim()) score += 15;
    if (formData.role?.trim()) score += 10;
    if (formData.email?.trim()) score += 10;
    if (formData.phone?.trim()) score += 10;
    if (formData.summary?.trim() && formData.summary.length >= 30) score += 15;
    if (formData.skills?.length >= 3) score += 15;
    if (formData.projects?.length >= 1) score += 15;
    if (formData.education?.trim()) score += 10;
    return Math.min(score, 100);
  }, [formData]);

  // Validation before Save or Download
  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Full name is required.";
    if (!formData.email?.trim()) errors.email = "Valid email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email format is invalid.";
    if (formData.skills.length === 0) errors.skills = "Add at least one technical skill.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!validateForm()) {
      showToast("Please fill in required fields before saving.", "warning");
      return;
    }

    // Save with formatted string fallbacks for full backwards compatibility
    const payload = {
      ...formData,
      skills: formData.skills.join(", ")
    };
    updateBuilderData(payload);
  };

  const handleDownloadPdf = () => {
    if (!validateForm()) {
      showToast("Please correct highlighted fields before exporting PDF.", "warning");
      return;
    }

    exportResumeToPdf(formData);
    showToast("Styled PDF resume downloaded!", "success");
  };

  return (
    <div className="resume-builder-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Resume Builder & Live Preview</h1>
          <p>Compose an ATS-ready, modern technical resume with dynamic sections, live formatting, and direct PDF export.</p>
        </div>

        <div className="page-actions">
          {/* Template Selector */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              backgroundColor: "var(--bg-card)",
              padding: "4px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-card)"
            }}
          >
            <button
              type="button"
              className={`btn ${template === "modern" ? "primary" : "outline"}`}
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setTemplate("modern")}
            >
              Modern Tech
            </button>
            <button
              type="button"
              className={`btn ${template === "classic" ? "primary" : "outline"}`}
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setTemplate("classic")}
            >
              Classic Clean
            </button>
          </div>

          <button type="button" className="btn primary" onClick={handleDownloadPdf}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* ================= RESUME COMPLETENESS INDICATOR ================= */}
      <div className="card" style={{ marginBottom: "20px", padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={18} color={completeness === 100 ? "var(--success)" : "var(--primary)"} />
            <strong style={{ fontSize: "13.5px" }}>
              Resume Completeness: {completeness}%
            </strong>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {completeness === 100
              ? "All critical sections completed! Ready for job applications."
              : "Complete all sections to maximize your ATS compatibility score."}
          </span>
        </div>
        <div className="progress" style={{ height: "8px" }}>
          <i style={{ width: `${completeness}%` }} />
        </div>
      </div>

      {/* Main Two-Column Layout: Form on Left, Live Preview on Right */}
      <div className="grid two" style={{ alignItems: "start" }}>
        {/* ================= EDITABLE FORM ================= */}
        <div className="card form">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0 }}>Resume Information</h3>
            <button
              type="button"
              className="btn outline"
              style={{ padding: "5px 12px", fontSize: "12px" }}
              onClick={handleSave}
            >
              <RefreshCw size={12} /> Save Changes
            </button>
          </div>

          {/* Section: Personal Info */}
          <div style={{ borderBottom: "1px solid var(--border-card)", paddingBottom: "16px", marginBottom: "18px" }}>
            <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px 0" }}>
              1. Personal Information
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <InputField
                  label="Full Name *"
                  name="name"
                  placeholder="e.g. Sujal Gupta"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.name && (
                  <span style={{ fontSize: "11px", color: "var(--danger)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <AlertCircle size={12} /> {validationErrors.name}
                  </span>
                )}
              </div>

              <InputField
                label="Professional Role / Title"
                name="role"
                placeholder="e.g. Full Stack Developer"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <InputField
                  label="Email Address *"
                  name="email"
                  type="email"
                  placeholder="e.g. sujal@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.email && (
                  <span style={{ fontSize: "11px", color: "var(--danger)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <AlertCircle size={12} /> {validationErrors.email}
                  </span>
                )}
              </div>

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <InputField
              label="Location"
              name="location"
              placeholder="e.g. Chandigarh, India"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>

          {/* Section: Summary */}
          <div style={{ borderBottom: "1px solid var(--border-card)", paddingBottom: "16px", marginBottom: "18px" }}>
            <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px 0" }}>
              2. Professional Summary
            </h4>
            <InputField
              label="Summary (2-3 sentences highlighting core skills and career focus)"
              name="summary"
              as="textarea"
              rows={3}
              placeholder="Passionate developer experienced in building responsive React apps and Java services..."
              value={formData.summary}
              onChange={handleInputChange}
            />
          </div>

          {/* Section: Technical Skills Manager */}
          <div style={{ borderBottom: "1px solid var(--border-card)", paddingBottom: "16px", marginBottom: "18px" }}>
            <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px 0" }}>
              3. Core Technical Skills
            </h4>

            {/* Existing Skills Tags */}
            <div className="chips" style={{ marginBottom: "12px", minHeight: "32px" }}>
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="chip"
                  style={{
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ color: "var(--danger)", fontSize: "14px", fontWeight: "bold", lineHeight: 1 }}
                    title={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Type skill (e.g. TypeScript, Docker, SQL) and press Add..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button type="button" className="btn outline" onClick={handleAddSkill}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Section: Key Projects (Dynamic List) */}
          <div style={{ borderBottom: "1px solid var(--border-card)", paddingBottom: "16px", marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                4. Key Projects ({formData.projects.length})
              </h4>
              <button
                type="button"
                className="link"
                style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                onClick={handleAddProject}
              >
                <Plus size={13} /> Add Project Entry
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {formData.projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-app)",
                    border: "1px solid var(--border-card)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="link"
                      style={{ color: "var(--danger)", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}
                      onClick={() => handleRemoveProject(proj.id)}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                    style={{ marginBottom: "8px" }}
                  />

                  <input
                    type="text"
                    placeholder="Technologies Used (e.g. React.js, Vite, CSS3)"
                    value={proj.tech}
                    onChange={(e) => handleUpdateProject(proj.id, "tech", e.target.value)}
                    style={{ marginBottom: "8px" }}
                  />

                  <textarea
                    rows={2}
                    placeholder="Key features, accomplishments, or outcomes..."
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(proj.id, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Work Experience (Dynamic List) */}
          <div style={{ borderBottom: "1px solid var(--border-card)", paddingBottom: "16px", marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                5. Experience & Internships ({formData.experience.length})
              </h4>
              <button
                type="button"
                className="link"
                style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                onClick={handleAddExperience}
              >
                <Plus size={13} /> Add Experience Entry
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {formData.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-app)",
                    border: "1px solid var(--border-card)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>
                      Experience #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="link"
                      style={{ color: "var(--danger)", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}
                      onClick={() => handleRemoveExperience(exp.id)}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      placeholder="Role / Job Title"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Duration (e.g. May 2024 - July 2024)"
                    value={exp.duration}
                    onChange={(e) => handleUpdateExperience(exp.id, "duration", e.target.value)}
                    style={{ marginBottom: "8px" }}
                  />

                  <textarea
                    rows={2}
                    placeholder="Summary of responsibilities and technical contributions..."
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Education */}
          <div style={{ marginBottom: "18px" }}>
            <h4 style={{ fontSize: "13px", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px 0" }}>
              6. Education & Qualifications
            </h4>
            <InputField
              label="Education details (Degree, College/University, Graduation Year, CGPA)"
              name="education"
              as="textarea"
              rows={3}
              placeholder="B.Tech in Computer Science & Engineering (2022 - 2026)..."
              value={formData.education}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="button"
            className="btn primary"
            style={{ width: "100%", padding: "12px" }}
            onClick={handleSave}
          >
            Save Resume Profile
          </button>
        </div>

        {/* ================= LIVE PREVIEW PANE ================= */}
        <div className="card" style={{ position: "sticky", top: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              <Eye size={18} color="var(--primary)" /> Live Resume Preview
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Template: <strong>{template === "modern" ? "Modern Tech" : "Classic Clean"}</strong>
            </span>
          </div>

          {/* Rendered Resume Document */}
          <div
            id="resumeDocument"
            style={{
              backgroundColor: "#ffffff",
              color: "#1e293b",
              padding: "32px",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
              minHeight: "520px",
              fontSize: "13px",
              lineHeight: 1.6
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: template === "modern" ? "2px solid #683ce9" : "1px solid #cbd5e1",
                paddingBottom: "14px",
                marginBottom: "18px"
              }}
            >
              <h1
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "24px",
                  color: template === "modern" ? "#683ce9" : "#0f172a"
                }}
              >
                {formData.name || "Your Name"}
              </h1>
              <p style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "#334155" }}>
                {formData.role || "Professional Title"}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                {[formData.email, formData.phone, formData.location].filter(Boolean).join("  •  ")}
              </p>
            </div>

            {/* Profile Summary */}
            {formData.summary && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: template === "modern" ? "#683ce9" : "#334155"
                  }}
                >
                  Professional Summary
                </h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#334155" }}>
                  {formData.summary}
                </p>
              </div>
            )}

            {/* Core Skills */}
            {formData.skills && formData.skills.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: template === "modern" ? "#683ce9" : "#334155"
                  }}
                >
                  Technical Skills
                </h4>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#334155" }}>
                  {formData.skills.join(", ")}
                </p>
              </div>
            )}

            {/* Key Projects */}
            {formData.projects && formData.projects.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: template === "modern" ? "#683ce9" : "#334155"
                  }}
                >
                  Key Projects
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {formData.projects.map((p) => (
                    <div key={p.id}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ fontSize: "13px", color: "#0f172a" }}>{p.title}</strong>
                        {p.tech && <span style={{ fontSize: "11.5px", color: "#683ce9", fontWeight: 600 }}>{p.tech}</span>}
                      </div>
                      <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#475569" }}>
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {formData.experience && formData.experience.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: template === "modern" ? "#683ce9" : "#334155"
                  }}
                >
                  Experience & Internships
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {formData.experience.map((e) => (
                    <div key={e.id}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                          {e.role} {e.company ? `• ${e.company}` : ""}
                        </strong>
                        {e.duration && <span style={{ fontSize: "11.5px", color: "#64748b" }}>{e.duration}</span>}
                      </div>
                      <p style={{ margin: "2px 0 0 0", fontSize: "12.5px", color: "#475569" }}>
                        {e.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {formData.education && (
              <div>
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: template === "modern" ? "#683ce9" : "#334155"
                  }}
                >
                  Education
                </h4>
                <div style={{ whiteSpace: "pre-line", fontSize: "12.5px", color: "#334155" }}>
                  {formData.education}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn primary"
              style={{ flex: 1 }}
              onClick={handleDownloadPdf}
            >
              <Download size={16} /> Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
