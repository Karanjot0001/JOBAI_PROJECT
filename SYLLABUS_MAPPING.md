# Front End Engineering-II (Lectures 1–72) — Syllabus Mapping Matrix

**Project Title**: JobAI — AI Resume Analyzer & Job Matcher  
**Framework**: React.js 18 with Vite  
**Target Level**: 2nd Year B.Tech Computer Science & Engineering (Front End Engineering-II)  
**Evaluation Scope**: Project Based Evaluation-I, Final Practical Examination & Viva Voce  

---

## 1. Overview & Architectural Principles

**JobAI** is a client-side single-page application (SPA) engineered specifically within the academic boundaries of the **Front End Engineering-II (Lectures 1–72)** syllabus.

All business logic—including resume text analysis, keyword matching, job filtering, application tracking, interview drills, and PDF synthesis—runs entirely within the client browser using standard web technologies:
- **HTML5**: Semantic document structure and accessibility standards.
- **CSS3**: Custom design tokens (CSS variables), Flexbox, CSS Grid, keyframe animations, and media queries (including reduced-motion).
- **JavaScript (ES6+)**: Functional programming, array transformations (`map`, `filter`, `reduce`), object destructuring, Set operations, Promises, and Web Storage APIs (`localStorage`, `sessionStorage`).
- **React.js**: Declarative UI, functional components, hooks (`useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`), custom hooks, Context API, and React Router v6.

> [!NOTE]
> **Strict Syllabus Compliance**: No prohibited frameworks, state libraries, or server backends (e.g. Next.js, Redux, TailwindCSS, Bootstrap, Express.js, MongoDB, Firebase, Python, or paid AI APIs) are utilized.

---

## 2. Comprehensive Syllabus Mapping Matrix

