import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

const AUTH_USER_KEY = "jobai-user";
const AUTH_ACCOUNT_KEY = "jobai-account";
const GOAL_KEY = "jobai-goal";
const SETTINGS_KEY = "jobaiSettings";

/**
 * Authentication and Profile Context
 * Syllabus Concept: Context API, Custom Storage Synchronization, Form Validation, Controlled Auth State
 */
export function AuthProvider({ children }) {
  // Initialize user from localStorage (null if not logged in yet)
  const [user, setUser] = useState(() => {
    try {
      // Ensure demo account exists in storage for one-click testing
      if (!localStorage.getItem(AUTH_ACCOUNT_KEY)) {
        localStorage.setItem(AUTH_ACCOUNT_KEY, JSON.stringify({
          name: "Sujal Gupta",
          email: "sujal@example.com",
          password: "password123",
          goal: "Full Stack Developer"
        }));
      }

      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
      
      return null;
    } catch {
      return null;
    }
  });

  const [careerGoal, setCareerGoal] = useState(() => {
    try {
      return localStorage.getItem(GOAL_KEY) || "Full Stack Developer";
    } catch {
      return "Full Stack Developer";
    }
  });

  // Keep all profile keys strictly synchronized to fix the vanilla JS desync bug
  const syncProfile = useCallback((name, email, goal = careerGoal) => {
    const updatedUser = { name, email };
    setUser(updatedUser);
    setCareerGoal(goal);

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(GOAL_KEY, goal);

      // Sync account
      const existingAccount = JSON.parse(localStorage.getItem(AUTH_ACCOUNT_KEY) || "{}");
      localStorage.setItem(AUTH_ACCOUNT_KEY, JSON.stringify({
        ...existingAccount,
        name,
        email,
        goal
      }));

      // Sync settings
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        name,
        email,
        targetRole: goal
      }));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [careerGoal]);

  const login = useCallback((email, password) => {
    try {
      const accountRaw = localStorage.getItem(AUTH_ACCOUNT_KEY);
      if (!accountRaw) {
        return { success: false, message: "No account found. Please sign up first." };
      }
      const account = JSON.parse(accountRaw);

      if (email.toLowerCase().trim() !== account.email.toLowerCase().trim() || password !== account.password) {
        return { success: false, message: "Incorrect email or password." };
      }

      const activeUser = { name: account.name, email: account.email };
      setUser(activeUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(activeUser));
      if (account.goal) {
        setCareerGoal(account.goal);
        localStorage.setItem(GOAL_KEY, account.goal);
      }
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || "Login failed." };
    }
  }, []);

  const signup = useCallback((name, email, password, goal = "Full Stack Developer") => {
    try {
      const newAccount = { name, email, password, goal };
      localStorage.setItem(AUTH_ACCOUNT_KEY, JSON.stringify(newAccount));
      
      const activeUser = { name, email };
      setUser(activeUser);
      setCareerGoal(goal);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(activeUser));
      localStorage.setItem(GOAL_KEY, goal);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ name, email, targetRole: goal }));

      return { success: true };
    } catch (e) {
      return { success: false, message: e.message || "Signup failed." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }, []);

  const instantDemoLogin = useCallback(() => {
    const demoUser = { name: "Sujal Gupta", email: "sujal@example.com" };
    setUser(demoUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoUser));
    return { success: true, user: demoUser };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        careerGoal,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        instantDemoLogin,
        syncProfile,
        setCareerGoal: (newGoal) => {
          setCareerGoal(newGoal);
          localStorage.setItem(GOAL_KEY, newGoal);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
