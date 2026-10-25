import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  LayoutDashboard,
  FileSearch,
  Sparkles,
  Search,
  FileEdit,
  Milestone,
  Briefcase,
  Headphones,
  Bookmark,
  CheckSquare,
  Settings,
  Rocket,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";

/**
 * Sidebar Navigation Component
 * Syllabus Concept: React Router (NavLink, isActive, useNavigate), Component Composition, Event Handlers, Auth State
 */
export default function Sidebar({ isOpen, onCloseMobile }) {
  const { showToast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const mainNavItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },
    { to: "/job-matcher", label: "Job Matcher", icon: Sparkles },
    { to: "/job-search", label: "Job Search", icon: Search },
    { to: "/resume-builder", label: "Resume Builder", icon: FileEdit },
    { to: "/career-roadmap", label: "Career Roadmap", icon: Milestone },
    { to: "/applications", label: "Applications", icon: Briefcase },
    { to: "/interview-practice", label: "Interview Practice", icon: Headphones },
    { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
    { to: "/skill-assessment", label: "Skill Assessment", icon: CheckSquare },
    { to: "/settings", label: "Settings", icon: Settings }
  ];

  const authNavItems = [
    { to: "/loading", label: "Loading Screen", icon: Rocket },
    { to: "/login", label: "Login Page", icon: LogIn },
    { to: "/signup", label: "Sign Up Page", icon: UserPlus }
  ];

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully. See you soon!", "info");
    onCloseMobile?.();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Logo */}
      <div className="brand">
        <div className="brand-icon">✣</div>
        <div>
          <b>JobAI</b>
          <small>AI Resume Analyzer & Job Matcher</small>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="nav">
        <div className="sidebar-section-title">MAIN FEATURES</div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={item.to === "/"}
            >
              <span className="nav-icon">
                <Icon size={17} />
              </span>
              {item.label}
            </NavLink>
          );
        })}

        {/* Auth & Intro Pages Section */}
        <div className="sidebar-section-title">AUTH & INTRO PAGES</div>
        {authNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">
                <Icon size={17} />
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      {user && (
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Sign out of JobAI"
        >
          <LogOut size={16} /> Sign Out
        </button>
      )}

      {/* Pro Section Card */}
      <div className="pro" style={{ marginTop: "14px" }}>
        <b>♛ Upgrade to Pro</b>
        <p>Unlock advanced AI insights, ATS audits, and tailored analytics.</p>
        <button
          type="button"
          className="btn primary"
          style={{ width: "100%", padding: "7px 12px", fontSize: "12px" }}
          onClick={() => showToast("Pro 14-day trial activated!", "success")}
        >
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
