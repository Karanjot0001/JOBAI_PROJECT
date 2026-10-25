import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getInitials } from "../utils/formatters";
import InputField from "../components/InputField";
import { User, Rocket, Bell, Lock, LogOut, CheckCircle2 } from "lucide-react";

/**
 * Settings & Profile Page
 * Syllabus Concept: Controlled Forms, Two-Way Data Binding, State Synchronization, Context API
 */
export default function Settings() {
  const { user, careerGoal, syncProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load existing settings or defaults
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("jobaiSettings") || "{}");
      return {
        name: user?.name || saved.name || "Sujal Gupta",
        email: user?.email || saved.email || "sujal@example.com",
        phone: saved.phone || "+91 98765 43210",
        experience: saved.experience || "Fresher",
        targetRole: careerGoal || saved.targetRole || "Full Stack Developer",
        location: saved.location || "Chandigarh",
        workMode: saved.workMode || "Any",
        salary: saved.salary || "₹5–8 LPA",
        jobAlerts: saved.jobAlerts !== false,
        emailNotifications: saved.emailNotifications !== false,
        applicationReminders: saved.applicationReminders !== false,
        interviewReminders: saved.interviewReminders !== false
      };
    } catch {
      return {
        name: user?.name || "User",
        email: user?.email || "user@jobai.com",
        phone: "+91 98765 43210",
        experience: "Fresher",
        targetRole: "Full Stack Developer",
        location: "Chandigarh",
        workMode: "Any",
        salary: "₹5–8 LPA",
        jobAlerts: true,
        emailNotifications: true,
        applicationReminders: true,
        interviewReminders: true
      };
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    try {
      // Synchronize through AuthContext
      syncProfile(profileData.name, profileData.email, profileData.targetRole);

      // Save complete settings object
      localStorage.setItem("jobaiSettings", JSON.stringify(profileData));
      showToast("Settings and profile updated successfully!", "success");
    } catch {
      showToast("Failed to save settings.", "error");
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login");
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Settings & Profile Preferences</h1>
          <p>Customize your JobAI experience, career preferences, notifications, and security credentials.</p>
        </div>
      </div>

      <div className="grid two" style={{ gridTemplateColumns: "minmax(0, 1fr) 300px", alignItems: "start" }}>
        {/* ================= LEFT: SETTINGS FORMS ================= */}
        <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Section 1: Personal Info */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <User size={20} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 2px 0" }}>Personal Information</h3>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Update your contact details across JobAI.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <InputField
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleChange}
              />
              <InputField
                label="Experience Level"
                name="experience"
                as="select"
                value={profileData.experience}
                onChange={handleChange}
                options={["Fresher", "0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"]}
              />
            </div>
          </div>

          {/* Section 2: Career Preferences */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Rocket size={20} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 2px 0" }}>Career Preferences</h3>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Tailors matching jobs and roadmap recommendations.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <InputField
                label="Target Role"
                name="targetRole"
                as="select"
                value={profileData.targetRole}
                onChange={handleChange}
                options={[
                  "Full Stack Developer",
                  "Frontend Developer",
                  "Backend Developer",
                  "Java Developer",
                  "Python Developer",
                  "AI/ML Engineer",
                  "Data Scientist",
                  "DevOps Engineer",
                  "Cloud Engineer"
                ]}
              />

              <InputField
                label="Preferred Location"
                name="location"
                as="select"
                value={profileData.location}
                onChange={handleChange}
                options={[
                  "Chandigarh",
                  "Mohali",
                  "Bengaluru",
                  "Remote",
                  "Hyderabad",
                  "Pune",
                  "Mumbai",
                  "Gurugram",
                  "Noida"
                ]}
              />

              <InputField
                label="Work Mode"
                name="workMode"
                as="select"
                value={profileData.workMode}
                onChange={handleChange}
                options={["Any", "Remote", "Hybrid", "On-site"]}
              />

              <InputField
                label="Expected Salary"
                name="salary"
                as="select"
                value={profileData.salary}
                onChange={handleChange}
                options={["Any", "₹3–5 LPA", "₹5–8 LPA", "₹8–12 LPA", "₹12–20 LPA", "₹20+ LPA"]}
              />
            </div>
          </div>

          {/* Section 3: Notification Toggles */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Bell size={20} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 2px 0" }}>Notifications</h3>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Choose updates and alert triggers.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "jobAlerts", label: "Job Alerts", desc: "Receive alerts for high-matching positions." },
                { name: "emailNotifications", label: "Email Notifications", desc: "Receive summary digests by email." },
                { name: "applicationReminders", label: "Application Reminders", desc: "Follow-up reminders on active applications." },
                { name: "interviewReminders", label: "Interview Reminders", desc: "Pre-interview notifications and prep reminders." }
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "13.5px" }}>{item.label}</strong>
                    <small style={{ color: "var(--text-muted)" }}>{item.desc}</small>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={profileData[item.name]}
                      onChange={handleChange}
                    />
                    <span className="slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Security & Actions */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--danger-bg)",
                  color: "var(--danger)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 2px 0" }}>Account & Session</h3>
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-muted)" }}>
                  Manage session credentials and access.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn outline"
                onClick={() => showToast("Password update simulated. Credentials active.", "info")}
              >
                Change Password
              </button>
              <button
                type="button"
                className="btn danger-outline"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Logout of JobAI
              </button>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div
            style={{
              position: "sticky",
              bottom: "20px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "var(--shadow-md)",
              zIndex: 10
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Changes are saved across all JobAI components.
            </p>
            <button type="submit" className="btn primary">
              Save All Preferences
            </button>
          </div>
        </form>

        {/* ================= RIGHT: PROFILE PREVIEW ================= */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="card" style={{ textAlign: "center", padding: "26px 18px" }}>
            <div
              className="avatar"
              style={{
                width: "80px",
                height: "80px",
                fontSize: "26px",
                margin: "0 auto 14px auto"
              }}
            >
              {getInitials(profileData.name)}
            </div>

            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
              {profileData.name || "User"}
            </h3>
            <p style={{ margin: "0 0 6px 0", fontSize: "13px", color: "var(--text-muted)" }}>
              {profileData.email}
            </p>
            <span className="chip" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 700 }}>
              {profileData.targetRole}
            </span>

            <div style={{ marginTop: "22px", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                <span>Profile Readiness</span>
                <span>92%</span>
              </div>
              <div className="progress" style={{ height: "8px" }}>
                <i style={{ width: "92%" }} />
              </div>
              <small style={{ color: "var(--text-muted)", fontSize: "11px", display: "block", marginTop: "4px" }}>
                Personal details, career goal, and resume connected.
              </small>
            </div>
          </div>

          <div className="card">
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>JobAI Personalization</h4>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 12px 0" }}>
              Your profile preferences help JobAI recommend more relevant jobs, tailor learning roadmaps, and refine interview drills.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--success)", fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Automated matching active
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
