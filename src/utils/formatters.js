/**
 * String and Data Formatters
 * Syllabus Concept: ES6 string methods, Regex, Date API, Pure Functions
 */

export function getInitials(name = "") {
  if (!name || typeof name !== "string") return "U";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";
}

export function formatDate(date = new Date()) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return new Date().toLocaleDateString();
  }
}

export function truncateText(text = "", maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
