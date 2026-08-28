/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Parsed line-by-line from two documents:
 *   1. Bhavya_Resume.pdf  (2 pages)  -> marked `resume`
 *   2. Profile (1).pdf    (LinkedIn export, 2 pages) -> marked `linkedin`
 *
 * Nothing here is invented. Where the two documents disagree (job titles,
 * start months, location wording), BOTH versions are preserved: the resume is
 * used as the primary display value and the LinkedIn variant is recorded in
 * `extra` so no source line is ever dropped.
 */

export type SourceDoc = "resume" | "linkedin" | "both";

export type Link = {
  label: string;
  href: string;
  display: string;
  icon: "linkedin" | "github" | "mail" | "phone" | "map";
};

export type Metric = {
  /** Numeric part, used by the animated counters. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Overrides the formatted number when the raw figure needs punctuation. */
  display?: string;
  label: string;
};

export type Project = {
  id: string;
  title: string;
  tagline: string;
  org: string;
  stack: string[];
  bullets: string[];
  source: SourceDoc;
};

export type Role = {
  id: string;
  company: string;
  role: string;
  dates: string;
  location: string;
  tenure?: string;
  /** Scene-setting line that sits above the project breakdown. */
  summary?: string;
  /** Bullets that belong to the role itself rather than a named project. */
  bullets: string[];
  /** Named products/projects worked on within this role. */
  projects: Project[];
  source: SourceDoc;
};

export type Achievement = {
  id: string;
  group: "metrics" | "wins" | "leadership" | "awards";
  title: string;
  context: string;
  metric?: Metric;
  source: SourceDoc;
};

export type SkillGroup = {
  name: string;
  items: string[];
  source: SourceDoc;
};

export type Education = {
  degree: string;
  institution: string;
  location: string;
  dates: string;
  detail?: string;
  source: SourceDoc;
};

export type ExtraItem = {
  label: string;
  value: string;
  note?: string;
  source: SourceDoc;
};

/* -------------------------------------------------------------------------- */
/*  PRIVACY SWITCH                                                            */
/*  The resume lists a phone number. Flip to `false` to strip it from the      */
/*  rendered page and the /resume view in one edit.                            */
/* -------------------------------------------------------------------------- */
export const SHOW_PHONE = true;

export const basics = {
  name: "Bhavya Jain",
  initials: "BJ",
  /** resume headline */
  title: "QA Automation Engineer",
  /** linkedin headline — different wording, preserved */
  titleAlt: "QA Engineer",
  location: "Hisar, Haryana, India 125001",
  locationShort: "Hisar, Haryana, India",
  email: "jainbhavy30@gmail.com",
  phone: "+91 92155 46310",
  yearsExperience: 5,
  /** SUMMARY block — author-supplied site copy, no longer verbatim from the resume PDF */
  summary:
    "QA Automation Engineer with 5 years of experience in test automation, API testing, and performance testing across AI-driven agriculture and healthcare products. Experienced in building automation test suites using Playwright (JS), along with CI/CD integration using GitHub Actions with Slack and Gmail reporting. Experienced in load and performance testing using JMeter, functional and regression testing within Agile/Scrum teams.",
  /** condensed hero line, meaning unchanged (permitted by the clarity rule) */
  heroSummary:
    "5 years building test automation, API and performance testing for AI-driven agriculture and healthcare products.",
  /** linkedin Summary block, verbatim — distinct from the resume summary */
  linkedinSummary:
    "As a QA Engineer at Wadhwani AI, my role is pivotal in ensuring the highest quality of software through expert use of automated testing tools like Cypress, JMeter, and Selenium. My educational foundation in Computer Science from Dr. Vishwanath Karad MIT WORLD PEACE UNIVERSITY underpins a solid understanding of technology that enhances my testing capabilities. Transitioning from an Associate QA Engineer at TIBCO to my current position has allowed me to further refine my competencies, contributing to a team that values precision and innovative problem-solving. My journey from a Frontend Web Developer at JBM Group to QA reflects a continuous evolution toward technical excellence in software quality assurance.",
};

