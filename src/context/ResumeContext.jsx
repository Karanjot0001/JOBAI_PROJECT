import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "./ToastContext";
import { analyzeResumeText } from "../utils/resumeParser";

const ResumeContext = createContext();

const ANALYSIS_KEY = "jobai-analysis";
const BUILDER_KEY = "jobai-builder";

const SAMPLE_RESUME_TEXT = `Sujal Gupta
sujal@example.com | +91 98765 43210 | Chandigarh, India

PROFESSIONAL SUMMARY
Passionate Computer Science student focused on Full Stack Web Development, Java, Python, JavaScript, HTML, CSS, SQL, Git, and React.js.

EDUCATION
B.Tech in Computer Science & Engineering (2022 - 2026)

TECHNICAL SKILLS
Java, Python, JavaScript, React.js, HTML, CSS, SQL, Git, REST APIs

WORK EXPERIENCE
Software Development Intern at Tech Solutions (May 2024 - July 2024)
- Developed and maintained responsive React components.

KEY PROJECTS
AI Resume Analyzer & Job Matcher (React.js, Vite, CSS3)
- Engineered an ATS evaluation tool analyzing keyword density, structure, and job compatibility.

CERTIFICATIONS
Full Stack Web Development Certification, Java SE 11 Developer Course`;

/**
 * Resume Analysis & Builder Context
 * Syllabus Concept: Context API, Persistent State, Data Aggregation, Two-way Binding
 */
export function ResumeProvider({ children }) {
  const { showToast } = useToast();

  // Resume Analysis State
  const [analysis, setAnalysis] = useState(() => {
    try {
      const storedRaw = localStorage.getItem(ANALYSIS_KEY);
      if (storedRaw) {
        const stored = JSON.parse(storedRaw);
        // Ensure checklist is populated even if cached from an older version
        if (!stored.checklist) {
          const reAnalyzed = analyzeResumeText(stored.text || SAMPLE_RESUME_TEXT, stored.fileName || "resume.txt");
          stored.checklist = reAnalyzed.checklist;
          localStorage.setItem(ANALYSIS_KEY, JSON.stringify(stored));
        }
        return stored;
      }

      // Default initial analysis so dashboard, checklist & matcher are populated immediately
      const defaultAnalysis = analyzeResumeText(SAMPLE_RESUME_TEXT, "Sujal_Gupta_Resume.pdf");
      localStorage.setItem(ANALYSIS_KEY, JSON.stringify(defaultAnalysis));
      return defaultAnalysis;
    } catch {
      return null;
    }
  });

  // Resume Builder Form State
  const [builderData, setBuilderData] = useState(() => {
    try {
      const stored = localStorage.getItem(BUILDER_KEY);
      if (stored) return JSON.parse(stored);

      const defaultBuilder = {
        name: "Sujal Gupta",
        email: "sujal@example.com",
        phone: "+91 98765 43210",
        location: "Chandigarh, India",
        role: "Full Stack Developer",
        summary: "Passionate Computer Science student with hands-on experience in modern JavaScript, React.js, and Java backend development. Dedicated to crafting responsive, high-performance web applications.",
        skills: "Java, Python, JavaScript, React.js, HTML5, CSS3, SQL, Git, REST APIs",
        experience: "Software Development Intern • Tech Solutions (May 2024 - July 2024)\n- Designed and implemented 4 reusable React components improving page speed by 25%.\n- Collaborated with senior engineers to integrate RESTful backend microservices.",
        education: "B.Tech in Computer Science & Engineering (2022 - 2026)\nCGPA: 8.8 / 10 • Key Coursework: Data Structures, DBMS, Web Engineering, OOP",
        projects: "AI Resume Analyzer & Job Matcher (React.js, Vite, CSS3)\n- Engineered an ATS evaluation tool analyzing keyword density, structure, and job compatibility.\n- Built responsive dashboard with real-time score rings and localStorage persistence."
      };
      localStorage.setItem(BUILDER_KEY, JSON.stringify(defaultBuilder));
      return defaultBuilder;
    } catch {
      return {};
    }
  });

  // Sync analysis to localStorage
  useEffect(() => {
    try {
      if (analysis) {
        localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
      } else {
        localStorage.removeItem(ANALYSIS_KEY);
      }
    } catch (e) {
      console.warn("Error persisting analysis:", e);
    }
  }, [analysis]);

  // Sync builder data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BUILDER_KEY, JSON.stringify(builderData));
    } catch (e) {
      console.warn("Error persisting builder data:", e);
    }
  }, [builderData]);

  const updateAnalysis = useCallback((newAnalysis) => {
    setAnalysis(newAnalysis);
    showToast(`Resume parsed successfully! Score: ${newAnalysis.resumeScore}/100`, "success");
  }, [showToast]);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    localStorage.removeItem(ANALYSIS_KEY);
    showToast("Resume analysis reset.", "info");
  }, [showToast]);

  const updateBuilderData = useCallback((updates) => {
    setBuilderData((prev) => ({ ...prev, ...updates }));
    showToast("Resume preview updated.", "success");
  }, [showToast]);

  return (
    <ResumeContext.Provider
      value={{
        analysis,
        updateAnalysis,
        resetAnalysis,
        builderData,
        updateBuilderData
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
