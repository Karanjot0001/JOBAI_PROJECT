# JobAI — AI Resume Analyzer & Job Matcher (React + Vite Edition)

JobAI is a modern, responsive, and accessible AI career platform engineered in **React.js with Vite**. Originally built using vanilla HTML/CSS/JavaScript, this complete migration demonstrates the core concepts taught in **Front End Engineering-II (Lectures 1–72)** for academic evaluation and professional deployment.

---

## 🚀 Key Features

1. **Animated Website Loading Page (`/loading`)**: Ambient floating particles, glowing emblem, circular 0–100% progress counter, dynamic phase descriptions, and skip/replay/demo controls.
2. **Interactive Login Page (`/login`)**: Form validation, show/hide password visibility toggle, ⚡ instant 1-click demo login, autofill button, and remember-me persistence.
3. **Comprehensive Sign Up Page (`/signup`)**: Real-time password strength meter (Weak/Medium/Strong with color indicators), target career goal selector, terms agreement, and sample autofill.
4. **Dedicated Navigation Access**: Visible sidebar section (`AUTH & INTRO PAGES`) and Topbar profile menu providing immediate 1-click access to Loading Screen, Login Page, Sign Up Page, and Sign Out.
5. **Dashboard Analytics**: Real-time score rings (Resume Score, ATS Score, Jobs Matched, Profile Readiness), score breakdown, skill gap progress bars, top recommendations.
6. **AI Resume Analyzer**: Drag-and-drop file upload (PDF, DOCX, TXT) up to 5MB, keyword taxonomy matching, ATS scoring (0–100), gap identification, and text report export.
7. **Resume Builder**: Live two-way editing, multiple templates (Modern Tech & Classic Clean), and one-click styled **PDF export** via jsPDF.
8. **AI Job Matcher**: Real-time comparison between raw job descriptions and verified resume skills with multi-segment compatibility bars.
9. **Job Discovery & Search**: 20 preloaded tech positions, debounced search, multi-location filters, criteria sorting, bookmarking, and pagination.
10. **Application Pipeline Tracker**: Full **CRUD** tracking (Add, View, Edit Status, Remove), interactive status tabs, and notes.
11. **Technical Interview Preparation**: 8 technical tracks (Java, DSA, DBMS, OOP, SQL, OS, Networks, JavaScript) + open-ended answer recording mode with automated keyword evaluation.
12. **Skill Assessment & Certification**: 6 structured technical skill tests with live scoring, progress bars, and completion badges.
13. **Career Roadmap**: Interactive milestones timeline, dynamic progress calculation, and custom career goal modal editor.
14. **Settings & Profile Hub**: Complete personal information, career preferences, notification toggles, synchronized avatar initials, and secure session management.
15. **Functional Dark Mode**: CSS custom properties (`:root` / `.dark-mode`) toggleable across all components without screen flickering.
16. **Academic Evaluation Artifacts**: Includes `SYLLABUS_MAPPING.md` and `VIVA_GUIDE.md` for university presentation.

---

## 🛠️ Technology Stack

- **Framework**: React 18 / 19 (JSX, Functional Components)
- **Build Tool**: Vite
- **Routing**: React Router DOM v6 (Nested Routes, Protected Routes, 404 Catch-All)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `JobContext`, `ResumeContext`, `ToastContext`)
- **Styling**: Vanilla CSS3 (CSS Variables, Flexbox, CSS Grid, Mobile-First Media Queries)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Document Processing**: Mammoth.js (DOCX parsing)

---

## 💻 How to Run Locally

### 1. Navigate to the project directory
```bash
cd JOBAI_FINAL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` (or the URL shown in your terminal).

### 4. Build for production
```bash
npm run build
```

---

## 🎓 Academic Documents Included

- **`SYLLABUS_MAPPING.md`**: Maps each lecture topic (Lectures 1–72) directly to the corresponding React components and code examples.
- **`VIVA_GUIDE.md`**: 25+ essential viva questions, concise answers, and practical examiner demonstration tips.

---

## 👤 Default Demo Credentials
- **Email**: `sujal@example.com`
- **Password**: `password123`
*(A quick-fill button is also provided directly on the Login page for rapid demonstration).*