export const links: Link[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bhavyajain3030",
    display: "linkedin.com/in/bhavyajain3030",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/BhavyaJain1",
    display: "github.com/BhavyaJain1",
    icon: "github",
  },
  {
    label: "Email",
    href: "mailto:jainbhavy30@gmail.com",
    display: "jainbhavy30@gmail.com",
    icon: "mail",
  },
];

/* -------------------------------------------------------------------------- */
/*  EXPERIENCE                                                                */
/* -------------------------------------------------------------------------- */

export const experience: Role[] = [
  {
    id: "wadhwani-ai",
    company: "Wadhwani AI",
    role: "QA Automation Engineer II",
    dates: "May 2023 – Present",
    location: "New Delhi, India",
    tenure: "3 years 4 months",
    summary:
      "Sole QA owner for four AI products across the agriculture and healthcare domains, supporting 5 releases per year on independent release cycles.",
    bullets: [],
    source: "both",
    projects: [
      {
        id: "agri-ai-collect",
        title: "Agri AI Collect",
        tagline: "field data collection and analytics dashboard platform",
        org: "Wadhwani AI",
        stack: ["Playwright", "JavaScript", "GitHub Actions", "REST API", "Slack"],
        source: "resume",
        bullets: [
          "Designed and built a 300+ test-case Playwright (JavaScript) automation suite from scratch covering all dashboard modules, replacing a fully manual regression process.",
          "Built an autonomous testing agent for the web app that turns a PRD and design references into executable coverage — authoring the test cases into a generated Excel tracker when given login credentials, automating the test cases which are possible to automate through Playwright MCP, and flagging them as automated on completion in the test case sheet.",
          "Integrated the suite into the CI/CD pipeline using GitHub Actions with Slack run notifications, reducing regression feedback time from 2 days to 45 minutes per build.",
          "Built REST API automation in Playwright covering all endpoints, validating status codes, response schemas, and error handling alongside UI coverage.",
          "Use GitHub Copilot and Cursor to generate and refactor Playwright test scripts, and prompt LLMs to draft test scenarios and edge cases, shortening the time to author coverage for new features.",
          "Maintained test plans, test cases, and execution reports to give full requirement-to-defect traceability across releases.",
        ],
      },
      {
        id: "crop-ace",
        title: "Crop ACE",
        tagline: "image-based crop advisory application",
        org: "Wadhwani AI",
        stack: ["JMeter", "Python", "Agile"],
        source: "resume",
        bullets: [
          "Ran JMeter load and performance testing at up to 1,000 concurrent users, identifying performance bottlenecks before production release.",
          "Developed Python scripts to randomise image selection from a source directory, replacing static test data and producing load profiles representative of real field usage.",
          "Executed regression testing across releases within Agile sprint timelines.",
        ],
      },
      {
        id: "grain-analyser",
        title: "Grain Analyser",
        tagline: "computer-vision grain quality grading platform",
        org: "Wadhwani AI",
        stack: ["Appium", "JMeter", "SQL", "Computer Vision"],
        source: "resume",
        bullets: [
          "Validated image-inference output for accuracy and consistency across varied input conditions, defining pass/fail criteria for non-deterministic model results.",
          "Built an autonomous testing agent for the mobile app that turns a PRD and design references into executable coverage — authoring the test cases into a generated Excel tracker when given login credentials, automating the test cases which are possible to automate through Appium MCP, and flagging them as automated on completion in the test case sheet; the Appium mobile automation suite covers 62 test cases.",
          "Performed JMeter load testing and regression testing across releases.",
          "Wrote complex SQL queries to validate database objects including tables, views, and indexes.",
          "Contributed to product design reviews, giving input on functional requirements, testability, schedules, and risk.",
        ],
      },
      {
        id: "u6a-mnch",
        title: "U6A MNCH",
        tagline: "maternal, newborn and child health data platform",
        org: "Wadhwani AI",
        stack: ["JIRA", "Performance Testing", "Integration Testing"],
        source: "resume",
        bullets: [
          "Conducted performance testing to assess application stability under varying load and network conditions.",
          "Executed smoke, functional, and integration testing, tracking defects to closure in JIRA.",
        ],
      },
    ],
  },
  {
    id: "tibco",
    company: "TIBCO Software India Pvt. Ltd.",
    role: "Associate QA Engineer",
    dates: "Sep 2021 – Apr 2023",
    location: "Pune, India",
    tenure: "1 year 8 months",
    summary: "Projects: TCLA and BPME",
    source: "both",
    bullets: [
      "Developed and maintained automation scripts using a Cucumber BDD framework in Selenium WebDriver, expanding coverage by 200–250 test cases.",
      "Authored and maintained comprehensive functional and regression test cases, improving release quality across product releases.",
      "Partnered with developers to reproduce and triage defects, managing the full defect lifecycle in JIRA to drive timely resolution.",
    ],
    projects: [
      {
        id: "tcla",
        title: "TCLA",
        tagline: "TIBCO product line",
        org: "TIBCO Software India Pvt. Ltd.",
        stack: ["Selenium WebDriver", "Cucumber BDD", "JIRA"],
        source: "resume",
        bullets: [],
      },
      {
        id: "bpme",
        title: "BPME",
        tagline: "TIBCO product line",
        org: "TIBCO Software India Pvt. Ltd.",
        stack: ["Selenium WebDriver", "Cucumber BDD", "JIRA"],
        source: "resume",
        bullets: [],
      },
    ],
  },
  {
    id: "jbm-group",
    company: "JBM Group",
    role: "Frontend Web Developer Intern",
    dates: "Jun 2020 – Sep 2020",
    location: "Gurugram, India",
    tenure: "4 months",
    source: "both",
    bullets: [
      "Built and styled responsive web interfaces using HTML, CSS, and JavaScript.",
      "Built and styled responsive web interfaces, gaining the developer-side perspective that now informs how I design and prioritise tests.",
    ],
    projects: [],
  },
];

