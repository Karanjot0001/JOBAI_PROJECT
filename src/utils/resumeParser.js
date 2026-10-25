/**
 * AI Resume Parser & ATS Scoring Engine
 * Syllabus Concept: Regex patterns, Array methods (reduce, filter, map), Objects, String manipulation
 */

export const skillsDatabase = {
  // Languages & Core
  "Java": ["java", "jvm", "j2ee"],
  "Python": ["python", "py", "django", "flask"],
  "JavaScript": ["javascript", "js", "ecmascript", "es6"],
  "TypeScript": ["typescript", "ts"],
  "C++": ["c++", "cpp"],
  "HTML": ["html", "html5"],
  "CSS": ["css", "css3", "sass", "scss", "tailwind"],
  
  // Frameworks & Libraries
  "React.js": ["react", "react.js", "reactjs"],
  "Node.js": ["node", "node.js", "nodejs", "express"],
  "Spring Boot": ["spring boot", "spring framework", "spring"],
  "Django": ["django"],
  "FastAPI": ["fastapi"],
  "Redux": ["redux", "redux toolkit"],
  
  // Databases
  "SQL": ["sql", "mysql", "postgresql", "postgres"],
  "MongoDB": ["mongodb", "mongo", "nosql"],
  "DBMS": ["dbms", "database management"],
  
  // Cloud & DevOps
  "Git": ["git", "github", "gitlab"],
  "Docker": ["docker", "containerization"],
  "Kubernetes": ["kubernetes", "k8s"],
  "AWS": ["aws", "amazon web services", "ec2", "s3"],
  "Linux": ["linux", "ubuntu", "bash", "shell"],
  
  // Computer Science Core
  "Data Structures": ["data structures", "dsa", "algorithms"],
  "OOP": ["oop", "object oriented", "polymorphism", "inheritance"],
  "REST APIs": ["rest api", "restful api", "rest apis", "api development"],
  
  // Data Science & AI
  "Machine Learning": ["machine learning", "ml", "scikit-learn"],
  "TensorFlow": ["tensorflow", "pytorch", "deep learning"],
  "Pandas": ["pandas", "numpy", "data analysis"]
};

export function extractEmail(text = "") {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

export function extractPhone(text = "") {
  const match = text.match(/(?:\+?\d[\d\s().-]{8,}\d)/);
  return match ? match[0].trim() : "";
}

export function detectExperience(text = "") {
  const yearMatch = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/i);
  if (yearMatch) return `${yearMatch[1]} Years`;
  if (/internship|intern\b/i.test(text)) return "Internship Experience";
  if (/experience|work history|employment/i.test(text)) return "Professional Experience Mentioned";
  return "Fresher / Entry Level";
}

export function detectEducation(text = "") {
  const degrees = [
    { pattern: /b\.?tech|bachelor of technology/i, label: "B.Tech" },
    { pattern: /b\.?e\.?|bachelor of engineering/i, label: "B.E." },
    { pattern: /m\.?tech|master of technology/i, label: "M.Tech" },
    { pattern: /b\.?sc|bachelor of science/i, label: "B.Sc" },
    { pattern: /m\.?sc|master of science/i, label: "M.Sc" },
    { pattern: /bca|bachelor of computer applications/i, label: "BCA" },
    { pattern: /mca|master of computer applications/i, label: "MCA" },
    { pattern: /computer science/i, label: "Computer Science" }
  ];

  for (const item of degrees) {
    if (item.pattern.test(text)) {
      return item.label;
    }
  }
  return "Graduate / In Progress";
}

export function detectProjects(text = "") {
  const matches = (text.match(/\b(project|developed|built|created|implemented|engineered)\b/gi) || []).length;
  if (/projects|academic projects|personal projects/i.test(text)) {
    return Math.max(1, Math.min(6, Math.floor(matches / 2) || 2));
  }
  return Math.min(matches, 3);
}

/**
 * Main Analysis Function
 * Calculates ATS score, matched keywords, gaps, and recommendations.
 */
