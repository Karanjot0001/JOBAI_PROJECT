import { initialJobs } from "../data/jobsData";

/**
 * Simulated Asynchronous Job Service (REST API Simulation)
 * Syllabus Concept: Promises, async/await, setTimeout, Error Handling, Pagination, REST APIs
 * Demonstrates real-world asynchronous API interaction with loading states and retry capabilities.
 */
export const JobApiService = {
  /**
   * Fetches jobs with simulated network latency, search query, location filter, and pagination
   */
  async fetchJobs({ query = "", location = "All Locations", page = 1, pageSize = 6, simulateError = false } = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error("Network Error: Failed to reach remote job catalog server. Please retry."));
          return;
        }

        let filtered = [...initialJobs];

        if (query && query.trim()) {
          const q = query.toLowerCase().trim();
          filtered = filtered.filter(
            (j) =>
              j.title.toLowerCase().includes(q) ||
              j.company.toLowerCase().includes(q) ||
              j.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        }

        if (location && location !== "All Locations") {
          filtered = filtered.filter((j) => j.loc === location);
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / pageSize) || 1;
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const startIndex = (currentPage - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        resolve({
          items,
          pagination: {
            currentPage,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
          }
        });
      }, 400); // Realistic 400ms server response time
    });
  },

  /**
   * Fetches single job by ID
   */
  async getJobById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = initialJobs.find((j) => j.id === Number(id));
        if (found) {
          resolve(found);
        } else {
          reject(new Error(`Job with ID ${id} was not found.`));
        }
      }, 250);
    });
  }
};