/** Flattened project list for the Projects section. */
export const projects: Project[] = experience.flatMap((role) => role.projects);

/* -------------------------------------------------------------------------- */
/*  ACHIEVEMENTS                                                              */
/*  Only measurable//factual items already present in the source documents.    */
/* -------------------------------------------------------------------------- */

export const achievements: Achievement[] = [
  {
    id: "playwright-suite",
    group: "metrics",
    title: "Built a 300+ test-case Playwright suite from scratch",
    context:
      "Covering all dashboard modules on Agri AI Collect, replacing a fully manual regression process.",
    metric: { value: 300, suffix: "+", label: "Automated test cases" },
    source: "resume",
  },
  {
    id: "regression-feedback",
    group: "metrics",
    title: "Cut regression feedback from 2 days to 45 minutes",
    context:
      "Integrated the suite into the CI/CD pipeline using GitHub Actions with Slack run notifications.",
    metric: { value: 45, suffix: " min", label: "Regression feedback per build" },
    source: "resume",
  },
  {
    id: "load-testing",
    group: "metrics",
    title: "Load tested to 1,000 concurrent users",
    context:
      "JMeter load and performance testing on Crop ACE, identifying performance bottlenecks before production release.",
    metric: { value: 1000, display: "1,000", label: "Concurrent users sustained" },
    source: "resume",
  },
  {
    id: "appium-suite",
    group: "metrics",
    title: "Mobile automation suite covering 62 test cases",
    context: "Built with Appium for the Grain Analyser computer-vision platform.",
    metric: { value: 62, label: "Mobile test cases" },
    source: "resume",
  },
  {
    id: "tibco-coverage",
    group: "metrics",
    title: "Expanded automation coverage by 200–250 test cases",
    context:
      "Using a Cucumber BDD framework in Selenium WebDriver across the TCLA and BPME projects at TIBCO.",
    metric: { value: 250, prefix: "200–", label: "Test cases added at TIBCO" },
    source: "resume",
  },
  {
    id: "sole-qa-owner",
    group: "leadership",
    title: "Sole QA owner for four AI products",
    context:
      "Across the agriculture and healthcare domains, supporting 5 releases per year on independent release cycles.",
    metric: { value: 4, label: "AI products owned" },
    source: "resume",
  },
  {
    id: "release-cadence",
    group: "leadership",
    title: "Supported 5 releases per year",
    context: "On independent release cycles across four products.",
    metric: { value: 5, label: "Releases per year" },
    source: "resume",
  },
  {
    id: "design-reviews",
    group: "leadership",
    title: "Contributed to product design reviews",
    context:
      "Giving input on functional requirements, testability, schedules, and risk for Grain Analyser.",
    source: "resume",
  },
  {
    id: "defect-lifecycle",
    group: "wins",
    title: "Owned the full defect lifecycle in JIRA",
    context:
      "Partnered with developers to reproduce and triage defects, driving timely resolution.",
    source: "resume",
  },
  {
    id: "api-automation",
    group: "wins",
    title: "REST API automation across all endpoints",
    context:
      "Validating status codes, response schemas, and error handling alongside UI coverage in Playwright.",
    source: "resume",
  },
  {
    id: "ml-validation",
    group: "wins",
    title: "Defined pass/fail criteria for non-deterministic model output",
    context:
      "Validated image-inference output for accuracy and consistency across varied input conditions.",
    source: "resume",
  },
  {
    id: "ai-assisted",
    group: "wins",
    title: "AI-assisted test authoring in the daily workflow",
    context:
      "GitHub Copilot and Cursor to generate and refactor Playwright scripts; LLMs to draft test scenarios and edge cases.",
    source: "resume",
  },
  {
    id: "cert-java",
    group: "awards",
    title: "Java (Basic)",
    context: "Certification. Listed on LinkedIn as “Java Basic”.",
    source: "both",
  },
  {
    id: "cert-dbms",
    group: "awards",
    title: "Database Management Systems",
    context: "Certification. Listed on LinkedIn as “Data Base Management Systems”.",
    source: "both",
  },
  {
    id: "cgpa",
    group: "awards",
    title: "B.Tech Computer Science — CGPA 8.0",
    context:
      "Dr. Vishwanath Karad MIT World Peace University, Pune (2017 – 2021).",
    metric: { value: 8.0, display: "8.0", label: "CGPA" },
    source: "resume",
  },
];

