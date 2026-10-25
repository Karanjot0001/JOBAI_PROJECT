import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import { ResumeProvider } from "./context/ResumeContext";

// Layout & Route Guards
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobMatcher from "./pages/JobMatcher";
import JobSearch from "./pages/JobSearch";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";
import InterviewPractice from "./pages/InterviewPractice";
import SkillAssessment from "./pages/SkillAssessment";
import CareerRoadmap from "./pages/CareerRoadmap";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";

const SESSION_LOADED_KEY = "jobai_session_loaded";

/**
 * InitialSessionGuard Component
 * Syllabus Concepts: React Router (useLocation, Navigate), useState, useEffect, sessionStorage
 * Guarantees fresh website launches in a new tab show the Loading splash screen,
 * while internal navigation and normal refreshes in the same tab proceed seamlessly.
 */
function InitialSessionGuard({ children }) {
  const location = useLocation();
  let isLoaded = false;
  try {
    isLoaded = sessionStorage.getItem(SESSION_LOADED_KEY) === "true";
  } catch {
    isLoaded = true;
  }

  if (!isLoaded && location.pathname !== "/loading") {
    return <Navigate to="/loading" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Main Application Component
 * Syllabus Concept: React Router (BrowserRouter, Routes, Route, Nested Routes, Protected Routes), Context API Composition
 */
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <JobProvider>
            <ResumeProvider>
              <BrowserRouter>
                <InitialSessionGuard>
                  <Routes>
                  {/* Public Authentication & Splash Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/loading" element={<Loading />} />

                  {/* Protected Application Shell */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
                    <Route path="resume-builder" element={<ResumeBuilder />} />
                    <Route path="job-matcher" element={<JobMatcher />} />
                    <Route path="job-search" element={<JobSearch />} />
                    <Route path="saved-jobs" element={<SavedJobs />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="interview-practice" element={<InterviewPractice />} />
                    <Route path="skill-assessment" element={<SkillAssessment />} />
                    <Route path="career-roadmap" element={<CareerRoadmap />} />
                    <Route path="settings" element={<Settings />} />

                    {/* Catch-All 404 Route within layout */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </InitialSessionGuard>
            </BrowserRouter>
            </ResumeProvider>
          </JobProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
