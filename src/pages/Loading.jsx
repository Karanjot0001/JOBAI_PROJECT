import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Rocket, LogIn, UserPlus, RotateCcw, Sparkles } from "lucide-react";

const SESSION_LOADED_KEY = "jobai_session_loaded";

/**
 * Loading / Splash Screen Component
 * Syllabus Concepts Covered:
 * - useEffect (lifecycle management, intervals, timeouts, cleanup functions)
 * - useState (stateful progress tracking, pause/fade-out transitions)
 * - useCallback (memoized replay and instant demo handlers)
 * - useRef (storing mutable timer references for foolproof memory leak cleanup)
 * - CSS Animations & Transitions (floating particles, keyframe glows, shimmer, logoEntrance, fadeExit)
 * - React Router (useNavigate programmatic routing, replace navigation)
 * - Browser Storage (sessionStorage tab session coordination)
 */
export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, instantDemoLogin } = useAuth();
  const { showToast } = useToast();

  const progressTimerRef = useRef(null);

  const location = useLocation();

  // Target destination after loading completes
  const rawTarget = location.state?.from?.pathname;
  const destination = isAuthenticated
    ? (rawTarget && rawTarget !== "/loading" && rawTarget !== "/login" ? rawTarget : "/")
    : "/login";

  // Mark session as loaded in sessionStorage
  const markSessionLoaded = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_LOADED_KEY, "true");
    } catch (e) {
      console.warn("sessionStorage access restricted:", e);
    }
  }, []);

  // Smooth Progress Interval Engine (targets 2.0 to 2.3 seconds total runtime)
  useEffect(() => {
    if (isPaused) return;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          return 100;
        }
        // Organic natural increments (2 to 4 per 40ms tick)
        const increment = Math.floor(Math.random() * 3) + 2;
        const nextVal = prev + increment;
        if (nextVal >= 100) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          return 100;
        }
        return nextVal;
      });
    }, 42);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPaused]);

  // Automated Smooth Exit and Navigation upon 100% completion
  useEffect(() => {
    if (progress < 100 || isPaused) return;

    // Mark loaded immediately upon reaching 100%
    markSessionLoaded();

    // Trigger subtle fade out
    const fadeTimer = setTimeout(() => {
      setIsExiting(true);
    }, 250);

    // Navigate smoothly to target destination
    const navTimer = setTimeout(() => {
      navigate(destination, {
        replace: true,
        state: location.state?.from ? { from: location.state.from } : undefined
      });
    }, 480);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [progress, isPaused, destination, navigate, location.state, markSessionLoaded]);

  // Handler to restart the loading animation
  const handleReplay = useCallback(() => {
    setIsExiting(false);
    setProgress(0);
    setIsPaused(false);
  }, []);

  // Instant Demo Login handler
  const handleInstantDemo = () => {
    markSessionLoaded();
    instantDemoLogin();
    showToast("Signed in as Demo User. Welcome to JobAI!", "success");
    navigate(destination === "/login" ? "/" : destination, { replace: true });
  };

  // Manual navigation handlers
  const handleNavigateDirect = (path) => {
    markSessionLoaded();
    navigate(path, { replace: true });
  };

  // Professional rotating career-related messages (Honest, within syllabus, no false AI API claims)
  const getPhaseText = () => {
    if (progress < 22) return "Initializing JobAI Workspace...";
    if (progress < 48) return "Preparing Resume Analysis Tools...";
    if (progress < 74) return "Loading Career Opportunities...";
    if (progress < 96) return "Personalizing Your Experience...";
    return "Welcome to JobAI!";
  };

  // Particles coordinates for ambient background floating effect
  const particles = [
    { top: "14%", left: "10%", size: "6px", delay: "0s", duration: "5.2s" },
    { top: "22%", left: "86%", size: "8px", delay: "1.1s", duration: "6.1s" },
    { top: "70%", left: "16%", size: "5px", delay: "2.3s", duration: "6.8s" },
    { top: "80%", left: "82%", size: "8px", delay: "0.7s", duration: "5.4s" },
    { top: "42%", left: "91%", size: "6px", delay: "3.0s", duration: "6.3s" },
    { top: "60%", left: "52%", size: "7px", delay: "1.6s", duration: "5.5s" },
    { top: "16%", left: "58%", size: "5px", delay: "2.5s", duration: "6.7s" },
    { top: "86%", left: "36%", size: "7px", delay: "3.4s", duration: "7.0s" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 38%, rgba(99, 102, 241, 0.22), transparent 50%), linear-gradient(135deg, #070b18, #0e1529, #080c19)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "24px",
        overflow: "hidden",
        boxSizing: "border-box",
        animation: isExiting ? "fadeExit 0.32s ease-out forwards" : undefined,
        transition: "opacity 0.3s ease-out"
      }}
    >
      {/* Background Floating Ambient Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particles.map((p, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(129, 140, 248, 0.8)",
              animation: `floatParticle ${p.duration} infinite ease-in-out`,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      {/* Main Center Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 5
        }}
      >
        {/* Glowing Logo Wrapper with Entrance Animation */}
        <div
          style={{
            position: "relative",
            marginBottom: "20px",
            animation: "logoEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-12px",
              borderRadius: "32px",
              background: "rgba(99, 102, 241, 0.38)",
              filter: "blur(22px)",
              animation: "pulseGlow 2.5s infinite alternate ease-in-out"
            }}
          />
          <div
            style={{
              position: "relative",
              width: "88px",
              height: "88px",
              borderRadius: "26px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "grid",
              placeItems: "center",
              fontSize: "44px",
              fontWeight: "900",
              color: "#ffffff",
              boxShadow: "0 0 35px rgba(99, 102, 241, 0.65), inset 0 0 20px rgba(255, 255, 255, 0.28)"
            }}
          >
            ✣
          </div>
        </div>

        {/* Shimmer Brand Header */}
        <h1
          className="shimmer-text"
          style={{
            fontSize: "36px",
            letterSpacing: "3px",
            margin: "0 0 6px 0",
            fontWeight: 900
          }}
        >
          JOB AI
        </h1>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            margin: "0 0 30px 0",
            letterSpacing: "0.6px"
          }}
        >
          AI Resume Analyzer & Job Matcher
        </p>

        {/* Circular Percentage Counter with Glowing Ring */}
        <div
          style={{
            position: "relative",
            width: "112px",
            height: "112px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            marginBottom: "24px"
          }}
        >
          {/* Animated Spinner Border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.08)",
              borderTopColor: "#6366f1",
              borderRightColor: "#a855f7",
              animation: "spinRing 1.2s linear infinite"
            }}
          />
          <div
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.5px"
            }}
          >
            {progress}%
          </div>
        </div>

        {/* Progress Bar Track & Fill */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "16px",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.4)"
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
              borderRadius: "999px",
              transition: "width 0.12s ease-out",
              boxShadow: "0 0 14px rgba(99, 102, 241, 0.7)"
            }}
          />
        </div>

        {/* Professional Rotating Career-Related Message */}
        <p
          style={{
            color: "#cbd5e1",
            fontSize: "13.5px",
            margin: "0 0 24px 0",
            minHeight: "22px",
            fontWeight: 500,
            transition: "all 0.2s ease"
          }}
        >
          {getPhaseText()}
        </p>

        {/* Interactive Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%"
          }}
        >
          {isAuthenticated ? (
            <button
              type="button"
              className="btn primary"
              onClick={() => handleNavigateDirect("/")}
              style={{ padding: "9px 18px", fontSize: "13px" }}
            >
              <Rocket size={15} /> Enter Dashboard →
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn primary"
                onClick={() => handleNavigateDirect("/login")}
                style={{ padding: "9px 16px", fontSize: "13px" }}
              >
                <LogIn size={15} /> Proceed to Login →
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={() => handleNavigateDirect("/signup")}
                style={{
                  padding: "9px 16px",
                  fontSize: "13px",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff"
                }}
              >
                <UserPlus size={15} /> Sign Up
              </button>
            </>
          )}

          <button
            type="button"
            className="btn"
            onClick={handleInstantDemo}
            style={{
              padding: "9px 16px",
              fontSize: "13px",
              background: "rgba(99, 102, 241, 0.2)",
              color: "#c7d2fe",
              border: "1px solid rgba(99, 102, 241, 0.4)"
            }}
          >
            <Sparkles size={14} /> Instant Demo
          </button>

          <button
            type="button"
            onClick={handleReplay}
            style={{
              color: "#94a3b8",
              fontSize: "12.5px",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "8px 14px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <RotateCcw size={13} /> Replay
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          fontSize: "11.5px",
          color: "#64748b",
          textAlign: "center"
        }}
      >
        © 2026 JOB AI • Front End Engineering-II Academic Project (Lectures 1–72)
      </div>
    </div>
  );
}
