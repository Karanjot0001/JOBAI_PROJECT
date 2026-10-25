import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/InputField";
import { LogIn, Eye, EyeOff, Sparkles, Rocket, ArrowRight } from "lucide-react";

/**
 * Login Page Component
 * Syllabus Concepts Covered:
 * - Controlled Components (email, password, rememberMe, showPassword)
 * - Form Validation & Error State Management
 * - React Router v6 (useNavigate, useLocation, Link)
 * - Custom Hooks & Context API Integration (useAuth, useToast)
 * - Accessibility (semantic form, labels, aria attributes)
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, instantDemoLogin, isAuthenticated } = useAuth();
  const { showToast, openModal } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to previous intended destination or default to "/"
  const rawDestination = location.state?.from?.pathname;
  const destination =
    rawDestination && rawDestination !== "/login" && rawDestination !== "/loading"
      ? rawDestination
      : "/";

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = login(email, password);

    if (result.success) {
      showToast("Logged in successfully! Welcome back to JobAI.", "success");
      navigate(destination, { replace: true });
    } else {
      showToast(result.message, "error");
      setLoading(false);
    }
  };

  // Instant demo login - 1 click straight into the dashboard
  const handleInstantDemoLogin = () => {
    instantDemoLogin();
    showToast("Signed in instantly as Demo User (Sujal Gupta)!", "success");
    navigate(destination, { replace: true });
  };

  // Autofill form inputs for manual submission testing
  const handleAutofillDemo = () => {
    setEmail("sujal@example.com");
    setPassword("password123");
    setErrors({});
    showToast("Filled demo credentials into form inputs.", "info");
  };

  const handleForgotPassword = () => {
    openModal(
      "Reset Password Simulation",
      <div>
        <p style={{ margin: "0 0 12px 0", color: "var(--text-main)" }}>
          In this academic implementation, your account credentials are stored securely in browser <code>localStorage</code>.
        </p>
        <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "8px", marginBottom: "14px", fontSize: "13px" }}>
          <strong>Default Demo Credentials:</strong><br />
          Email: <code>sujal@example.com</code><br />
          Password: <code>password123</code>
        </div>
        <button
          type="button"
          className="btn primary"
          style={{ width: "100%" }}
          onClick={() => {
            setEmail("sujal@example.com");
            setPassword("password123");
            showToast("Filled demo credentials!", "success");
          }}
        >
          Autofill These Credentials
        </button>
      </div>
    );
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

        {/* Login Card */}
        <div className="auth-card">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Login to JobAI</h1>
          <p>Access your resume analysis, discover job matches, and track your applications.</p>

          {/* Quick Demo Access Card */}
          <div className="auth-demo-card">
            <b><Sparkles size={14} /> Quick Demo Access (For Evaluator & Viva)</b>
            <p>
              Login instantly with one click, or use <code>sujal@example.com</code> / <code>password123</code>.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                className="btn primary"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px" }}
                onClick={handleInstantDemoLogin}
              >
                ⚡ Instant 1-Click Login
              </button>
              <button
                type="button"
                className="btn outline"
                style={{ flex: 1, padding: "8px 12px", fontSize: "12px" }}
                onClick={handleAutofillDemo}
              >
                Autofill Form
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <InputField
              label="Email Address"
              id="email"
              type="email"
              name="email"
              placeholder="e.g. sujal@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="auth-row" style={{ marginTop: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span style={{ fontSize: "13px" }}>Remember me</span>
              </label>

              <button
                type="button"
                className="link"
                style={{ fontSize: "12.5px" }}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn primary"
              style={{ width: "100%", padding: "12px", marginTop: "10px" }}
              disabled={loading}
            >
              <LogIn size={16} /> {loading ? "Logging in..." : "Login to Account"}
            </button>
          </form>

          {/* Navigation Links */}
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px", textAlign: "center" }}>
            <p className="auth-switch" style={{ margin: 0 }}>
              Don't have an account?{" "}
              <Link to="/signup" className="link" style={{ fontWeight: 600 }}>
                Create a new account <ArrowRight size={13} style={{ display: "inline", verticalAlign: "middle" }} />
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
