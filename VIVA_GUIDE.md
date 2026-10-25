# Front End Engineering-II — Viva & Practical Exam Guide

**Project Title**: JobAI — AI Resume Analyzer & Job Matcher  
**Target Audience**: 2nd Year B.Tech CSE Students  
**Subject**: Front End Engineering-II (React.js & Modern Web Development)  

---

## Part 1: Core React & Architecture Viva Questions

### Q1: What is the Virtual DOM, and how does React update the browser UI?
**Answer:**  
The Virtual DOM (VDOM) is a lightweight, in-memory JavaScript representation of the actual DOM tree. When state changes in a React component:
1. React creates a new Virtual DOM tree representing the updated UI.
2. It compares the new VDOM with the previous snapshot using a heuristic algorithm called **Reconciliation (Diffing)**.
3. React computes the minimal set of mutations needed and batches them into the real browser DOM in a single pass.  
**In JobAI:** When a user types in the search bar on `/job-search`, only the job list container updates; the sidebar, navbar, and filter controls remain untouched, preventing costly browser reflows.

---

### Q2: Why did you choose Context API instead of Redux Toolkit or Zustand?
**Answer:**  
For mid-sized applications like JobAI, the **Context API** (part of React core) provides a native, clean mechanism to share global data (e.g., authenticated user, active theme, saved jobs, notifications) without prop drilling.  
Introducing Redux would require unnecessary boilerplate (actions, reducers, store configuration, thunks) and external dependencies that fall outside the Front End Engineering-II curriculum scope.

---

### Q3: What is the difference between `useMemo` and `useCallback`?
**Answer:**  
- **`useMemo`** caches the **result of a calculation**. It recomputes only when its specified dependencies change.  
  *Example in JobAI:* In `JobSearch.jsx`, we wrap the multi-criteria search, location filter, skill filter, job type filter, and salary sorting logic inside `useMemo` so it doesn't re-filter on unrelated re-renders.
- **`useCallback`** caches a **function instance** itself across re-renders to prevent unnecessary child re-renders when passing functions as props.  
  *Example in JobAI:* In `AuthContext.jsx`, `login` and `signup` functions are wrapped in `useCallback`.

---

### Q4: Explain the difference between Controlled and Uncontrolled Components.
**Answer:**  
- **Controlled Component:** Form inputs whose values are bound to React state (`value={state}`) and updated through event handlers (`onChange={handleChange}`). React serves as the "single source of truth".  
  *Example in JobAI:* All forms in `Login.jsx`, `Signup.jsx`, `ResumeBuilder.jsx`, and Target Company Optimization.
- **Uncontrolled Component:** Form inputs where the DOM itself handles form data, accessed imperatively using a `useRef`.  
  *Example in JobAI:* The hidden file upload input `<input ref={fileInputRef} type="file" />` in `ResumeAnalyzer.jsx`.

---

### Q5: How did you fix the Initial Loading Screen to display on fresh tab launches without redirect loops?
**Answer:**  
We implemented an `InitialSessionGuard` component in `App.jsx` utilizing `sessionStorage`:
1. `sessionStorage` is tied strictly to the lifetime of the individual browser tab (unlike `localStorage` which persists indefinitely).
2. When the user opens JobAI in a new tab, `sessionStorage.getItem("jobai_session_loaded")` is `null`. The guard routes the browser to `/loading`.
3. In `Loading.jsx`, after the 2.5-second animation completes, we call `sessionStorage.setItem("jobai_session_loaded", "true")` and smoothly navigate the user to `/dashboard` (if authenticated) or `/login` (if unauthenticated).
4. On normal page refreshes or internal navigation within that tab, the flag is already present, so the loading screen is skipped, avoiding infinite redirect loops and blank screens.

---

### Q6: How does `ProtectedRoute` prevent unauthenticated access?
**Answer:**  
`ProtectedRoute.jsx` acts as a route guard wrapper:
1. It consumes `isAuthenticated` from `AuthContext`.
2. If `isAuthenticated` is true, it renders the protected children (`<AppLayout />` and nested pages).
3. If false, it uses React Router's `<Navigate to="/login" replace state={{ from: location }} />` to smoothly redirect the user without throwing runtime exceptions, preserving their intended destination.

---

### Q7: What is a Custom Hook, and which ones did you write in JobAI?
**Answer:**  
A custom hook is a reusable JavaScript function whose name begins with `use` and that can call other built-in React hooks (`useState`, `useEffect`, `useCallback`).  
In JobAI, we engineered three custom hooks:
1. **`useLocalStorage(key, initialValue)`**: Automatically synchronizes React state with browser `localStorage`.
2. **`useDebounce(value, delay)`**: Buffers rapidly changing values (like search keystrokes) to prevent performance lag.
3. **`useForm(initialValues, validateFn)`**: Manages controlled form inputs, change handlers, and validation errors.

---

### Q8: How does the 8-Point Resume Checklist work without an external AI API?
**Answer:**  
In `src/utils/resumeParser.js`, we built a deterministic parser:
1. It cleans and normalizes the extracted resume text.
2. It tests the text against specialized regular expressions and keyword taxonomies for 8 critical sections: Contact info, Professional Summary, Education, Technical Skills, Projects, Work Experience, Certifications, and Action Keywords.
3. It returns an array of objects containing `detected: boolean`, `detail: string`, and `recommendation: string`.
4. The `ResumeAnalyzer.jsx` component maps this array to render interactive status cards with badges and advice.