| Lecture Block | Syllabus Topic | File & Line Reference | Architectural Explanation | Practical Code Example from Project |
|---|---|---|---|---|
| **Lec 1–10** | **HTML5 Semantics & Accessibility** | `src/components/AppLayout.jsx`<br>`src/components/Sidebar.jsx`<br>`src/components/Modal.jsx` | Semantic landmark elements (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`), ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-live="polite"`), and keyboard accessibility (ESC modal dismissal, focus-visible outlines). | `<aside className="sidebar"><nav className="nav">...</nav></aside>` |
| **Lec 11–20** | **CSS3 Box Model, Flexbox & Grid** | `src/styles/index.css`<br>`src/pages/Dashboard.jsx`<br>`src/pages/JobSearch.jsx` | Mobile-first CSS architecture with CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(...))`) and Flexbox alignment without bulky UI libraries. | `.grid.four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }` |
| **Lec 15–22** | **CSS Variables, Transitions & Theme Switching** | `src/styles/index.css`<br>`src/context/ThemeContext.jsx` | `:root` design tokens with dynamic `.dark-mode` overrides synchronized to `document.body` and persisted in `localStorage`. | `:root { --primary: #683ce9; --bg-card: #ffffff; } body.dark-mode { --bg-card: #121826; }` |
| **Lec 21–24** | **CSS3 Keyframe Animations & Micro-interactions** | `src/styles/index.css`<br>`src/pages/Loading.jsx` | Custom `@keyframes` (`logoEntrance`, `fadeExit`, `floatParticle`, `pulse`) with `@media (prefers-reduced-motion: reduce)` accessibility compliance. | `@keyframes logoEntrance { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }` |
| **Lec 23–30** | **ES6+ Modern JavaScript Syntax** | `src/utils/resumeParser.js`<br>`src/utils/formatters.js` | Destructuring with defaults, template literals, arrow functions, rest/spread operators, and ES module exports/imports. | `const { name = "Candidate", role = "Developer", checklist = [] } = resumeData;` |
| **Lec 25–32** | **Array Methods (`map`, `filter`, `reduce`, `some`)** | `src/pages/JobSearch.jsx`<br>`src/utils/resumeParser.js`<br>`src/pages/ResumeBuilder.jsx` | Declarative transformations for searching, multi-criteria filtering, keyword intersection/difference, and salary sorting. | `const matchedSkills = analysis.detected.filter(s => lowerJd.includes(s.toLowerCase()));` |
| **Lec 31–38** | **React Fundamentals & Props Composition** | `src/components/JobCard.jsx`<br>`src/components/MetricRing.jsx`<br>`src/components/EmptyState.jsx` | Pure functional components receiving props, default parameters, children composition, and callback handlers. | `export default function JobCard({ job, onDetailsClick, onApplyClick }) { ... }` |
| **Lec 35–42** | **`useState` & Local State Management** | `src/pages/Applications.jsx`<br>`src/pages/InterviewPractice.jsx`<br>`src/pages/SkillAssessment.jsx` | Manages local UI state for question pagination, answers, modal toggling, filter states, and active tabs. | `const [currentQIndex, setCurrentQIndex] = useState(0); const [showAnswer, setShowAnswer] = useState(false);` |
| **Lec 39–46** | **Controlled Components & Forms** | `src/pages/Login.jsx`<br>`src/pages/Signup.jsx`<br>`src/pages/ResumeBuilder.jsx` | Two-way data binding with React state serving as the single source of truth, real-time validation, and dynamic array field additions/removals. | `<input value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} />` |
| **Lec 43–50** | **`useEffect` & Lifecycle Side-Effects** | `src/pages/Loading.jsx`<br>`src/components/Modal.jsx`<br>`src/context/ThemeContext.jsx` | Manages splash screen intervals with timer cleanup, window keyboard listeners, and document theme classes. | `useEffect(() => { const timer = setInterval(...); return () => clearInterval(timer); }, []);` |
| **Lec 47–54** | **`useRef` Hook for DOM & Mutable Refs** | `src/pages/ResumeAnalyzer.jsx`<br>`src/pages/Loading.jsx`<br>`src/context/ToastContext.jsx` | Direct DOM element triggering for file uploads and storing interval IDs across renders without triggering re-renders. | `const fileInputRef = useRef(null); ... fileInputRef.current.click();` |
| **Lec 51–58** | **`useMemo` & `useCallback` Optimization** | `src/pages/JobSearch.jsx`<br>`src/context/AuthContext.jsx` | Memoizes multi-parameter filtering/sorting pipelines and stabilizes authentication callback references. | `const filteredJobs = useMemo(() => { ... return result; }, [jobs, debouncedSearch, location, selectedSkill, jobType, sortBy]);` |
| **Lec 55–62** | **Custom React Hooks** | `src/hooks/useLocalStorage.js`<br>`src/hooks/useDebounce.js`<br>`src/hooks/useForm.js` | Modularizes stateful logic for local storage synchronization, keystroke buffering, and form handling. | `const debouncedSearch = useDebounce(searchTerm, 300);` |
| **Lec 59–66** | **Context API (Global State Trees)** | `src/context/AuthContext.jsx`<br>`src/context/JobContext.jsx`<br>`src/context/ResumeContext.jsx`<br>`src/context/ToastContext.jsx` | Shares user auth state, bookmark/application arrays, resume analysis, and toast alerts without prop drilling. | `const { user, isAuthenticated } = useAuth(); const { appliedJobs, addApplication } = useJobs();` |
| **Lec 63–68** | **React Router v6 & Navigation Guards** | `src/App.jsx`<br>`src/components/ProtectedRoute.jsx` | Client-side routing with `BrowserRouter`, `Routes`, `Route`, `Navigate`, `InitialSessionGuard` (sessionStorage-driven), and nested layouts. | `<Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />` |
| **Lec 65–72** | **Browser Storage (`localStorage` & `sessionStorage`)** | `src/App.jsx`<br>`src/context/JobContext.jsx`<br>`src/pages/CareerRoadmap.jsx` | `sessionStorage` tracks fresh tab launches; `localStorage` persists user profiles, applications, roadmap milestones, and test attempts. | `sessionStorage.getItem("jobai_session_loaded"); localStorage.setItem("jobai_roadmap_progress", JSON.stringify(completed));` |
| **Lec 67–72** | **Asynchronous Operations & Client Parsing** | `src/pages/ResumeAnalyzer.jsx`<br>`src/services/mockJobApi.js`<br>`src/utils/pdfGenerator.js` | Asynchronous file reading via `FileReader`, simulated API latency using Promises, and in-browser PDF generation using `jspdf`. | `const text = await extractTextFromFile(file); const result = analyzeResumeText(text, file.name);` |

---

## 3. Practical Implementation of Selected Features

### Feature 1: Initial Session Guard & Loading Screen Flow
- **Files**: [src/App.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/App.jsx), [src/pages/Loading.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/Loading.jsx), [src/components/ProtectedRoute.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/components/ProtectedRoute.jsx)
- **React Concepts**: Functional Components, `useState`, `useEffect`, `useRef`, React Router `useLocation`, `<Navigate />`.
- **JavaScript Concepts**: `sessionStorage` (`getItem`, `setItem`), `setInterval`, `clearInterval`, Object destructuring.
- **CSS Concepts**: `@keyframes logoEntrance`, `@keyframes fadeExit`, gradient backgrounds, backdrop blur, CSS variables.
- **How it Works**: 
  When a user opens JobAI in a fresh browser tab, `sessionStorage.getItem("jobai_session_loaded")` evaluates to null. The top-level `InitialSessionGuard` immediately redirects the browser to `/loading`. `Loading.jsx` mounts an animated splash sequence that increments progress from 0% to 100% over 2.2–2.5 seconds, rotating 5 career status messages. Upon completion, `sessionStorage.setItem("jobai_session_loaded", "true")` is set, and the user is routed to `/dashboard` (if authenticated) or `/login` (if unauthenticated). Same-tab page reloads and internal navigation retain the session flag, preventing unwanted re-triggers.
- **Viva Explanation**:
  *"We solved the initial splash screen requirement by placing an `InitialSessionGuard` at the router root. It uses `sessionStorage` because session storage exists only for the lifetime of that specific browser tab. A fresh tab has no flag, so it shows `/loading`. Once finished, the flag is marked, allowing subsequent page navigations and refreshes to render directly without flashing the splash screen."*

---

### Feature 2: 8-Point Resume Improvement Checklist
- **Files**: [src/utils/resumeParser.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/utils/resumeParser.js), [src/pages/ResumeAnalyzer.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/ResumeAnalyzer.jsx), [src/context/ResumeContext.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/context/ResumeContext.jsx)
- **React Concepts**: Context API (`useResume`), Conditional Rendering (`{item.detected ? ... : ...}`), Component Props.
- **JavaScript Concepts**: Regular Expressions (`RegExp`), Array methods (`map`, `filter`, `some`), String methods (`toLowerCase`, `includes`), Objects.
- **CSS Concepts**: Flexbox badges, status colors (`--success`, `--warning`), CSS Grid 2-column layout.
- **How it Works**:
  The `generateResumeChecklist` function evaluates extracted resume text against 8 critical sections: Contact Information, Professional Summary, Education, Technical Skills, Projects, Work Experience, Certifications, and Action Keywords. Each category produces an object with `detected: boolean`, `detail: string`, and `recommendation: string`. The UI displays a card grid showing green "Detected" or amber "Needs Attention" badges alongside actionable feedback.
- **Viva Explanation**:
  *"Rather than relying on closed-source external AI APIs, we built a deterministic resume auditor in `resumeParser.js`. It utilizes targeted regex patterns and keyword taxonomies to detect vital resume sections, outputting an 8-item array that our React component maps into interactive status cards."*

---

### Feature 3: Target Company Resume Optimization
- **Files**: [src/pages/ResumeAnalyzer.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/ResumeAnalyzer.jsx), [src/utils/resumeParser.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/utils/resumeParser.js)
- **React Concepts**: Controlled form inputs (`useState`), conditional rendering, event handlers (`onSubmit`, `onChange`).
- **JavaScript Concepts**: ES6 `Set` for deduplication, array intersection/difference (`filter`), regex word boundary extraction, match percentage calculation.
- **CSS Concepts**: Card layouts, badge wrappers, scrollable tags, input fields.
- **How it Works**:
  Users input a target company name, desired role, and paste a job description. The `compareResumeWithJob` utility scans the JD against a known 70+ technology keyword dictionary, compares found keywords against skills detected in the user's resume, computes a match ratio (`(matched / total) * 100`), lists missing high-priority keywords, and generates customized optimization suggestions.
- **Viva Explanation**:
  *"This feature compares the user's parsed skills with job description requirements using client-side Set operations. It calculates an estimated match score and highlights missing keywords so candidates can tailor their resumes before applying."*

---

### Feature 4: Resume Builder Live Preview & Dynamic Lists
- **Files**: [src/pages/ResumeBuilder.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/ResumeBuilder.jsx), [src/utils/pdfGenerator.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/utils/pdfGenerator.js)
- **React Concepts**: Complex state object handling, dynamic array state manipulation (add/remove items), controlled form inputs.
- **JavaScript Concepts**: Spread operator (`[...items, newItem]`), `filter` for removal by index/id, dynamic key property updates (`[field]: value`).
- **CSS Concepts**: Split two-column flex layout, sticky preview pane, paper elevation shadow, print media styling.
- **How it Works**:
  The form supports dynamic arrays for Projects, Experience entries, and Skill tags. Users can add new project cards, edit title/description/tech stack fields, or remove items. The right pane renders a live paper preview that updates instantaneously as the user types. The completeness meter dynamically calculates filled fields (0–100%). Clicking "Download PDF" calls `exportResumeToPdf` using `jspdf`.
- **Viva Explanation**:
  *"We implemented immutable state updates using the spread operator to allow users to dynamically add and remove experience and project entries. The split screen pairs controlled input forms with a live preview that reacts instantly to state changes."*

---

### Feature 5: Multi-Criteria Job Search & Salary Sorting
- **Files**: [src/pages/JobSearch.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/JobSearch.jsx), [src/hooks/useDebounce.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/hooks/useDebounce.js)
- **React Concepts**: `useMemo`, `useState`, Custom Hook (`useDebounce`), controlled select dropdowns.
- **JavaScript Concepts**: Regex parsing (`match`), numeric conversion, string normalization, chained array `filter` and `sort`.
- **CSS Concepts**: Filter pill bars, responsive grid, card hover transitions.
- **How it Works**:
  Search inputs are debounced by 300ms. The filtering pipeline in `useMemo` applies simultaneous filters: title/company query match, location dropdown, skill tag dropdown, and job type (Full Time / Internship). The salary sorter uses regex to parse salary strings (e.g. `₹8 - 14 LPA` or `$90,000 - $120,000`) into normalized numeric values for accurate ascending and descending sorting.
- **Viva Explanation**:
  *"To maintain high frontend performance, search terms pass through a `useDebounce` hook. The search, filter, and salary-sort pipeline runs inside a `useMemo` hook, guaranteeing the 20+ item array is only recomputed when filter dependencies change."*

---

### Feature 6: Application Tracker ID-Based CRUD & Duplicate Prevention
- **Files**: [src/pages/Applications.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/Applications.jsx), [src/context/JobContext.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/context/JobContext.jsx)
- **React Concepts**: Context API (`useJobs`), `useState`, Modal dialogs, Tab state.
- **JavaScript Concepts**: Unique identifiers (`Date.now()`), array `find`, `filter`, `map`, `localStorage` JSON serialization.
- **CSS Concepts**: Status badge styling, modal overlays, tab counters.
- **How it Works**:
  Each job application is created with a persistent unique `id`. In `JobContext.jsx`, `updateApplication` and `removeApplication` look up records by `id` rather than filtered array indices, preventing data corruption when filters are active. Applying for a previously tracked job triggers an alert and prevents duplicate entries.
- **Viva Explanation**:
  *"Previously, applications were updated using array indices, which broke when viewing filtered tabs. We upgraded the CRUD architecture to use unique item IDs, ensuring updates and removals target the exact intended record regardless of active filter tabs."*

---

### Feature 7: Interactive Interview Practice Stepper
- **Files**: [src/pages/InterviewPractice.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/InterviewPractice.jsx), [src/data/interviewQuestions.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/data/interviewQuestions.js)
- **React Concepts**: Pagination state, toggle state, category filtering, progress indicator.
- **JavaScript Concepts**: Array slicing, modulo navigation, count calculations.
- **CSS Concepts**: Glassmorphism cards, expandable answer containers, animated transitions.
- **How it Works**:
  Allows candidates to step through interview questions one at a time with Previous/Next controls. Users can toggle visibility of model answers and key talking points, switch between categories (Frontend, React, JavaScript, System Design), and view a completion summary screen once all questions in a drill are reviewed.
- **Viva Explanation**:
  *"The interview prep page uses React state (`currentQIndex` and `showAnswer`) to deliver an interactive flashcard experience. It tracks completion progress and provides a category filter without reloading the page."*

---

### Feature 8: Skill Assessment Breakdown & Attempt History
- **Files**: [src/pages/SkillAssessment.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/SkillAssessment.jsx), [src/data/skillAssessmentData.js](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/data/skillAssessmentData.js)
- **React Concepts**: Quiz navigation state, conditional result screens, attempt history mapping.
- **JavaScript Concepts**: Score calculation (`reduce`), `localStorage` object persistence, `Date` formatting.
- **CSS Concepts**: Option selection highlights, result metric cards, progress bars.
- **How it Works**:
  Presents a timed technical assessment. Upon finishing, it displays an itemized question breakdown highlighting user answers versus correct answers with explanations. The final score is recorded in `localStorage` under `jobai_assessment_history`, enabling users to review previous test attempts and track performance improvement over time.
- **Viva Explanation**:
  *"The quiz engine evaluates answers in real-time, stores timestamped scores in `localStorage`, and displays a detailed question-by-question breakdown so students can identify knowledge gaps."*

---

### Feature 9: Career Roadmap Milestone Persistence
- **Files**: [src/pages/CareerRoadmap.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/pages/CareerRoadmap.jsx), [src/components/Modal.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/components/Modal.jsx)
- **React Concepts**: `useState`, `useEffect`, Modal dialogs for destructive actions.
- **JavaScript Concepts**: Set/Array membership checks (`includes`), `localStorage` persistence, percentage calculation.
- **CSS Concepts**: Timeline nodes, completion checkmarks, progress bars.
- **How it Works**:
  Users check off completed career roadmap milestones (e.g., HTML/CSS basics, React fundamentals, Fullstack integration). The completion percentage updates automatically (`(completed / total) * 100`). Progress is saved to `jobai_roadmap_progress` in `localStorage`. A "Reset Progress" button opens a confirmation modal before clearing milestones.
- **Viva Explanation**:
  *"The career roadmap turns static milestone data into an interactive checklist. Milestone IDs are stored in `localStorage`, computing real-time completion percentages that persist across browser restarts."*

---

### Feature 10: Unified Feedback System & Empty States
- **Files**: [src/context/ToastContext.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/context/ToastContext.jsx), [src/components/Toast.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/components/Toast.jsx), [src/components/EmptyState.jsx](file:///c:/Users/Lenovo/OneDrive/Desktop/JOBAI_FINAL/src/components/EmptyState.jsx)
- **React Concepts**: Context API, portal-like fixed overlays, timeout lifecycle cleanup.
- **JavaScript Concepts**: `setTimeout`, `clearTimeout`, array filtering for toast removal.
- **CSS Concepts**: Floating toasts, slide-in keyframe animations, empty state graphics.
- **How it Works**:
  Every primary user action (saving a job, submitting an application, downloading a resume, resetting progress) dispatches a toast notification via `useToast()`. When lists are empty (e.g. no saved jobs, zero search matches), custom `EmptyState` components display clear calls to action rather than blank screens.
- **Viva Explanation**:
  *"We centralized feedback through a global `ToastContext`. When triggered, toasts auto-dismiss after 3.5 seconds using managed timeouts. Contextual empty states ensure the user always has clear guidance on what action to take next."*

---

## 4. Verification & Academic Defense Checklist

- [x] **Zero Prohibited Dependencies**: No Redux, Next.js, Tailwind, Bootstrap, MongoDB, Firebase, or external AI APIs.
- [x] **100% Client-Side Architecture**: Complete functionality operates in the browser via React, Vite, and Web APIs.
- [x] **Full Production Build Verification**: `npm run build` generates optimized chunks in under 1.5 seconds.
- [x] **Zero Lint Errors**: `npm run lint` passes with 0 syntax or compiler errors.
- [x] **Accessibility Compliance**: Semantic HTML5, `:focus-visible` styling, ARIA roles, and `@media (prefers-reduced-motion)`.