export function analyzeResumeText(rawText = "", fileName = "resume.txt") {
  const cleaned = rawText.replace(/\s+/g, " ").trim();
  if (cleaned.length < 50) {
    throw new Error("The uploaded file does not contain enough extractable text. Please ensure it is a valid text-based PDF, DOCX, or TXT file.");
  }

  const lower = cleaned.toLowerCase();
  const detectedSkills = [];

  // Match skills from database
  Object.entries(skillsDatabase).forEach(([skill, aliases]) => {
    if (aliases.some((alias) => lower.includes(alias.toLowerCase()))) {
      detectedSkills.push(skill);
    }
  });

  // Common high-demand industry skills to compare against
  const coreTargetSkills = ["React.js", "Java", "Python", "SQL", "Git", "REST APIs", "Docker", "AWS", "Spring Boot"];
  const missingSkills = coreTargetSkills.filter((s) => !detectedSkills.includes(s));

  // Section analysis
  const hasSections = {
    education: /education|academics|qualifications/i.test(lower),
    experience: /experience|work history|employment|internship/i.test(lower),
    projects: /projects|academic projects|portfolio/i.test(lower),
    skills: /skills|technical skills|technologies/i.test(lower),
    summary: /summary|profile|about me|objective/i.test(lower)
  };

  const sectionsCount = Object.values(hasSections).filter(Boolean).length;
  const email = extractEmail(cleaned);
  const phone = extractPhone(cleaned);

  // Scoring algorithm (scaled between 35 and 98)
  let rawScore = 45;
  rawScore += Math.min(detectedSkills.length * 4, 30); // Up to 30 pts for skills
  rawScore += sectionsCount * 3;                      // Up to 15 pts for sections
  if (email) rawScore += 4;
  if (phone) rawScore += 4;
  if (hasSections.summary) rawScore += 3;
  if (hasSections.projects) rawScore += 4;

  const resumeScore = Math.max(35, Math.min(98, rawScore));
  
  // ATS Score weighting keyword density & readability
  const ats = Math.max(35, Math.min(98, Math.round(resumeScore * 0.9 + (detectedSkills.length > 5 ? 6 : 0))));

  // Actionable recommendations
  const recommendations = [];
  if (!email) recommendations.push("Add a professional contact email address in the header.");
  if (!phone) recommendations.push("Include a reachable contact phone number with country code.");
  if (!hasSections.summary) recommendations.push("Add a targeted 2-3 sentence professional summary highlighting your career objective.");
  if (!hasSections.projects) recommendations.push("Feature 2-3 key technical projects with measurable outcomes and GitHub links.");
  if (missingSkills.length > 0) {
    recommendations.push(`Consider adding in-demand skills such as ${missingSkills.slice(0, 3).join(", ")}.`);
  }
  if (!/linkedin|github/i.test(lower)) {
    recommendations.push("Include verified links to your GitHub profile and LinkedIn network.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Your resume is well structured! Customize keywords for each specific role you target.");
  }

  // 8-Point Resume Improvement Checklist
  const hasEmail = Boolean(email);
  const hasPhone = Boolean(phone);
  const certsDetected = /certification|certified|certificate|coursework|coursera|udemy|nptel|licen[sc]e/i.test(lower);
  const educationDetected = hasSections.education || detectEducation(cleaned) !== "Graduate / In Progress";
  const projectsDetected = hasSections.projects || detectProjects(cleaned) > 0;
  const experienceDetected = /experience|work history|employment|internship/i.test(lower);
  const skillsDetected = detectedSkills.length >= 3;
  const keywordsDetected = detectedSkills.length >= 5;

  const checklist = [
    {
      id: "contact",
      label: "Contact Information",
      detected: hasEmail && hasPhone,
      detail: hasEmail && hasPhone ? `${email} • ${phone}` : hasEmail ? email : hasPhone ? phone : "Not detected",
      recommendation: hasEmail && hasPhone
        ? "Professional email and contact number verified."
        : "Ensure both a professional email and a reachable phone number are included in the header."
    },
    {
      id: "summary",
      label: "Professional Summary",
      detected: hasSections.summary,
      detail: hasSections.summary ? "Career summary section detected" : "Section missing",
      recommendation: hasSections.summary
        ? "Summary provides quick context for recruiters."
        : "Add a 2-3 sentence professional summary highlighting your key technologies and career objective."
    },
    {
      id: "education",
      label: "Education & Degree",
      detected: educationDetected,
      detail: detectEducation(cleaned),
      recommendation: educationDetected
        ? "Degree qualifications clearly identified."
        : "Clearly list your degree program, institution name, and expected graduation year."
    },
    {
      id: "skills",
      label: "Technical Skills",
      detected: skillsDetected,
      detail: `${detectedSkills.length} technical skills found`,
      recommendation: skillsDetected
        ? "Diverse technical competencies detected."
        : "Group skills clearly into Languages, Frameworks, Databases, and Tools."
    },
    {
      id: "projects",
      label: "Key Projects",
      detected: projectsDetected,
      detail: `${detectProjects(cleaned)} project entries identified`,
      recommendation: projectsDetected
        ? "Project portfolio showcases practical implementation."
        : "Feature at least 2 key projects with technology stacks and GitHub repository links."
    },
    {
      id: "experience",
      label: "Work Experience / Internships",
      detected: experienceDetected,
      detail: detectExperience(cleaned),
      recommendation: experienceDetected
        ? "Professional or internship history mentioned."
        : "Highlight relevant internships, academic project leadership, or open-source contributions."
    },
    {
      id: "certifications",
      label: "Certifications & Coursework",
      detected: certsDetected,
      detail: certsDetected ? "Industry certification keywords detected" : "No certifications detected",
      recommendation: certsDetected
        ? "Accreditation adds third-party credibility."
        : "Add relevant certifications (e.g. AWS Certified, Java SE, React or Coursera) to validate skills."
    },
    {
      id: "keywords",
      label: "ATS Keyword Density",
      detected: keywordsDetected,
      detail: `${detectedSkills.length} core taxonomy matches`,
      recommendation: keywordsDetected
        ? "Strong alignment with standard developer job descriptions."
        : "Incorporate more industry keywords aligned directly with your desired role."
    }
  ];

  return {
    fileName,
    text: cleaned,
    detected: detectedSkills,
    missing: missingSkills,
    resumeScore,
    ats,
    experience: detectExperience(cleaned),
    education: detectEducation(cleaned),
    projects: detectProjects(cleaned),
    keywords: detectedSkills.length,
    recommendations,
    sections: hasSections,
    checklist,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Target Company Resume Optimization Helper
 * Compares resume text & skills against a target company's job description.
 * Pure ES6 string & array manipulation (filter, map, includes).
 */
export function compareResumeWithJob(analysis, targetCompany = "", targetRole = "", jobDescription = "") {
  if (!analysis || !jobDescription) return null;

  const lowerJd = jobDescription.toLowerCase();
  const resumeSkills = analysis.detected || [];

  // 1. Matched keywords (resume skills present in JD)
  const matchedKeywords = resumeSkills.filter((skill) =>
    lowerJd.includes(skill.toLowerCase().replace(".", ""))
  );

  // 2. Missing keywords (skills in our taxonomy that appear in the JD but not in the resume)
  const missingKeywords = [];
  Object.entries(skillsDatabase).forEach(([skill, aliases]) => {
    const appearsInJd = aliases.some((a) => lowerJd.includes(a.toLowerCase()));
    const appearsInResume = resumeSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (appearsInJd && !appearsInResume) {
      missingKeywords.push(skill);
    }
  });

  // Calculate estimated match percentage
  const totalRelevantSkills = matchedKeywords.length + missingKeywords.length;
  const matchPercentage = totalRelevantSkills > 0
    ? Math.round((matchedKeywords.length / totalRelevantSkills) * 100)
    : 65;

  // Actionable recommendations
  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Incorporate high-priority keywords such as ${missingKeywords.slice(0, 4).join(", ")} into your projects or skills list.`
    );
  }
  if (targetRole && !analysis.text?.toLowerCase().includes(targetRole.toLowerCase())) {
    suggestions.push(
      `Explicitly mention the target role title "${targetRole}" in your professional summary.`
    );
  }
  if (matchedKeywords.length > 0) {
    suggestions.push(
      `Quantify your accomplishments for matched competencies (${matchedKeywords.slice(0, 3).join(", ")}) with specific metrics.`
    );
  }
  suggestions.push(
    `Tailor project bullet points to reflect how your skills solve engineering challenges at ${targetCompany || "the company"}.`
  );

  return {
    targetCompany: targetCompany || "Target Company",
    targetRole: targetRole || "Desired Role",
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    suggestions
  };
}

