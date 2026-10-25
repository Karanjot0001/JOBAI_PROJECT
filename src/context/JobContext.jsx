import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { initialJobs } from "../data/jobsData";
import { useToast } from "./ToastContext";
import { formatDate } from "../utils/formatters";

const JobContext = createContext();

const SAVED_KEY = "jobai-saved";
const APPS_KEY = "jobai-apps";

/**
 * Job Catalog & Application Tracking Context
 * Syllabus Concept: Context API, CRUD Operations, Array immutability (spread, filter, map), localStorage
 */
export function JobProvider({ children }) {
  const { showToast } = useToast();

  // Saved Jobs State
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      return stored ? JSON.parse(stored) : [1, 2, 7]; // Sample bookmarks
    } catch {
      return [1, 2, 7];
    }
  });

  // Applications State (Full CRUD)
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(APPS_KEY);
      if (stored) return JSON.parse(stored);
      
      // Default sample applications
      const sample = [
        {
          id: "app-1",
          company: "Tech Mahindra",
          role: "Software Developer",
          loc: "Chandigarh",
          status: "Interviewing",
          date: formatDate(new Date(Date.now() - 3 * 86400000)),
          notes: "First technical round cleared on Core Java."
        },
        {
          id: "app-2",
          company: "Cognizant",
          role: "Java Developer",
          loc: "Pune",
          status: "Applied",
          date: formatDate(new Date(Date.now() - 6 * 86400000)),
          notes: "Application submitted through JobAI match."
        }
      ];
      localStorage.setItem(APPS_KEY, JSON.stringify(sample));
      return sample;
    } catch {
      return [];
    }
  });

  // Sync saved jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedJobIds));
    } catch (e) {
      console.warn("Error saving bookmark list:", e);
    }
  }, [savedJobIds]);

  // Sync applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPS_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn("Error saving applications:", e);
    }
  }, [applications]);

  const toggleSaveJob = useCallback((id) => {
    const numId = Number(id);
    setSavedJobIds((prev) => {
      const isAlreadySaved = prev.includes(numId);
      const updated = isAlreadySaved ? prev.filter((x) => x !== numId) : [...prev, numId];
      showToast(isAlreadySaved ? "Removed from saved jobs" : "Job bookmarked to saved jobs", "success");
      return updated;
    });
  }, [showToast]);

  const isJobSaved = useCallback((id) => {
    return savedJobIds.includes(Number(id));
  }, [savedJobIds]);

  // CRUD: Create Application
  const addApplication = useCallback((app) => {
    const newApp = {
      id: `app-${Date.now()}`,
      company: app.company || "Company",
      role: app.role || "Software Role",
      loc: app.loc || "Remote",
      status: app.status || "Applied",
      date: app.date || formatDate(new Date()),
      notes: app.notes || ""
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application for ${newApp.role} at ${newApp.company} added!`, "success");
  }, [showToast]);

  // CRUD: Update Application (by unique ID or index)
  const updateApplication = useCallback((idOrIndex, updatedFields) => {
    setApplications((prev) => {
      const copy = [...prev];
      const targetIndex =
        typeof idOrIndex === "string"
          ? copy.findIndex((a) => a.id === idOrIndex)
          : idOrIndex;

      if (targetIndex !== -1 && copy[targetIndex]) {
        copy[targetIndex] = { ...copy[targetIndex], ...updatedFields };
      }
      return copy;
    });
    showToast("Application status updated.", "info");
  }, [showToast]);

  // CRUD: Delete Application (by unique ID or index)
  const removeApplication = useCallback((idOrIndex) => {
    setApplications((prev) => {
      const copy = [...prev];
      const targetIndex =
        typeof idOrIndex === "string"
          ? copy.findIndex((a) => a.id === idOrIndex)
          : idOrIndex;

      if (targetIndex !== -1 && copy[targetIndex]) {
        const removed = copy.splice(targetIndex, 1)[0];
        showToast(`Removed application for ${removed?.company || "job"}.`, "info");
      }
      return copy;
    });
  }, [showToast]);

  // One-click apply from Job Card or Modal
  const applyToJob = useCallback((job) => {
    // Check if already applied
    const alreadyApplied = applications.some(
      (a) => a.company.toLowerCase() === job.company.toLowerCase() && a.role.toLowerCase() === job.title.toLowerCase()
    );

    if (alreadyApplied) {
      showToast(`You have already applied for ${job.title} at ${job.company}.`, "warning");
      return;
    }

    addApplication({
      company: job.company,
      role: job.title,
      loc: job.loc,
      status: "Applied",
      date: formatDate(new Date()),
      notes: `Applied through JobAI. Initial Match Score: ${job.match}%`
    });
  }, [applications, addApplication, showToast]);

  return (
    <JobContext.Provider
      value={{
        jobs: initialJobs,
        savedJobIds,
        savedJobs: initialJobs.filter((j) => savedJobIds.includes(j.id)),
        applications,
        toggleSaveJob,
        isJobSaved,
        addApplication,
        updateApplication,
        removeApplication,
        applyToJob
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}
