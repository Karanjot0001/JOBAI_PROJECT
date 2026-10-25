import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useJobs } from "../context/JobContext";
import { useResume } from "../context/ResumeContext";
import { getInitials } from "../utils/formatters";
import { Sun, Moon, Bell, Menu } from "lucide-react";

/**
 * Navbar / Topbar Component
 * Syllabus Concept: Reusable Components, Props, Event Handling, Context Consumption
 */
export default function Navbar({ onMobileToggle }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { openModal, showToast } = useToast();
  const { applications, savedJobIds } = useJobs();
  const { analysis } = useResume();

  const handleOpenNotifications = () => {
    openModal(
      "Notifications",
      <div>
        <p style={{ margin: "0 0 12px 0" }}>
          <strong>Resume Status:</strong> {analysis ? `Your resume analysis is active (${analysis.resumeScore}/100 ATS score).` : "No resume analyzed yet. Upload one to get matched jobs!"}
        </p>
        <p style={{ margin: "0 0 12px 0" }}>
          <strong>Applications:</strong> You are actively tracking {applications.length} job application(s).
        </p>
        <p style={{ margin: "0 0 16px 0" }}>
          <strong>Saved Jobs:</strong> You have {savedJobIds.length} bookmarked position(s).
        </p>
        <Link to="/settings" className="btn primary" style={{ width: "100%" }}>
          Manage Notification Preferences
        </Link>
      </div>
    );
  };

  const handleOpenProfileModal = () => {
    openModal(
      "My Account & Navigation",
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div className="avatar" style={{ width: "48px", height: "48px", fontSize: "16px" }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{user?.name || "Guest Visitor"}</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>{user?.email || "Not logged in"}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link to="/settings" className="btn primary" style={{ width: "100%" }}>
            Account Settings & Preferences
          </Link>
          <Link to="/loading" className="btn outline" style={{ width: "100%" }}>
            🚀 Preview Website Loading Screen
          </Link>
          <Link to="/login" className="btn outline" style={{ width: "100%" }}>
            🔐 Switch Account / Login Page
          </Link>
          <Link to="/signup" className="btn outline" style={{ width: "100%" }}>
            📝 Create New Account
          </Link>
          {user && (
            <button
              type="button"
              className="btn danger-outline"
              style={{ width: "100%", marginTop: "4px" }}
              onClick={() => {
                logout();
                showToast("Logged out successfully.", "info");
              }}
            >
              Sign Out of JobAI
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-toggle"
          onClick={onMobileToggle}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="topbar-right">
        {/* Theme Toggle Button */}
        <div className="theme">
          <span className="theme-label" title="Light Mode">
            <Sun size={16} />
          </span>

          <button
            id="themeBtn"
            type="button"
            className={isDark ? "dark" : ""}
            onClick={toggleTheme}
            aria-label="Toggle Dark and Light Mode"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <i />
          </button>

          <span className="theme-label" title="Dark Mode">
            <Moon size={16} />
          </span>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          className="icon-btn"
          onClick={handleOpenNotifications}
          aria-label="View Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="badge-dot" />
        </button>

        {/* Profile Button */}
        <button
          type="button"
          className="profile"
          onClick={handleOpenProfileModal}
          aria-label="View User Profile"
        >
          <span className="avatar">
            {getInitials(user?.name)}
          </span>
          <span className="profile-info">
            <b>{user?.name || "User"}</b>
            <small>View Profile</small>
          </span>
        </button>
      </div>
    </header>
  );
}
