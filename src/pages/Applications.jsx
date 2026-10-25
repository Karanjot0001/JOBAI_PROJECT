import React, { useState } from "react";
import { useJobs } from "../context/JobContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import { formatDate } from "../utils/formatters";
import { Plus, Trash2, Edit2, Briefcase, Calendar, MapPin } from "lucide-react";

const getEmptyFormState = () => ({
  company: "",
  role: "",
  loc: "Remote",
  status: "Applied",
  date: formatDate(new Date()),
  notes: ""
});

/**
 * Applications Page
 * Syllabus Concepts Covered:
 * - Full CRUD Operations (Create, Read, Update, Delete)
 * - Array Immutability (spread, filter, map)
 * - Controlled Forms in Modals
 * - Tab Filtering with dynamic counts
 * - LocalStorage Persistence via JobContext
 */
export default function Applications() {
  const { applications, addApplication, updateApplication, removeApplication } = useJobs();
  const { showToast } = useToast();

  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formState, setFormState] = useState(getEmptyFormState);

  const statusOptions = ["Applied", "Interviewing", "Offered", "Rejected"];

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormState(getEmptyFormState());
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingId(app.id);
    setFormState({
      company: app.company,
      role: app.role,
      loc: app.loc,
      status: app.status,
      date: app.date,
      notes: app.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.company.trim() || !formState.role.trim()) {
      showToast("Company name and Job role are required.", "warning");
      return;
    }

    if (editingId) {
      updateApplication(editingId, formState);
    } else {
      // Check for duplicate application
      const isDuplicate = applications.some(
        (a) =>
          a.company.toLowerCase().trim() === formState.company.toLowerCase().trim() &&
          a.role.toLowerCase().trim() === formState.role.toLowerCase().trim()
      );
      if (isDuplicate) {
        showToast(`You already have an active application for ${formState.role} at ${formState.company}.`, "warning");
        return;
      }
      addApplication(formState);
    }

    setIsModalOpen(false);
  };

  // Filter applications by active tab
  const filteredApps =
    filterStatus === "All"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  // Dynamic application counts
  const statusCounts = {
    All: applications.length,
    Applied: applications.filter((a) => a.status === "Applied").length,
    Interviewing: applications.filter((a) => a.status === "Interviewing").length,
    Offered: applications.filter((a) => a.status === "Offered").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length
  };

  return (
    <div className="applications-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Job Application Tracker</h1>
          <p>Organize, monitor, and update your recruitment pipeline from initial application to interviews and offers.</p>
        </div>

        <div className="page-actions">
          <button type="button" className="btn primary" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add Application
          </button>
        </div>
      </div>

      {/* ================= STATUS TABS & METRICS ================= */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        {["All", ...statusOptions].map((status) => {
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              type="button"
              className={`btn ${isActive ? "primary" : "outline"}`}
              style={{ padding: "7px 14px", fontSize: "13px" }}
              onClick={() => setFilterStatus(status)}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          );
        })}
      </div>

      {/* ================= APPLICATIONS TABLE ================= */}
      <div className="card" style={{ padding: "8px" }}>
        {filteredApps.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Personal Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>
                          {app.company}
                        </strong>
                        <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                          {app.role}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
                        <MapPin size={13} color="var(--text-muted)" /> {app.loc}
                      </span>
                    </td>

                    <td>
                      {/* Fast inline status switcher */}
                      <select
                        value={app.status}
                        onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                        className={`status ${app.status}`}
                        style={{
                          border: "none",
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: "4px"
                        }}
                        title="Change status"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                        <Calendar size={13} color="var(--text-muted)" /> {app.date}
                      </span>
                    </td>

                    <td style={{ maxWidth: "220px" }}>
                      {app.notes ? (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                          {app.notes}
                        </span>
                      ) : (
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)", opacity: 0.6, fontStyle: "italic" }}>
                          No notes added
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          className="link"
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12.5px" }}
                          onClick={() => handleOpenEditModal(app)}
                          title="Edit application details"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="link"
                          style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "4px", fontSize: "12.5px" }}
                          onClick={() => removeApplication(app.id)}
                          title="Remove application"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <Briefcase size={40} style={{ opacity: 0.25, marginBottom: "12px", color: "var(--primary)" }} />
            <h3 style={{ margin: "0 0 6px 0" }}>No applications found</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 16px 0" }}>
              {filterStatus === "All"
                ? "Start applying from the Job Search page or manually track your external applications here."
                : `No applications are currently marked as "${filterStatus}".`}
            </p>
            <button type="button" className="btn primary" onClick={handleOpenAddModal}>
              <Plus size={14} /> Add Application
            </button>
          </div>
        )}
      </div>

      {/* ================= ADD / EDIT APPLICATION MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Job Application" : "Track New Job Application"}
      >
        <form onSubmit={handleSubmit} className="form">
          <InputField
            label="Company Name *"
            name="company"
            placeholder="e.g. Google, Microsoft, TCS, Infosys"
            value={formState.company}
            onChange={(e) => setFormState({ ...formState, company: e.target.value })}
            required
          />

          <InputField
            label="Job Role / Title *"
            name="role"
            placeholder="e.g. Full Stack Developer, Software Engineer"
            value={formState.role}
            onChange={(e) => setFormState({ ...formState, role: e.target.value })}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <InputField
              label="Location"
              name="loc"
              placeholder="e.g. Bengaluru, Remote, Chandigarh"
              value={formState.loc}
              onChange={(e) => setFormState({ ...formState, loc: e.target.value })}
            />

            <InputField
              label="Application Status"
              name="status"
              as="select"
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              options={statusOptions}
            />
          </div>

          <InputField
            label="Application Date"
            name="date"
            placeholder="e.g. 24 Oct 2026"
            value={formState.date}
            onChange={(e) => setFormState({ ...formState, date: e.target.value })}
          />

          <InputField
            label="Personal Notes / Interview Timeline (Optional)"
            name="notes"
            as="textarea"
            rows={3}
            placeholder="e.g. Round 1 coding interview scheduled for Tuesday. Revisit DSA trees..."
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="btn outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {editingId ? "Save Changes" : "Save Application"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