/** Drives the "Top 3 Impact" strip. IDs must exist in `achievements`. */
export const topImpactIds = ["playwright-suite", "regression-feedback", "load-testing"];

/* -------------------------------------------------------------------------- */
/*  SKILLS                                                                    */
/* -------------------------------------------------------------------------- */

export const skills: SkillGroup[] = [
  {
    name: "Automation",
    source: "resume",
    items: [
      "Playwright (UI & API)",
      "Selenium WebDriver",
      "Appium (mobile)",
      "Cypress",
      "Cucumber BDD",
      "Page Object Model (POM)",
      "JavaScript",
      "Python",
    ],
  },
  {
    name: "AI-Assisted Testing & Workflow Automation",
    source: "resume",
    items: [
      "GitHub Copilot",
      "Cursor",
      "LLMs (ChatGPT/Claude) for test case design",
      "Test scenario and edge-case generation",
      "Test script generation and refactoring",
      "n8n for AI-assisted testing workflow automation",
    ],
  },
  {
    name: "API & Performance",
    source: "resume",
    items: [
      "Postman API automation",
      "JMeter load & performance testing",
      "API response validation",
    ],
  },
  {
    name: "Testing",
    source: "resume",
    items: [
      "Functional",
      "Regression",
      "Smoke",
      "Integration",
      "Cross-browser",
      "Exploratory",
      "Manual",
      "Mobile",
      "Database/SQL testing",
      "ML/computer-vision output validation",
    ],
  },
  {
    name: "Process & Tools",
    source: "resume",
    items: [
      "CI/CD pipelines (Jenkins, GitHub Actions)",
      "Git",
      "JIRA",
      "Agile/Scrum",
      "Test strategy",
      "Defect lifecycle management",
    ],
  },
  {
    name: "Top Skills (LinkedIn)",
    source: "linkedin",
    items: ["Domain Analysis", "Configuration Testing", "Database Testing"],
  },
];

/* -------------------------------------------------------------------------- */
/*  EDUCATION / CERTIFICATIONS / LANGUAGES                                    */
/* -------------------------------------------------------------------------- */