---

### Q9: How does the Target Company Resume Optimization feature work?
**Answer:**  
The `compareResumeWithJob(analysis, jdText)` function:
1. Extracts required tech keywords from the pasted job description using a dictionary of 70+ technology terms.
2. Uses an ES6 `Set` to deduplicate detected keywords.
3. Compares the JD keywords with skills detected in the user's resume using `filter` and `includes`.
4. Calculates a match percentage: `Math.round((matched.length / total) * 100)`.
5. Computes missing skills and provides actionable optimization suggestions.

---

### Q10: How did you fix the bug where updating an application in filtered tabs corrupted data?
**Answer:**  
Previously, application updates used the array index from the filtered view (`updateApplication(index)`). If a user was on the "Interview" tab and updated item #0, it inadvertently modified item #0 of the main array (which was a completely different application).  
**The Solution:** We updated `JobContext.jsx` and `Applications.jsx` to identify applications by a unique `id` (`app.id || Date.now()`). Functions `updateApplication(id, updates)` and `removeApplication(id)` now use `apps.map(a => a.id === id ? ...)` and `apps.filter(a => a.id !== id)`, ensuring data integrity regardless of active filter tabs.

---

### Q11: How did you implement dynamic lists and live preview in Resume Builder?
**Answer:**  
1. **Dynamic Lists:** We manage projects and work experience as arrays of objects in state. Adding an entry creates a new object using array spread (`[...formData.projects, { title: "", ... }]`). Removing an entry uses `filter((_, i) => i !== index)`.
2. **Live Preview:** As the user types into controlled inputs, the state updates in real-time. The right pane renders these state variables directly, styled to look like a physical sheet of paper.
3. **PDF Generation:** We use `jspdf` in `src/utils/pdfGenerator.js` to draw text, headings, and dividers directly onto a downloadable PDF canvas in the browser.

---

### Q12: How does the Salary Filter parse different salary formats for sorting?
**Answer:**  
In `JobSearch.jsx`, we built `parseAnnualSalary(salaryStr)`. It inspects salary strings using regex:
- If formatted in Indian Rupees (e.g. `₹8 - 14 LPA`), it extracts the numbers and computes the midpoint in Lakhs (`11`).
- If formatted in USD (e.g. `$90,000 - $120,000`), it extracts thousands and normalizes to an average number (`105`).
This numeric value is used in JavaScript's `.sort((a, b) => salaryB - salaryA)` for reliable ascending/descending sorting.

---

### Q13: How does JobAI achieve full dark mode support?
**Answer:**  
1. `src/styles/index.css` defines CSS Custom Properties for all background, card, text, and border colors under `:root` and `.dark-mode`.
2. `ThemeContext.jsx` manages `theme` state ('light' | 'dark') and synchronizes `.dark-mode` onto `document.body`.
3. When toggled, every component updates instantaneously without reloading the page or remounting components.

---

### Q14: How does JobAI support accessibility and reduced motion?
**Answer:**  
1. **Keyboard Accessibility:** Added `:focus-visible` styling in `index.css` with high-contrast outline rings for keyboard users.
2. **Reduced Motion:** Added `@media (prefers-reduced-motion: reduce)` in `index.css` which disables keyframe animations (`animation-duration: 0.01ms !important;`) and transitions for users with vestibular or motion sensitivities.

---

## Part 2: Quick Cheat-Sheet for Practical Demo

| Examiner Asks To See... | Navigate To | File to Open in Code |
|---|---|---|
| **Splash Loading Screen & Session Flow** | Open new browser tab to `http://localhost:5173/` | `src/App.jsx` & `src/pages/Loading.jsx` |
| **Form Validation** | `/signup` or `/login` | `src/pages/Signup.jsx` |
| **8-Point Resume Checklist** | `/resume-analyzer` | `src/utils/resumeParser.js` & `src/pages/ResumeAnalyzer.jsx` |
| **Target Company Matcher** | `/resume-analyzer` (bottom section) | `src/pages/ResumeAnalyzer.jsx` |
| **Resume Builder Live Preview** | `/resume-builder` | `src/pages/ResumeBuilder.jsx` & `src/utils/pdfGenerator.js` |
| **Search, Filters & Salary Sort** | `/job-search` | `src/pages/JobSearch.jsx` & `src/hooks/useDebounce.js` |
| **ID-Based CRUD Operations** | `/applications` | `src/pages/Applications.jsx` & `src/context/JobContext.jsx` |
| **Interactive Interview Stepper** | `/interview-practice` | `src/pages/InterviewPractice.jsx` |
| **Skill Assessment Breakdown** | `/skill-assessment` | `src/pages/SkillAssessment.jsx` |
| **Roadmap Persistence & Modal** | `/career-roadmap` | `src/pages/CareerRoadmap.jsx` |
| **Global State & Dark Mode** | Theme toggle in Topbar | `src/context/ThemeContext.jsx` & `src/styles/index.css` |
| **Route Protection** | Clear storage & visit `/settings` directly | `src/components/ProtectedRoute.jsx` |
