import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext();

/**
 * Toast and Modal Notification Context
 * Syllabus Concept: Context API, useCallback, useRef, setTimeout & clearTimeout, State Lifting
 * Provides application-wide declarative toast messages and accessible modals without DOM hacks.
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [modal, setModal] = useState({ isOpen: false, title: "", content: null });
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "info", duration = 2500) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ show: true, message, type });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const openModal = useCallback((title, content) => {
    setModal({ isOpen: true, title, content });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, title: "", content: null });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast, modal, openModal, closeModal }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
