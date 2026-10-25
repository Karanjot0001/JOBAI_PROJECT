import { jsPDF } from "jspdf";

/**
 * Client-Side Resume PDF Generator
 * Syllabus Concept: Browser APIs, Third-party utility integration, Blob creation, Document generation
 */
export function exportResumeToPdf(resumeData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const {
    name = "Candidate Name",
    role = "Software Developer",
    email = "email@example.com",
    phone = "+91 98765 43210",
    location = "India",
    summary = "",
    skills = "",
    experience = "",
    education = "",
    projects = ""
  } = resumeData;

  // Margin and cursor
  const leftMargin = 20;
  let cursorY = 22;

  // Header / Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(104, 60, 233); // JobAI Brand Primary
  doc.text(name || "Candidate Name", leftMargin, cursorY);
  cursorY += 8;

  // Title / Subheading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(role || "Software Developer", leftMargin, cursorY);
  cursorY += 6;

  // Contact Info Line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const contactText = [email, phone, location].filter(Boolean).join("  •  ");
  doc.text(contactText, leftMargin, cursorY);
  cursorY += 8;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, cursorY, 190, cursorY);
  cursorY += 8;

  // Section Helper supporting both structured arrays and plain text strings
  const formatSectionContent = (content) => {
    if (!content) return "";
    if (Array.isArray(content)) {
      return content
        .map((item) => {
          if (typeof item === "string") return item;
          const heading = item.title || item.role || "";
          const meta = [item.company, item.duration, item.tech].filter(Boolean).join(" • ");
          const desc = item.description || "";
          return [heading, meta, desc].filter(Boolean).join("\n");
        })
        .join("\n\n");
    }
    return String(content);
  };

  const formatSkills = (s) => {
    if (Array.isArray(s)) return s.join(", ");
    return String(s || "");
  };

  const addSection = (title, content) => {
    const formatted = formatSectionContent(content);
    if (!formatted || !formatted.trim()) return;

    if (cursorY > 265) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(104, 60, 233);
    doc.text(title.toUpperCase(), leftMargin, cursorY);
    cursorY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(formatted, 170);
    doc.text(splitText, leftMargin, cursorY);
    cursorY += (splitText.length * 5) + 6;
  };

  addSection("Professional Summary", summary);
  addSection("Core Technical Skills", formatSkills(skills));
  addSection("Experience / Internships", experience);
  addSection("Education & Qualifications", education);
  addSection("Key Projects", projects);

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Generated with JobAI Resume Builder", leftMargin, 285);

  const cleanFilename = (name || "JobAI_Resume").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${cleanFilename}_resume.pdf`);
}
