import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Modal from "./Modal";
import Toast from "./Toast";
import { useToast } from "../context/ToastContext";

/**
 * AppLayout Wrapper Component
 * Syllabus Concept: Component Composition, Nested Routing (Outlet), Lifting State Up
 */
export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { modal, closeModal } = useToast();

  return (
    <div className="app">
      {/* Sidebar with mobile drawer toggle */}
      <Sidebar isOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <main className="main">
        <Navbar onMobileToggle={() => setMobileOpen((prev) => !prev)} />
        <Outlet />
      </main>

      {/* Application-Wide Modal Dialog */}
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        {modal.content}
      </Modal>

      {/* Application-Wide Toast Notifications */}
      <Toast />
    </div>
  );
}