export const education: Education[] = [
  {
    degree: "B.Tech, Computer Science",
    institution: "Dr. Vishwanath Karad MIT World Peace University",
    location: "Pune",
    dates: "2017 – 2021",
    detail: "CGPA: 8.0",
    source: "both",
  },
];

export const certifications = [
  { name: "Java (Basic)", altName: "Java Basic", source: "both" as SourceDoc },
  {
    name: "Database Management Systems",
    altName: "Data Base Management Systems",
    source: "both" as SourceDoc,
  },
];

export const languages = [
  { name: "English", level: "Upper-Intermediate, B2", source: "resume" as SourceDoc },
  { name: "Hindi", level: "Native", source: "resume" as SourceDoc },
];

/** Empty by design — neither document lists awards separate from certifications. */
export const awards: { name: string; context: string }[] = [];

/* -------------------------------------------------------------------------- */
/*  EXTRA                                                                     */
/*  Lines that are real but ambiguous or that conflict between the two source */
/*  documents. Per the brief these are preserved rather than guessed at.       */
/* -------------------------------------------------------------------------- */

export const extra: ExtraItem[] = [
  {
    label: "Headline variant",
    value: "QA Engineer",
    note: "LinkedIn headline. The resume headline reads “QA Automation Engineer”.",
    source: "linkedin",
  },
  {
    label: "Wadhwani AI — role variant",
    value: "QA Engineer · May 2023 – Present (3 years 4 months) · Delhi, India",
    note: "LinkedIn lists this alongside a second overlapping entry. The resume records a single role, “QA Automation Engineer II”, from Apr 2023.",
    source: "linkedin",
  },
  {
    label: "Wadhwani AI — role variant",
    value:
      "Quality Assurance Automation Engineer · April 2023 – Present (3 years 5 months)",
    note: "Second LinkedIn entry for the same employer, overlapping the one above.",
    source: "linkedin",
  },
  {
    label: "Wadhwani AI — LinkedIn role description",
    value:
      "Automated Web App using Playwright (JavaScript) and deployed the suite on the CI/CD pipeline with Slack integration for reports. Built API automation using Playwright and completed unit and regression testing across software and individual modules. Maintained test documentation including plans, cases, and results to ensure full traceability. Tested functionality, performance, and compliance of each product against design specifications to uphold strong development standards.",
    note: "LinkedIn phrasing of the Wadhwani AI role, kept verbatim alongside the resume bullets.",
    source: "linkedin",
  },
  {
    label: "Wadhwani AI — total tenure",
    value: "3 years 5 months",
    source: "linkedin",
  },
  {
    label: "JBM Group — role variant",
    value:
      "Frontend Web Developer · June 2020 – September 2020 (4 months) · Gurugram, Haryana, India",
    note: "LinkedIn title and location. The resume records “Frontend Web Developer Intern” in “Gurugram, India”.",
    source: "linkedin",
  },
  {
    label: "JBM Group — role variant",
    value:
      "Frontend Developer · June 2020 – September 2020 (4 months) · Gurugram, Haryana, India",
    note: "Second LinkedIn entry for the same period at the same employer.",
    source: "linkedin",
  },
  {
    label: "JBM Group — total tenure",
    value: "4 months",
    source: "linkedin",
  },
  {
    label: "TIBCO — LinkedIn entry",
    value:
      "TIBCO · Associate QA Engineer · September 2021 – April 2023 (1 year 8 months) · Pune, Maharashtra, India",
    note: "The resume records the employer as “TIBCO Software India Pvt. Ltd.” and the location as “Pune, India”.",
    source: "linkedin",
  },
  {
    label: "Education — institution name variant",
    value: "Dr.Vishwanath Karad MIT WORLD PEACE UNIVERSITY|PUNE",
    note: "LinkedIn spelling. The resume writes “Dr. Vishwanath Karad MIT World Peace University, Pune”.",
    source: "linkedin",
  },
  {
    label: "Contact — LinkedIn",
    value: "www.linkedin.com/in/bhavyajain3030 (LinkedIn)",
    note: "Listed under Contact on the LinkedIn export.",
    source: "linkedin",
  },
];

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/* -------------------------------------------------------------------------- */

export const sections = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
