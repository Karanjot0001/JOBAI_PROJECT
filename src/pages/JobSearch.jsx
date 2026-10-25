import React, { useState, useMemo } from "react";
import { useJobs } from "../context/JobContext";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";
import { Search, MapPin, SlidersHorizontal, Briefcase, Code, Filter, X } from "lucide-react";

/**
 * Job Search Page
 * Syllabus Concepts Covered:
 * - Array methods (filter, sort, slice, map)
 * - useMemo (memoizing multi-criteria filtering pipeline)
 * - Custom Hook (useDebounce keystroke buffer)
 * - Controlled Form Elements (inputs, select dropdowns)
 * - Client-side Pagination
 * - Meaningful Empty States
 */
export default function JobSearch() {
  const { jobs, applyToJob } = useJobs();
  const { openModal } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("match"); // "match", "salaryHigh", "title", "company"
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Custom hook: debounces search input by 300ms
  const debouncedSearch = useDebounce(searchTerm, 300);

  const locations = [
    "All Locations",
    "Chandigarh",
    "Mohali",
    "Bengaluru",
    "Remote",
    "Gurugram",
    "Pune",
    "Mumbai",
    "Hyderabad",
    "Noida",
    "Chennai"
  ];

  const jobTypes = ["All Types", "Full Time", "Internship"];

  // Extract all unique skills across available jobs
  const availableSkills = useMemo(() => {
    const skillSet = new Set();
    jobs.forEach((j) => {
      if (Array.isArray(j.tags)) {
        j.tags.forEach((tag) => skillSet.add(tag));
      }
    });
    return ["All Skills", ...Array.from(skillSet).sort()];
  }, [jobs]);

  // Robust salary parser for sorting
  const parseSalaryAnnual = (salaryStr = "") => {
    if (!salaryStr) return 0;
    // Match LPA format: e.g. "₹4.5 - 6.5 LPA"
    const lpaMatch = salaryStr.match(/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*LPA/i);
    if (lpaMatch) {
      const highVal = lpaMatch[2] ? parseFloat(lpaMatch[2]) : parseFloat(lpaMatch[1]);
      return highVal * 100000;
    }
    // Match monthly stipend format: e.g. "₹25,000 / month"
    const monthMatch = salaryStr.match(/₹?\s*([\d,]+)\s*\/\s*month/i);
    if (monthMatch) {
      const val = parseInt(monthMatch[1].replace(/,/g, ""), 10);
      return val * 12;
    }
    return 0;
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("All Locations");
    setSelectedSkill("All Skills");
    setSelectedType("All Types");
    setSortBy("match");
    setCurrentPage(1);
  };

  const isFilteringActive =
    Boolean(searchTerm.trim()) ||
    selectedLocation !== "All Locations" ||
    selectedSkill !== "All Skills" ||
    selectedType !== "All Types" ||
    sortBy !== "match";

  // Memoized filter and sort pipeline
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Search query filter (matches title, company, or tags)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.tags && j.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    // Location filter
    if (selectedLocation !== "All Locations") {
      result = result.filter((j) => j.loc === selectedLocation);
    }

    // Required Skill filter
    if (selectedSkill !== "All Skills") {
      result = result.filter(
        (j) => j.tags && j.tags.some((tag) => tag.toLowerCase() === selectedSkill.toLowerCase())
      );
    }

    // Job Type filter
    if (selectedType !== "All Types") {
      result = result.filter((j) => j.type === selectedType);
    }

    // Multi-criteria sorting
    if (sortBy === "match") {
      result.sort((a, b) => b.match - a.match);
    } else if (sortBy === "salaryHigh") {
      result.sort((a, b) => parseSalaryAnnual(b.salary) - parseSalaryAnnual(a.salary));
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "company") {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }

    return result;
  }, [jobs, debouncedSearch, selectedLocation, selectedSkill, selectedType, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedJobs.slice(start, start + pageSize);
  }, [filteredAndSortedJobs, currentPage, pageSize]);

  const handleOpenDetails = (job) => {
    openModal(
      job.title,
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            borderBottom: "1px solid var(--border-card)",
            paddingBottom: "10px"
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>{job.company}</h3>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {job.loc} • {job.type}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>
              {job.salary}
            </span>
            <div style={{ fontSize: "12px", color: "var(--success)", fontWeight: 600 }}>
              {job.match}% Profile Match
            </div>
          </div>
        </div>

        <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text-main)", marginBottom: "16px" }}>
          {job.description}
        </p>

        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>Key Requirements:</strong>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: 1.6, color: "var(--text-muted)" }}>
            {job.requirements && job.requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong style={{ fontSize: "13px", display: "block", marginBottom: "6px" }}>Required Tech Stack:</strong>
          <div className="chips">
            {job.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn primary"
          style={{ width: "100%", padding: "12px" }}
          onClick={() => applyToJob(job)}
        >
          Apply for this Position
        </button>
      </div>
    );
  };

  return (
    <div className="job-search-page">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Job Search & Career Opportunities</h1>
          <p>Explore {jobs.length} verified developer, software engineering, and cloud roles matched to your profile.</p>
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="card" style={{ marginBottom: "20px" }}>
        {/* Row 1: Search, Location, Skill Filter */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
          {/* Search query input */}
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <input
              type="search"
              placeholder="Search by role, company, or skill..."
              style={{ paddingLeft: "36px" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Location filter */}
          <div style={{ position: "relative" }}>
            <MapPin
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <select
              style={{ paddingLeft: "36px" }}
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <Code
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <select
              style={{ paddingLeft: "36px" }}
              value={selectedSkill}
              onChange={(e) => {
                setSelectedSkill(e.target.value);
                setCurrentPage(1);
              }}
            >
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Job Type, Sorting, Clear Filters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto", gap: "12px", alignItems: "center" }}>
          {/* Job Type Filter */}
          <div style={{ position: "relative" }}>
            <Filter
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <select
              style={{ paddingLeft: "36px" }}
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div style={{ position: "relative" }}>
            <SlidersHorizontal
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            />
            <select
              style={{ paddingLeft: "36px" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">Sort by: Highest Match</option>
              <option value="salaryHigh">Sort by: Salary (High to Low)</option>
              <option value="title">Sort by: Job Title (A-Z)</option>
              <option value="company">Sort by: Company (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFilteringActive && (
            <button
              type="button"
              className="btn outline"
              onClick={handleClearFilters}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "12.5px" }}
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Filter Summary Counter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "14px",
            fontSize: "12.5px",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border-card)",
            paddingTop: "10px"
          }}
        >
          <span>
            Showing <strong>{filteredAndSortedJobs.length}</strong> matching role(s)
            {selectedLocation !== "All Locations" && ` in ${selectedLocation}`}
            {selectedSkill !== "All Skills" && ` requiring ${selectedSkill}`}
            {selectedType !== "All Types" && ` (${selectedType})`}
          </span>

          {isFilteringActive && (
            <button type="button" className="link" onClick={handleClearFilters}>
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* ================= JOB LIST ================= */}
      {paginatedJobs.length > 0 ? (
        <div className="list">
          {paginatedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDetailsClick={handleOpenDetails}
              onApplyClick={applyToJob}
            />
          ))}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
          <Briefcase size={44} style={{ opacity: 0.25, marginBottom: "12px", color: "var(--primary)" }} />
          <h3 style={{ margin: "0 0 8px 0" }}>No matching jobs found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13.5px", margin: "0 0 20px 0", maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
            No listings currently match your combined search criteria. Try choosing &quot;All Skills&quot;, &quot;All Locations&quot;, or clearing the keyword query.
          </p>
          <button type="button" className="btn primary" onClick={handleClearFilters}>
            Clear All Filters & Show All {jobs.length} Jobs
          </button>
        </div>
      )}
    </div>
  );
}
