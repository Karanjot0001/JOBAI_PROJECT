/* ---------- JobAI Frontend Authentication ---------- */

const AUTH_KEY = "jobai-user";
const PUBLIC_PAGES = ["login.html", "signup.html"];


function currentUser() {
    try {
        return JSON.parse(
            localStorage.getItem(AUTH_KEY) || "null"
        );
    } catch {
        return null;
    }
}


function requireLogin() {

    const page =
        location.pathname.split("/").pop() || "index.html";

    if (!PUBLIC_PAGES.includes(page) && !currentUser()) {
        location.href = "login.html";
        return false;
    }

    return true;
}


function updateUserUI() {

    const u = currentUser();

    if (!u) return;

    document.querySelectorAll("[data-user-name]")
        .forEach(e => e.textContent = u.name);

    document.querySelectorAll("[data-user-email]")
        .forEach(e => e.textContent = u.email);

    document.querySelectorAll("[data-user-initials]")
        .forEach(e => {

            e.textContent = u.name
                .split(/\s+/)
                .map(x => x[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

        });
}


function logoutUser() {

    localStorage.removeItem(AUTH_KEY);

    toast("Logged out successfully");

    setTimeout(
        () => location.href = "login.html",
        500
    );
}


if (!requireLogin()) {
    throw new Error("Redirecting to login");
}


const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);


function toast(msg) {

    const t = qs("#toast");

    if (!t) return;

    t.textContent = msg;

    t.classList.add("show");

    clearTimeout(window.__t);

    window.__t = setTimeout(
        () => t.classList.remove("show"),
        2300
    );
}


function modal(title, body) {

    const bg = qs("#modalBg");

    if (!bg) return;

    qs("#modal").innerHTML = `
        <button class="close" onclick="closeModal()">×</button>
        <h2>${title}</h2>
        ${body}
    `;

    bg.classList.add("show");
}


function closeModal() {

    qs("#modalBg")?.classList.remove("show");
}


/* ---------- Theme ---------- */

function setupTheme() {

    const b = qs("#themeBtn");

    let dark =
        localStorage.getItem("jobai-theme") === "dark";

    document.body.classList.toggle(
        "dark-mode",
        dark
    );

    b?.classList.toggle("dark", dark);


    b?.addEventListener("click", () => {

        dark = !dark;

        document.body.classList.toggle(
            "dark-mode",
            dark
        );

        b.classList.toggle("dark", dark);

        localStorage.setItem(
            "jobai-theme",
            dark ? "dark" : "light"
        );

        toast(
            dark
                ? "Dark mode enabled"
                : "Light mode enabled"
        );

    });
}

setupTheme();


/* ---------- Jobs ---------- */

const jobs = [

    {
        id: 1,
        title: "Software Developer",
        company: "Tech Mahindra",
        loc: "Chandigarh",
        match: 94,
        tags: ["Java", "SQL", "Spring Boot", "Git"]
    },

    {
        id: 2,
        title: "Frontend Developer",
        company: "InfoBeans",
        loc: "Mohali",
        match: 86,
        tags: ["HTML", "CSS", "JavaScript", "React"]
    },

    {
        id: 3,
        title: "Backend Developer",
        company: "TCS",
        loc: "Chandigarh",
        match: 82,
        tags: ["Java", "SQL", "REST APIs", "Git"]
    },

    {
        id: 4,
        title: "AI/ML Intern",
        company: "InnovateAI",
        loc: "Remote",
        match: 79,
        tags: ["Python", "ML", "SQL", "Git"]
    },

    {
        id: 5,
        title: "Full Stack Developer",
        company: "CodeCraft",
        loc: "Bengaluru",
        match: 76,
        tags: [
            "JavaScript",
            "React",
            "Node.js",
            "MongoDB"
        ]
    },

    {
        id: 6,
        title: "Data Analyst",
        company: "Deloitte",
        loc: "Gurugram",
        match: 88,
        tags: ["Python", "SQL", "Excel", "Power BI"]
    },

    {
        id: 7,
        title: "Java Developer",
        company: "Cognizant",
        loc: "Pune",
        match: 91,
        tags: ["Java", "Spring Boot", "SQL", "Git"]
    },

    {
        id: 8,
        title: "Python Developer",
        company: "Wipro",
        loc: "Bengaluru",
        match: 87,
        tags: ["Python", "Django", "SQL", "REST APIs"]
    },

    {
        id: 9,
        title: "Machine Learning Engineer",
        company: "Fractal Analytics",
        loc: "Mumbai",
        match: 84,
        tags: ["Python", "Machine Learning", "TensorFlow", "SQL"]
    },

    {
        id: 10,
        title: "Cloud Engineer",
        company: "Accenture",
        loc: "Hyderabad",
        match: 81,
        tags: ["AWS", "Linux", "Docker", "Cloud"]
    },

    {
        id: 11,
        title: "DevOps Engineer",
        company: "HCLTech",
        loc: "Noida",
        match: 78,
        tags: ["Linux", "Docker", "Kubernetes", "AWS"]
    },

    {
        id: 12,
        title: "React Developer",
        company: "Persistent Systems",
        loc: "Pune",
        match: 89,
        tags: ["JavaScript", "React", "HTML", "CSS"]
    },

    {
        id: 13,
        title: "Software Engineer Intern",
        company: "Microsoft",
        loc: "Bengaluru",
        match: 85,
        tags: ["Java", "Python", "DSA", "Git"]
    },

    {
        id: 14,
        title: "Data Scientist",
        company: "Mu Sigma",
        loc: "Bengaluru",
        match: 80,
        tags: ["Python", "SQL", "Machine Learning", "Statistics"]
    },

    {
        id: 15,
        title: "Android Developer",
        company: "Samsung",
        loc: "Noida",
        match: 77,
        tags: ["Java", "Kotlin", "Android", "Git"]
    },

    {
        id: 16,
        title: "Cybersecurity Analyst",
        company: "IBM",
        loc: "Bengaluru",
        match: 75,
        tags: ["Linux", "Networking", "Cybersecurity", "Python"]
    },

    {
        id: 17,
        title: "Database Developer",
        company: "Oracle",
        loc: "Hyderabad",
        match: 83,
        tags: ["SQL", "PL/SQL", "Oracle", "Database"]
    },

    {
        id: 18,
        title: "QA Engineer",
        company: "Capgemini",
        loc: "Pune",
        match: 74,
        tags: ["Testing", "Java", "Selenium", "SQL"]
    },

    {
        id: 19,
        title: "Node.js Developer",
        company: "Freshworks",
        loc: "Chennai",
        match: 82,
        tags: ["JavaScript", "Node.js", "Express", "MongoDB"]
    },

    {
        id: 20,
        title: "UI/UX Developer",
        company: "Adobe",
        loc: "Noida",
        match: 73,
        tags: ["HTML", "CSS", "JavaScript", "Figma"]
    }

];


function isSaved(id) {

    return JSON.parse(
        localStorage.getItem("jobai-saved") || "[]"
    ).includes(id);
}


function toggleSave(id) {

    let a = JSON.parse(
        localStorage.getItem("jobai-saved") || "[]"
    );

    a = a.includes(id)
        ? a.filter(x => x !== id)
        : [...a, id];

    localStorage.setItem(
        "jobai-saved",
        JSON.stringify(a)
    );

    toast(
        a.includes(id)
            ? "Job saved"
            : "Removed from saved jobs"
    );

    renderJobs?.();
}


function jobCard(j) {

    return `
        <div class="job">

            <div class="logo">
                ${j.company[0]}
            </div>

            <div class="job-main">

                <strong>${j.title}</strong>

                <small>
                    ${j.company} · ${j.loc} · Full Time · Fresher
                </small>

                <div class="chips">
                    ${j.tags
                        .map(x => `<span class="chip">${x}</span>`)
                        .join("")}
                </div>

            </div>

            <span class="match">
                ${j.match}% Match
            </span>

            <button
                class="btn outline details"
                data-id="${j.id}">
                Details
            </button>

            <button
                class="link save"
                data-id="${j.id}">
                ${isSaved(j.id) ? "★" : "☆"}
            </button>

        </div>
    `;
}


function bindJobs() {

    qsa(".details").forEach(b => {

        b.onclick = () => {

            let j = jobs.find(
                x => x.id == b.dataset.id
            );

            modal(
                j.title,
                `
                <p>
                    <b>${j.company}</b> · ${j.loc}
                </p>

                <p>
                    Your profile match is
                    <b>${j.match}%</b>.

                    Skills:
                    ${j.tags.join(", ")}.
                </p>

                <button
                    class="btn primary"
                    onclick="applyJob(${j.id})">
                    Apply Now
                </button>
                `
            );
        };

    });


    qsa(".save").forEach(b => {

        b.onclick = () =>
            toggleSave(+b.dataset.id);

    });
}


function renderJobs(list = jobs) {

    const box = qs("#jobList");

    if (!box) return;

    box.innerHTML = list.length
        ? list.map(jobCard).join("")
        : `
            <div class="card">
                <h3>No jobs found</h3>
                <p class="muted">
                    Try another search.
                </p>
            </div>
        `;

    bindJobs();
}


function applyJob(id) {

    const j = jobs.find(
        x => x.id === id
    );

    let a = JSON.parse(
        localStorage.getItem("jobai-apps") || "[]"
    );

    a.unshift({
        company: j.company,
        role: j.title,
        loc: j.loc,
        status: "Applied",
        date: new Date().toLocaleDateString("en-IN")
    });

    localStorage.setItem(
        "jobai-apps",
        JSON.stringify(a)
    );

    closeModal();

    toast("Application added");
}


if (qs("#jobList")) {
    renderJobs();
}


/* ---------- Dashboard ---------- */

const resumeData = () =>
    JSON.parse(
        localStorage.getItem("jobai-analysis") || "null"
    );


function renderDashboard() {

    let r = resumeData();

    if (!r) return;

    ["resumeScore", "atsScore"].forEach(id => {

        let e = qs("#" + id);

        if (e) {

            e.textContent =
                id === "resumeScore"
                    ? `${r.resumeScore}/100`
                    : `${r.ats}%`;

        }

    });


    const s = qs("#dashboardSkills");

    if (s) {

        s.innerHTML =
            r.detected
                .slice(0, 8)
                .map(x => `<span class="chip">${x}</span>`)
                .join("");

    }
}

renderDashboard();


/* ---------- Applications ---------- */

function renderApplications() {

    let a = JSON.parse(
        localStorage.getItem("jobai-apps") || "[]"
    );

    const body = qs("#appsBody");

    if (!body) return;

    body.innerHTML = a.length
        ? a.map((x, i) => `
            <tr>

                <td>${x.company}</td>

                <td>${x.role}</td>

                <td>${x.loc}</td>

                <td>
                    <span class="status ${x.status}">
                        ${x.status}
                    </span>
                </td>

                <td>${x.date}</td>

                <td>
                    <button
                        class="link"
                        onclick="removeApp(${i})">
                        Remove
                    </button>
                </td>

            </tr>
        `).join("")
        : `
            <tr>
                <td colspan="6">
                    No applications yet.
                </td>
            </tr>
        `;
}


function removeApp(i) {

    let a = JSON.parse(
        localStorage.getItem("jobai-apps") || "[]"
    );

    a.splice(i, 1);

    localStorage.setItem(
        "jobai-apps",
        JSON.stringify(a)
    );

    renderApplications();

    toast("Application removed");
}

renderApplications();


/* ---------- Resume Builder ---------- */

function loadResumePreview() {

    const r = JSON.parse(
        localStorage.getItem("jobai-builder") || "{}"
    );


    const set = (
        id,
        key,
        def = ""
    ) => {

        if (qs(id)) {
            qs(id).value = r[key] ?? def;
        }

    };


    set(
        "#bName",
        "name",
        "Anshika Gupta"
    );

    set(
        "#bEmail",
        "email",
        "anshika@example.com"
    );

    set(
        "#bPhone",
        "phone",
        "+91 98765 43210"
    );

    set(
        "#bRole",
        "role",
        "CSE — AI & ML"
    );

    set(
        "#bSummary",
        "summary",
        "Computer Science student focused on AI & ML and web development."
    );

    set(
        "#bSkills",
        "skills",
        "Java, Python, JavaScript, HTML, CSS, SQL, Git"
    );

    updatePreview();
}


function updatePreview() {

    if (!qs("#preview")) return;


    const g = id =>
        qs(id)?.value || "";


    qs("#preview").innerHTML = `

        <h1>${g("#bName")}</h1>

        <p>
            <b>${g("#bRole")}</b>
            · ${g("#bEmail")}
            · ${g("#bPhone")}
        </p>

        <h2>PROFILE</h2>

        <p>
            ${g("#bSummary")}
        </p>

        <h2>SKILLS</h2>

        <p>
            ${g("#bSkills")}
        </p>

        <h2>EDUCATION</h2>

        <p>
            B.Tech Computer Science & Engineering — AI & ML
        </p>

        <h2>PROJECTS</h2>

        <ul>
            <li>AI Resume Analyzer & Job Matcher</li>
            <li>Responsive JavaScript Web Applications</li>
        </ul>
    `;
}


if (qs("#preview")) {
    loadResumePreview();
}


qsa("[data-save-builder]").forEach(b => {

    b.onclick = () => {

        localStorage.setItem(
            "jobai-builder",
            JSON.stringify({

                name: qs("#bName").value,

                email: qs("#bEmail").value,

                phone: qs("#bPhone").value,

                role: qs("#bRole").value,

                summary: qs("#bSummary").value,

                skills: qs("#bSkills").value

            })
        );

        updatePreview();

        toast("Resume updated");

    };

});


if (qs("#downloadResume")) {

    qs("#downloadResume").onclick = () => {

        const txt =
            qs("#preview").innerText;

        const a =
            document.createElement("a");

        a.href =
            URL.createObjectURL(
                new Blob(
                    [txt],
                    { type: "text/plain" }
                )
            );

        a.download = "JobAI_Resume.txt";

        a.click();

        toast("Resume downloaded");

    };

}


/* ---------- Career Roadmap ---------- */

const roadmap = [
    "HTML, CSS, JavaScript",
    "Frontend Development (React.js)",
    "Backend Development (Node.js)",
    "Database (MongoDB, SQL)",
    "Projects & Deployment",
    "Apply & Get Hired"
];


if (qs("#timeline")) {

    qs("#timeline").innerHTML =
        roadmap.map((x, i) => `

            <div
                class="step ${
                    i === 0
                        ? "done"
                        : i === 1
                        ? "current"
                        : ""
                }"
                data-step="${i + 1}">

                <strong>${x}</strong>

                <small>
                    ${
                        i === 0
                            ? "Completed"
                            : i === 1
                            ? "In Progress"
                            : "Upcoming"
                    }
                </small>

            </div>

        `).join("");
}


if (qs("#editGoal")) {

    qs("#editGoal").onclick = () => {

        let g = prompt(
            "Enter your career goal",
            localStorage.getItem("jobai-goal") ||
            "Full Stack Developer"
        );

        if (g) {

            localStorage.setItem(
                "jobai-goal",
                g
            );

            qs("#goal").textContent = g;

            toast("Goal updated");
        }

    };
}


if (qs("#goal")) {

    qs("#goal").textContent =
        localStorage.getItem("jobai-goal") ||
        "Full Stack Developer";
}


/* ---------- Job Search ---------- */

if (qs("#searchBtn")) {

    qs("#searchBtn").onclick = () => {

        let q =
            qs("#searchInput")
                .value
                .toLowerCase();

        let loc =
            qs("#location").value;


        renderJobs(
            jobs.filter(j =>
                (
                    !q ||
                    `${j.title} ${j.company} ${j.tags.join(" ")}`
                        .toLowerCase()
                        .includes(q)
                )
                &&
                (
                    loc === "All Locations" ||
                    j.loc === loc
                )
            )
        );

        toast("Search complete");

    };
}


/* ---------- Notifications ---------- */

if (qs("#notifyBtn")) {

    qs("#notifyBtn").onclick = () => {

        modal(
            "Notifications",
            `
            <p>
                Resume analysis is ready.
            </p>

            <p>
                3 new jobs match your skills.
            </p>

            <p>
                Your application status has changed.
            </p>
            `
        );

    };
}


/* ---------- Profile ---------- */

if (qs("#profileBtn")) {

    qs("#profileBtn").onclick = () => {

        const u = currentUser() || {};

        modal(
            "My Profile",
            `
            <p>
                <b>${u.name || "User"}</b>
            </p>

            <p>
                ${u.email || ""}
            </p>

            <p>
                Manage your profile, resume and career
                preferences from Settings.
            </p>

            <button
                class="btn primary"
                onclick="location.href='settings.html'">
                Open Settings
            </button>
            `
        );

    };
}


/* ---------- Settings ---------- */

if (qs("#saveSettings")) {

    qs("#saveSettings").onclick = () => {

        localStorage.setItem(
            "jobai-goal",
            qs("#target").value
        );

        toast("Settings saved");

    };
}


if (qs("#logout")) {
    qs("#logout").onclick = logoutUser;
}


/* ---------- Update User Information ---------- */

updateUserUI();


if (location.pathname.endsWith("settings.html")) {

    const u = currentUser() || {};


    const n =
        document.querySelector(".form input");


    if (n && u.name) {
        n.value = u.name;
    }


    const em =
        document.querySelectorAll(
            ".form input"
        )[1];


    if (em && u.email) {
        em.value = u.email;
    }

}





/* =====================================================
   GLOBAL JOBAI USER PROFILE SYNC
===================================================== */

(function () {

    const saved =
        localStorage.getItem("jobaiSettings");

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);

        const name =
            data.name || "User";


        const initials =
            name
                .split(" ")
                .filter(Boolean)
                .map(word => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();


        /* Update user name */

        document
            .querySelectorAll("[data-user-name]")
            .forEach(element => {

                element.textContent = name;

            });


        /* Update avatar */

        document
            .querySelectorAll("[data-user-initials]")
            .forEach(element => {

                element.textContent =
                    initials || "U";

            });


    } catch (error) {

        console.error(
            "Unable to load saved JobAI profile",
            error
        );

    }

})();