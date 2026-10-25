import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/InputField";
import { UserPlus, Eye, EyeOff, Sparkles, Rocket, ArrowRight } from "lucide-react";

/**
 * Signup Page Component
 * Syllabus Concepts Covered:
 * - Controlled Forms & Complex State (useState for form object)
 * - Derived State & Real-time Validation (password strength calculation)
 * - Event Handling (onChange, onSubmit, checkbox toggles)
 * - Conditional Rendering & Dynamic Styling (strength meter colors)
 * - Context API Integration (useAuth, useToast)
 * - React Router v6 (Link, useNavigate)
 */
export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: "Full Stack Developer",
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const careerOptions = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "Data Analyst",
    "DevOps Engineer",
    "Cloud Engineer"
  ];

  // Calculate password strength dynamically
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "Empty", color: "var(--border-input)", width: "0%" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak", color: "#ef4444", width: "33%" };
    if (score <= 3) return { score: 2, label: "Medium", color: "#f59e0b", width: "66%" };
    return { score: 3, label: "Strong", color: "#10b981", width: "100%" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!formData.terms) {
      errs.terms = "You must accept the terms to create an account.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = signup(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      formData.goal
    );

    if (result.success) {
      showToast("Account created successfully! Welcome to JobAI.", "success");
      navigate("/", { replace: true });
    } else {
      showToast(result.message, "error");
      setLoading(false);
    }
  };

  // Quick fill sample data for fast testing
  const handleAutofillSample = () => {
    setFormData({
      name: "Rohit Sharma",
      email: "rohit.dev@example.com",
      password: "securePassword123!",
      goal: "Frontend Developer",
      terms: true
    });
    setErrors({});
    showToast("Filled sample candidate registration details.", "info");
  };

  return (
    <div className="auth-page">
      <main className="auth-wrap">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="brand-icon">✣</div>
          <div className="auth-brand-text">
            <b>JobAI</b>
            <small>AI Resume Analyzer & Job Matcher</small>
          </div>
        </div>

        {/* Signup Card */}
        <div className="auth-card">
          <span className="eyebrow">GET STARTED</span>
          <h1>Create your JobAI account</h1>
          <p>Set up your profile once. Your dashboard and matches will personalize automatically.</p>

          {/* Quick Fill Button */}
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn outline"
              style={{ fontSize: "11.5px", padding: "5px 10px" }}
              onClick={handleAutofillSample}
            >
              <Sparkles size={13} /> Autofill Sample Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <InputField
              label="Full Name"
              id="name"
              name="name"
              type="text"
              placeholder="e.g. SujalGupta"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <InputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="e.g. sujal@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div>
              <label htmlFor="password" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600 }}>
                Password <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <div className="password-field-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${errors.password ? "var(--danger)" : "var(--border-input)"}`,
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="strength-meter-wrap">
                  <div className="strength-bar-track">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: strength.width,
                        backgroundColor: strength.color
                      }}
                    />
                  </div>
                  <div className="strength-label">
                    <span>Password Strength:</span>
                    <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </div>
                </div>
              )}

              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <InputField
              label="Target Career Goal"
              id="goal"
              name="goal"
              as="select"
              value={formData.goal}
              onChange={handleChange}
              options={careerOptions}
              helperText="We will tailor your roadmap and job matches to this target role."
            />

            <div style={{ marginTop: "4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <span>I agree to the project terms and data privacy policy</span>
              </label>
              {errors.terms && <span className="error-text">{errors.terms}</span>}
            </div>

            <button
              type="submit"
              className="btn primary"
              style={{ width: "100%", padding: "12px", marginTop: "12px" }}
              disabled={loading}
            >
              <UserPlus size={16} /> {loading ? "Creating Account..." : "Create JobAI Account"}
            </button>
          </form>

          {/* Navigation Links */}
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px", textAlign: "center" }}>
            <p className="auth-switch" style={{ margin: 0 }}>
              Already have an account?{" "}
              <Link to="/login" className="link" style={{ fontWeight: 600 }}>
                Sign In <ArrowRight size={13} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
            </p>

            <Link
              to="/loading"
              style={{
                fontSize: "12px",
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                marginTop: "4px"
              }}
            >
              <Rocket size={13} /> View Website Loading Screen Animation
            </Link>

            {isAuthenticated && (
              <Link
                to="/"
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px"
                }}
              >
                ← Return to Active Dashboard
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
