import { useState, useRef, useEffect, useCallback } from "react";
import {
  generatePath,
  generateVideoScript,
  fetchYouTubeVideos,
} from "../api/learning";

const CATEGORY_STRUCTURE = {
  Technology: {
    domains: [
      "Web Development",
      "Data Science & AI",
      "Mobile Development",
      "DevOps & Cloud",
      "Cybersecurity",
      "UI/UX Design",
      "Machine Learning",
      "Blockchain",
      "Game Development",
      "Backend Engineering",
      "Product Management",
      "Digital Marketing",
      "Finance & Fintech",
      "Education & EdTech",
    ],
  },
  "Medical & Healthcare": {
    domains: [
      "MBBS / General Medicine",
      "Anesthesia",
      "Operation Theatre & Surgical Tech",
      "Radiology & Medical Imaging",
      "Pharmacology",
      "Nursing & Patient Care",
      "Dentistry",
      "Physiotherapy & Rehabilitation",
      "Psychiatry & Mental Health",
      "Pediatrics",
      "Cardiology",
      "Neurology",
      "Pathology & Lab Medicine",
      "Ayurveda & Alternative Medicine",
      "Public Health & Epidemiology",
      "Medical Research & Clinical Trials",
    ],
  },
  "Academic — India": {
    domains: [
      "Class 10 — CBSE",
      "Class 10 — ICSE",
      "Class 12 — Science (PCM)",
      "Class 12 — Science (PCB)",
      "Class 12 — Commerce",
      "Class 12 — Arts / Humanities",
      "JEE Main & Advanced",
      "NEET UG",
      "UPSC Civil Services",
      "SSC / Banking Exams",
      "CAT / MBA Entrance",
      "GATE",
      "CUET",
      "NDA / Defence Exams",
    ],
  },
  "Academic — International": {
    domains: [
      "SAT / ACT Prep",
      "A-Levels",
      "IB Diploma (IBDP)",
      "AP Courses",
      "GRE / GMAT",
      "IELTS / TOEFL",
      "O-Levels",
      "GCSE",
      "French Baccalaureate",
      "German Abitur",
      "University Foundation Year",
    ],
  },
  "Creative & Arts": {
    domains: [
      "Graphic Design",
      "Photography & Videography",
      "Music Production",
      "Film & Cinematography",
      "Creative Writing",
      "Architecture & Interior Design",
      "Fashion Design",
      "Animation & Motion Graphics",
    ],
  },
  "Law & Social Sciences": {
    domains: [
      "Law / LLB",
      "Political Science",
      "Psychology",
      "Sociology",
      "Economics",
      "Journalism & Mass Communication",
      "Social Work",
    ],
  },
};

const SKILL_OPTIONS_BY_DOMAIN = {
  // ── Tech ──
  "Web Development": [
    "HTML/CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Tailwind CSS",
    "REST APIs",
    "GraphQL",
    "Git",
    "Docker",
    "MongoDB",
    "SQL",
    "AWS",
    "Figma",
  ],
  "Data Science & AI": [
    "Python",
    "R",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Jupyter",
    "Tableau",
    "Power BI",
    "Statistics",
    "Machine Learning",
    "Data Visualization",
    "Excel",
  ],
  "Mobile Development": [
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Dart",
    "iOS Development",
    "Android Development",
    "Firebase",
    "REST APIs",
    "Git",
    "App Store Deployment",
    "UI/UX Design",
  ],
  "DevOps & Cloud": [
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Terraform",
    "CI/CD",
    "Linux",
    "Bash",
    "Git",
    "Ansible",
    "Jenkins",
    "Prometheus",
    "Grafana",
    "Networking",
  ],
  Cybersecurity: [
    "Networking",
    "Linux",
    "Python",
    "Ethical Hacking",
    "Penetration Testing",
    "OWASP",
    "Cryptography",
    "Firewalls",
    "SIEM",
    "Incident Response",
    "Risk Management",
    "Compliance",
    "Kali Linux",
  ],
  "UI/UX Design": [
    "Figma",
    "Sketch",
    "Adobe XD",
    "Prototyping",
    "User Research",
    "Wireframing",
    "Design Systems",
    "Accessibility",
    "Typography",
    "Color Theory",
    "Motion Design",
    "Usability Testing",
  ],
  "Machine Learning": [
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Statistics",
    "Linear Algebra",
    "Data Preprocessing",
    "Neural Networks",
    "NLP",
    "Computer Vision",
    "MLOps",
    "Jupyter",
  ],
  Blockchain: [
    "Solidity",
    "Ethereum",
    "Web3.js",
    "Smart Contracts",
    "Cryptography",
    "DeFi",
    "NFTs",
    "Rust",
    "JavaScript",
    "Hardhat",
    "Truffle",
    "IPFS",
  ],
  "Game Development": [
    "Unity",
    "Unreal Engine",
    "C#",
    "C++",
    "3D Modeling",
    "Blender",
    "Physics Engines",
    "Game Design",
    "Level Design",
    "Shaders",
    "Multiplayer Networking",
    "Audio Design",
  ],
  "Backend Engineering": [
    "Node.js",
    "Python",
    "Java",
    "Go",
    "REST APIs",
    "GraphQL",
    "SQL",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Microservices",
    "Message Queues",
    "System Design",
    "AWS",
  ],
  "Product Management": [
    "Roadmapping",
    "User Stories",
    "Agile",
    "Scrum",
    "JIRA",
    "Data Analysis",
    "A/B Testing",
    "Market Research",
    "Wireframing",
    "Stakeholder Management",
    "OKRs",
    "Figma",
  ],
  "Digital Marketing": [
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Content Marketing",
    "Email Marketing",
    "Analytics",
    "Copywriting",
    "Social Media",
    "CRO",
    "HubSpot",
    "WordPress",
    "Branding",
  ],
  "Finance & Fintech": [
    "Excel",
    "Python",
    "SQL",
    "Financial Modeling",
    "Valuation",
    "Bloomberg",
    "Risk Analysis",
    "Accounting",
    "Trading",
    "Blockchain",
    "RegTech",
    "APIs",
  ],
  "Education & EdTech": [
    "Curriculum Design",
    "LMS Platforms",
    "Instructional Design",
    "Video Production",
    "Assessment Design",
    "Python",
    "JavaScript",
    "Content Creation",
    "Accessibility",
  ],
  // ── Medical ──
  "MBBS / General Medicine": [
    "Anatomy",
    "Physiology",
    "Biochemistry",
    "Pathology",
    "Microbiology",
    "Pharmacology",
    "Medicine",
    "Surgery",
    "Obstetrics & Gynecology",
    "Pediatrics",
    "Radiology",
    "Community Medicine",
  ],
  Anesthesia: [
    "Airway Management",
    "General Anesthesia",
    "Regional Anesthesia",
    "Spinal & Epidural",
    "ICU Management",
    "Pain Management",
    "Pharmacology",
    "Patient Monitoring",
    "Emergency Protocols",
    "Ventilator Management",
  ],
  "Operation Theatre & Surgical Tech": [
    "Sterile Technique",
    "Instrument Handling",
    "Surgical Scrubbing",
    "Patient Positioning",
    "Anesthetic Support",
    "Wound Closure",
    "Laparoscopy Basics",
    "Emergency Protocols",
    "Post-op Care",
  ],
  "Radiology & Medical Imaging": [
    "X-Ray Interpretation",
    "CT Scan",
    "MRI",
    "Ultrasound",
    "Interventional Radiology",
    "Nuclear Medicine",
    "DICOM",
    "Radiation Safety",
    "Anatomy",
    "AI in Radiology",
  ],
  Pharmacology: [
    "Drug Classification",
    "Pharmacokinetics",
    "Pharmacodynamics",
    "Clinical Pharmacology",
    "Drug Interactions",
    "Toxicology",
    "Prescription Writing",
    "Research Methods",
    "Herbal Medicine",
  ],
  "Nursing & Patient Care": [
    "Patient Assessment",
    "Vital Signs",
    "Medication Administration",
    "IV Therapy",
    "Wound Care",
    "Emergency Nursing",
    "Pediatric Nursing",
    "ICU Nursing",
    "Communication Skills",
    "Medical Ethics",
  ],
  Dentistry: [
    "Oral Anatomy",
    "Dental Radiology",
    "Restorative Dentistry",
    "Orthodontics",
    "Oral Surgery",
    "Endodontics",
    "Periodontics",
    "Prosthodontics",
    "Dental Materials",
    "Patient Communication",
  ],
  "Physiotherapy & Rehabilitation": [
    "Anatomy",
    "Musculoskeletal Therapy",
    "Neurological Rehab",
    "Exercise Therapy",
    "Manual Therapy",
    "Sports Physiotherapy",
    "Electrotherapy",
    "Pediatric Physio",
    "Geriatric Rehab",
  ],
  "Psychiatry & Mental Health": [
    "Psychopathology",
    "DSM-5",
    "CBT",
    "Psychopharmacology",
    "Mental Status Exam",
    "Child Psychiatry",
    "Addiction Medicine",
    "Crisis Intervention",
    "Counseling Techniques",
  ],
  Pediatrics: [
    "Child Development",
    "Neonatology",
    "Pediatric Nutrition",
    "Immunization",
    "Pediatric Emergencies",
    "Growth Monitoring",
    "Pediatric Pharmacology",
    "Infectious Diseases",
    "Adolescent Medicine",
  ],
  Cardiology: [
    "ECG Interpretation",
    "Echocardiography",
    "Heart Failure",
    "Interventional Cardiology",
    "Cardiac Pharmacology",
    "Hypertension",
    "Arrhythmias",
    "Cardiac Imaging",
    "Preventive Cardiology",
  ],
  Neurology: [
    "Neuroanatomy",
    "EEG",
    "MRI Brain",
    "Stroke Management",
    "Epilepsy",
    "Neurodegenerative Diseases",
    "Neuropharmacology",
    "Neurorehabilitation",
    "Headache Management",
  ],
  "Pathology & Lab Medicine": [
    "Histopathology",
    "Cytopathology",
    "Clinical Biochemistry",
    "Hematology",
    "Microbiology",
    "Immunology",
    "Lab Management",
    "Quality Control",
    "Molecular Diagnostics",
  ],
  "Ayurveda & Alternative Medicine": [
    "Ayurvedic Principles",
    "Panchakarma",
    "Herbal Medicine",
    "Yoga Therapy",
    "Naturopathy",
    "Homeopathy Basics",
    "Diet & Nutrition",
    "Marma Therapy",
  ],
  "Public Health & Epidemiology": [
    "Biostatistics",
    "Epidemiology",
    "Health Policy",
    "Disease Surveillance",
    "Community Health",
    "Global Health",
    "Environmental Health",
    "Research Methods",
    "Health Economics",
  ],
  "Medical Research & Clinical Trials": [
    "Research Methodology",
    "Biostatistics",
    "GCP Guidelines",
    "Ethics in Research",
    "Clinical Trial Design",
    "Data Analysis",
    "Publication Writing",
    "Regulatory Affairs",
    "SPSS/R",
  ],
  // ── India Academic ──
  "Class 10 — CBSE": [
    "Mathematics",
    "Science (Physics, Chemistry, Biology)",
    "English",
    "Hindi",
    "Social Science",
    "Computer Science",
    "Sanskrit",
    "History",
    "Geography",
    "Civics",
  ],
  "Class 10 — ICSE": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Language",
    "English Literature",
    "History & Civics",
    "Geography",
    "Computer Applications",
    "Economic Applications",
  ],
  "Class 12 — Science (PCM)": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "English",
    "Computer Science",
    "Physical Education",
    "Engineering Drawing",
    "Informatics Practices",
  ],
  "Class 12 — Science (PCB)": [
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Biotechnology",
    "Psychology",
    "Physical Education",
    "Nursing",
    "Fine Arts",
  ],
  "Class 12 — Commerce": [
    "Accountancy",
    "Business Studies",
    "Economics",
    "English",
    "Mathematics",
    "Informatics Practices",
    "Entrepreneurship",
    "Legal Studies",
  ],
  "Class 12 — Arts / Humanities": [
    "History",
    "Political Science",
    "Geography",
    "Economics",
    "Sociology",
    "Psychology",
    "English",
    "Philosophy",
    "Fine Arts",
    "Music",
    "Hindi Literature",
  ],
  "JEE Main & Advanced": [
    "Physics — Mechanics",
    "Physics — Electromagnetism",
    "Physics — Optics",
    "Chemistry — Organic",
    "Chemistry — Inorganic",
    "Chemistry — Physical",
    "Mathematics — Calculus",
    "Mathematics — Algebra",
    "Mathematics — Coordinate Geometry",
    "Problem Solving",
  ],
  "NEET UG": [
    "Biology — Botany",
    "Biology — Zoology",
    "Physics — NEET",
    "Chemistry — Organic",
    "Chemistry — Inorganic",
    "Chemistry — Physical",
    "NCERT Mastery",
    "Previous Year Papers",
    "Mock Tests",
  ],
  "UPSC Civil Services": [
    "History",
    "Geography",
    "Polity",
    "Economics",
    "Environment & Ecology",
    "Science & Technology",
    "Current Affairs",
    "Essay Writing",
    "Ethics & Integrity",
    "CSAT",
  ],
  "SSC / Banking Exams": [
    "Quantitative Aptitude",
    "Reasoning",
    "English",
    "General Awareness",
    "Current Affairs",
    "Computer Knowledge",
    "Banking Awareness",
    "Mock Tests",
  ],
  "CAT / MBA Entrance": [
    "Quantitative Ability",
    "Verbal Ability & RC",
    "Data Interpretation",
    "Logical Reasoning",
    "Essay Writing",
    "GD/PI Preparation",
    "Mock Tests",
  ],
  GATE: [
    "Engineering Mathematics",
    "General Aptitude",
    "Core Branch Subject",
    "Previous Year Papers",
    "Mock Tests",
  ],
  CUET: [
    "Domain Subject",
    "English",
    "General Test",
    "Current Affairs",
    "Logical Reasoning",
    "Numerical Ability",
  ],
  "NDA / Defence Exams": [
    "Mathematics",
    "English",
    "General Knowledge",
    "Physics",
    "Chemistry",
    "History",
    "Geography",
    "Current Affairs",
    "Physical Fitness",
  ],
  // ── International Academic ──
  "SAT / ACT Prep": [
    "Math — Algebra",
    "Math — Advanced",
    "Reading Comprehension",
    "Writing & Language",
    "Essay",
    "Science (ACT)",
    "Test Strategy",
    "Time Management",
    "Mock Tests",
  ],
  "A-Levels": [
    "Mathematics",
    "Further Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "English Literature",
    "History",
    "Psychology",
    "Computer Science",
  ],
  "IB Diploma (IBDP)": [
    "Theory of Knowledge",
    "Mathematics AA/AI",
    "Physics HL/SL",
    "Chemistry HL/SL",
    "Biology HL/SL",
    "English A/B",
    "CAS",
    "Extended Essay",
    "Economics",
    "History",
  ],
  "AP Courses": [
    "AP Calculus",
    "AP Statistics",
    "AP Physics",
    "AP Chemistry",
    "AP Biology",
    "AP English",
    "AP US History",
    "AP Computer Science",
    "AP Economics",
    "AP Psychology",
  ],
  "GRE / GMAT": [
    "Verbal Reasoning",
    "Quantitative Reasoning",
    "Analytical Writing",
    "Data Insights (GMAT)",
    "Integrated Reasoning",
    "Problem Solving",
    "Vocabulary Building",
    "Mock Tests",
  ],
  "IELTS / TOEFL": [
    "Listening",
    "Reading",
    "Writing — Task 1",
    "Writing — Task 2",
    "Speaking",
    "Grammar",
    "Vocabulary",
    "Academic English",
    "Mock Tests",
  ],
  "O-Levels": [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Islamiyat",
    "Urdu",
  ],
  GCSE: [
    "Mathematics",
    "English Language",
    "English Literature",
    "Science (Triple/Combined)",
    "History",
    "Geography",
    "Modern Languages",
    "Computer Science",
    "Art & Design",
  ],
  "French Baccalaureate": [
    "Mathématiques",
    "Physique-Chimie",
    "SVT",
    "Philosophie",
    "Histoire-Géographie",
    "Français",
    "Langues Vivantes",
    "Sciences Économiques",
  ],
  "German Abitur": [
    "Mathematik",
    "Deutsch",
    "Physik",
    "Chemie",
    "Biologie",
    "Geschichte",
    "Englisch",
    "Philosophie",
    "Informatik",
  ],
  "University Foundation Year": [
    "Academic English",
    "Mathematics",
    "Critical Thinking",
    "Research Skills",
    "Subject Introductions",
    "Study Skills",
    "Presentation Skills",
  ],
  // ── Creative ──
  "Graphic Design": [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "InDesign",
    "Figma",
    "Typography",
    "Color Theory",
    "Branding",
    "UI Design",
    "Print Design",
    "Motion Graphics",
  ],
  "Photography & Videography": [
    "Camera Basics",
    "Composition",
    "Lighting",
    "Adobe Lightroom",
    "Adobe Premiere",
    "Color Grading",
    "Drone Photography",
    "Storytelling",
    "Social Media Content",
  ],
  "Music Production": [
    "DAW (Ableton/FL Studio)",
    "Music Theory",
    "Sound Design",
    "Mixing",
    "Mastering",
    "MIDI",
    "Sampling",
    "Arrangement",
    "Vocals",
    "Music Business",
  ],
  "Film & Cinematography": [
    "Cinematography",
    "Screenwriting",
    "Directing",
    "Editing (Premiere/DaVinci)",
    "Color Grading",
    "Sound Design",
    "Production Design",
    "Film Theory",
    "Distribution",
  ],
  "Creative Writing": [
    "Storytelling",
    "Fiction Writing",
    "Non-Fiction",
    "Poetry",
    "Screenwriting",
    "Character Development",
    "World Building",
    "Editing",
    "Publishing",
    "SEO Writing",
  ],
  "Architecture & Interior Design": [
    "AutoCAD",
    "SketchUp",
    "Revit",
    "3ds Max",
    "Architectural History",
    "Structural Systems",
    "Interior Design",
    "Sustainable Design",
    "Construction Documents",
  ],
  "Fashion Design": [
    "Fashion Illustration",
    "Pattern Making",
    "Sewing & Garment Construction",
    "Textile Science",
    "Fashion History",
    "CAD for Fashion",
    "Trend Forecasting",
    "Styling",
    "Fashion Business",
  ],
  "Animation & Motion Graphics": [
    "Adobe After Effects",
    "Cinema 4D",
    "Blender",
    "2D Animation",
    "3D Modeling",
    "Rigging",
    "Compositing",
    "Storyboarding",
    "Sound Sync",
    "Character Animation",
  ],
  // ── Law & Social ──
  "Law / LLB": [
    "Constitutional Law",
    "Contract Law",
    "Criminal Law",
    "Tort Law",
    "Family Law",
    "Corporate Law",
    "International Law",
    "Legal Research",
    "Moot Court",
    "Legal Drafting",
  ],
  "Political Science": [
    "Political Theory",
    "Comparative Politics",
    "International Relations",
    "Public Policy",
    "Indian Polity",
    "Democracy & Governance",
    "Political Economy",
    "Research Methods",
  ],
  Psychology: [
    "Introduction to Psychology",
    "Developmental Psychology",
    "Social Psychology",
    "Clinical Psychology",
    "Cognitive Psychology",
    "Neuropsychology",
    "Research Methods",
    "Statistics",
    "Counseling",
  ],
  Sociology: [
    "Sociological Theory",
    "Social Research Methods",
    "Gender Studies",
    "Culture & Society",
    "Urban Sociology",
    "Social Stratification",
    "Development Studies",
    "Political Sociology",
  ],
  Economics: [
    "Microeconomics",
    "Macroeconomics",
    "Statistics",
    "Econometrics",
    "Development Economics",
    "International Economics",
    "Public Finance",
    "Behavioral Economics",
    "Research Methods",
  ],
  "Journalism & Mass Communication": [
    "News Writing",
    "Broadcast Journalism",
    "Digital Journalism",
    "Media Ethics",
    "Photojournalism",
    "PR & Advertising",
    "Social Media",
    "Data Journalism",
    "Editing",
  ],
  "Social Work": [
    "Social Work Theory",
    "Community Development",
    "Social Policy",
    "Counseling",
    "Child Welfare",
    "Disability Studies",
    "Mental Health",
    "Research Methods",
    "Field Practice",
  ],
};

const ALL_CATEGORIES = Object.keys(CATEGORY_STRUCTURE);
const ALL_DOMAINS = Object.values(CATEGORY_STRUCTURE).flatMap((c) => c.domains);

const GROUPED_DOMAIN_OPTIONS = Object.entries(CATEGORY_STRUCTURE).map(
  ([cat, val]) => ({
    category: cat,
    icon: val.icon,
    domains: val.domains,
  }),
);

const DOMAINS = ALL_DOMAINS;

function announce(message, urgent = false) {
  const regionId = urgent ? "aria-alert-region" : "aria-live-region";
  const region = document.getElementById(regionId);
  if (region) {
    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }
}

const S = {
  wrapper: { padding: "6rem 3rem", position: "relative", zIndex: 1 },
  inner: { maxWidth: "1000px", margin: "0 auto" },
  card: {
    background:
      "linear-gradient(145deg, rgba(174,214,188,0.55), rgba(4,26,11,0.75))",
    border: "1px solid rgba(26,173,74,0.18)",
    borderRadius: "28px",
    overflow: "hidden",
    position: "relative",
  },
  form: { padding: "2rem 2.5rem 2.5rem" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.4rem",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.73rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgb(251,251,251)",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "12px",
    color: "#111111",
    fontFamily: "inherit",
    fontSize: "0.92rem",
    padding: "0.75rem 1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "12px",
    color: "#111111",
    fontFamily: "inherit",
    fontSize: "0.92rem",
    padding: "0.75rem 1rem",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "12px",
    color: "#111111",
    fontFamily: "inherit",
    fontSize: "0.92rem",
    padding: "0.75rem 1rem",
    outline: "none",
    resize: "vertical",
    minHeight: "88px",
    boxSizing: "border-box",
  },
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.45rem",
    marginTop: "0.6rem",
  },
  chip: {
    padding: "0.32rem 0.85rem",
    borderRadius: "100px",
    border: "1px solid rgba(255,255,255,0.35)",
    background: "#ffffff",
    color: "#333333",
    fontSize: "0.78rem",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  chipActive: {
    padding: "0.32rem 0.85rem",
    borderRadius: "100px",
    border: "1px solid #16a34a",
    background: "rgba(22,163,74,0.25)",
    color: "#ffffff",
    fontSize: "0.78rem",
    fontFamily: "inherit",
    cursor: "pointer",
    fontWeight: 600,
  },
  timeBox: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "0.85rem 1rem",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  timeDisplay: {
    fontFamily: "inherit",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#15803d",
    marginBottom: "0.5rem",
  },
  range: {
    width: "100%",
    height: "4px",
    padding: 0,
    border: "none",
    borderRadius: "4px",
    outline: "none",
    appearance: "none",
    background: "#d1fae5",
    cursor: "pointer",
  },
  cta: { display: "flex", justifyContent: "center", paddingTop: "1.25rem" },
  btnGenerate: {
    background: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
    color: "#ffffff",
    border: "none",
    padding: "1.1rem 3.5rem",
    borderRadius: "100px",
    fontFamily: "inherit",
    fontSize: "1.05rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s",
    minWidth: "280px",
  },
  btnDisabled: {
    background: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
    color: "#ffffff",
    border: "none",
    padding: "1.1rem 3.5rem",
    borderRadius: "100px",
    fontFamily: "inherit",
    fontSize: "1.05rem",
    fontWeight: 700,
    cursor: "not-allowed",
    minWidth: "280px",
    opacity: 0.7,
  },
  loadingInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  errorBox: {
    background: "rgba(163,45,45,0.15)",
    border: "1px solid rgba(163,45,45,0.4)",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    color: "#f7c1c1",
    fontSize: "0.875rem",
    marginTop: "1rem",
  },
  results: { padding: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" },
  resultsTitle: {
    fontFamily: "inherit",
    fontSize: "1.55rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },
  badgesWrap: { display: "flex", gap: "0.6rem", flexWrap: "wrap" },
  badge: {
    padding: "0.28rem 0.85rem",
    borderRadius: "100px",
    fontSize: "0.75rem",
    fontWeight: 500,
    background: "rgba(10,77,33,0.5)",
    border: "1px solid #15803d",
    color: "#86efac",
  },
  summary: {
    fontSize: "0.93rem",
    color: "rgba(122,181,146,0.7)",
    lineHeight: 1.72,
    fontWeight: 300,
    marginBottom: "2.5rem",
    maxWidth: "72ch",
  },
  timeline: { position: "relative", marginBottom: "2.5rem" },
  stepCard: { display: "flex", gap: "1.5rem", marginBottom: "1.4rem" },
  stepNum: {
    flexShrink: 0,
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "rgba(6,51,22,0.8)",
    border: "2px solid #16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    fontSize: "0.82rem",
    fontWeight: 800,
    color: "#86efac",
    position: "relative",
    zIndex: 1,
  },
  stepBody: {
    flex: 1,
    background: "rgba(6,51,22,0.28)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "1.4rem 1.5rem",
  },
  stepWeek: {
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#4ade80",
    fontWeight: 600,
    marginBottom: "0.35rem",
  },
  stepName: {
    fontFamily: "inherit",
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#ffffff",
  },
  stepDesc: {
    fontSize: "0.875rem",
    color: "rgba(122,181,146,0.7)",
    lineHeight: 1.65,
    fontWeight: 300,
  },
  stepResources: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginTop: "0.85rem",
  },
  resourceTag: {
    padding: "0.22rem 0.65rem",
    borderRadius: "6px",
    fontSize: "0.73rem",
    background: "rgba(10,77,33,0.45)",
    border: "1px solid rgba(26,173,74,0.2)",
    color: "#bbf7d0",
  },
  skillCoverage: {
    paddingTop: "2rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  coverageTitle: {
    fontFamily: "inherit",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.8)",
    marginBottom: "1.2rem",
  },
};

function ResumeUpload({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }
    setFile(f);
    setError("");
    setAnalyzing(true);
    setAnalyzed(false);

    try {
      const token = localStorage.getItem("np_token");
      const formData = new FormData();
      formData.append("file", f);

      const response = await fetch(
        "http://localhost:8000/learning/analyze-resume",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const parsed = await response.json();
      if (parsed.detail) throw new Error(parsed.detail);

      setAnalyzed(true);
      onAnalyzed(parsed);
    } catch (e) {
      setError(
        "Could not analyze resume. You can still fill the form manually.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div style={{ gridColumn: "1 / -1", marginBottom: "0.5rem" }}>
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        style={{
          width: "100%",
          background: expanded
            ? "rgba(22,163,74,0.12)"
            : "rgba(255,255,255,0.04)",
          border: `1px dashed ${expanded ? "#16a34a" : "rgba(255,255,255,0.2)"}`,
          borderRadius: "14px",
          padding: "1rem 1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📄</span>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: analyzed ? "#d8e8de" : "#ffffff",
              }}
            >
              {analyzed
                ? "✓ Resume analyzed — form pre-filled!"
                : "Have a resume? Upload it to auto-fill the form"}
            </div>
            <div
              style={{
                fontSize: "0.73rem",
                color: "rgba(232, 248, 238, 0.94)",
                marginTop: "0.1rem",
              }}
            >
              Optional · PDF only · Max 5MB
            </div>
          </div>
        </div>
        <span style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: 700 }}>
          {expanded ? "▲ Hide" : "▼ Upload"}
        </span>
      </button>

      {expanded && (
        <div style={{ marginTop: "0.75rem" }}>
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${file ? "#16a34a" : "rgba(255,255,255,0.2)"}`,
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
              background: file
                ? "rgba(22,163,74,0.08)"
                : "rgba(255,255,255,0.03)",
              transition: "all 0.2s",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {analyzing ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  color: "#4ade80",
                  fontSize: "0.88rem",
                }}
              >
                <div className="spinner" />
                Analyzing your resume with AI...
              </div>
            ) : file ? (
              <div style={{ fontSize: "0.88rem", color: "#d8c3c3" }}>
                📎 {file.name}
                {analyzed && (
                  <span style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                    · Form pre-filled from resume
                  </span>
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>
                  ⬆️
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                  }}
                >
                  Drop your PDF here or click to browse
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(122,181,146,0.5)",
                    marginTop: "0.3rem",
                  }}
                >
                  PDF only · Max 5MB
                </div>
              </div>
            )}
          </div>

          {analyzed && (
            <div
              style={{
                marginTop: "0.6rem",
                padding: "0.7rem 1rem",
                background: "rgba(22,163,74,0.1)",
                border: "1px solid rgba(22,163,74,0.25)",
                borderRadius: "10px",
                fontSize: "0.8rem",
                color: "#86efac",
              }}
            >
              ✓ Name, role, skills, domain and level were pre-filled from your
              resume. You can edit anything below.
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                color: "#f7c1c1",
              }}
            >
              ⚠ {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function SkillSelector({ domain, activeSkills, setActiveSkills }) {
  const [search, setSearch] = useState("");
  const [customInput, setCustomInput] = useState("");
  const domainSkills = SKILL_OPTIONS_BY_DOMAIN[domain] || [];

  const filtered = search.trim()
    ? domainSkills.filter((s) => s.toLowerCase().includes(search.toLowerCase()))
    : domainSkills;

  const crossDomain = search.trim()
    ? [...new Set(Object.values(SKILL_OPTIONS_BY_DOMAIN).flat())].filter(
        (s) =>
          s.toLowerCase().includes(search.toLowerCase()) &&
          !domainSkills.includes(s),
      )
    : [];

  const toggleSkill = useCallback(
    (skill) => {
      setActiveSkills((prev) => {
        const next = prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill];
        announce(
          `${skill} ${prev.includes(skill) ? "removed" : "added"}. ${next.length} skill${next.length !== 1 ? "s" : ""} selected.`,
        );
        return next;
      });
    },
    [setActiveSkills],
  );

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    if (!activeSkills.includes(val)) {
      setActiveSkills((prev) => [...prev, val]);
      announce(`${val} added as custom skill.`);
    }
    setCustomInput("");
  };

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <div id="np-skills-label" style={S.label}>
        Skills you already know
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: "0.6rem" }}>
        <span
          style={{
            position: "absolute",
            left: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(0,0,0,0.35)",
            fontSize: "0.9rem",
          }}
        >
          🔍
        </span>
        <input
          className="gen-input"
          style={{ ...S.input, paddingLeft: "2.2rem" }}
          type="text"
          placeholder={`Search ${domain} skills or any skill...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Domain skills */}
      <div role="group" aria-labelledby="np-skills-label" style={S.chipWrap}>
        {filtered.map((skill) => {
          const isSelected = activeSkills.includes(skill);
          return (
            <button
              key={skill}
              className="chip-btn"
              style={isSelected ? S.chipActive : S.chip}
              onClick={() => toggleSkill(skill)}
              type="button"
              aria-pressed={isSelected}
            >
              {skill}
            </button>
          );
        })}

        {/* Cross-domain results */}
        {crossDomain.length > 0 && (
          <>
            <div
              style={{
                width: "100%",
                fontSize: "0.68rem",
                color: "rgba(122,181,146,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "0.4rem",
                marginBottom: "0.1rem",
              }}
            >
              Other domains
            </div>
            {crossDomain.slice(0, 10).map((skill) => {
              const isSelected = activeSkills.includes(skill);
              return (
                <button
                  key={skill}
                  className="chip-btn"
                  style={
                    isSelected
                      ? S.chipActive
                      : { ...S.chip, borderStyle: "dashed", opacity: 0.8 }
                  }
                  onClick={() => toggleSkill(skill)}
                  type="button"
                  aria-pressed={isSelected}
                >
                  {skill}
                </button>
              );
            })}
          </>
        )}

        {/* No results + custom add prompt */}
        {search.trim() && filtered.length === 0 && crossDomain.length === 0 && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "rgba(122,181,146,0.5)",
              padding: "0.3rem 0",
            }}
          >
            No match — add "{search}" as a custom skill below ↓
          </div>
        )}
      </div>

      {/* Selected custom skills (ones not in any list) */}
      {activeSkills.filter(
        (s) => !Object.values(SKILL_OPTIONS_BY_DOMAIN).flat().includes(s),
      ).length > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          <div
            style={{
              fontSize: "0.68rem",
              color: "rgba(122,181,146,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.35rem",
            }}
          >
            Custom skills
          </div>
          <div style={S.chipWrap}>
            {activeSkills
              .filter(
                (s) =>
                  !Object.values(SKILL_OPTIONS_BY_DOMAIN).flat().includes(s),
              )
              .map((skill) => (
                <button
                  key={skill}
                  className="chip-btn"
                  style={{
                    ...S.chipActive,
                    paddingRight: "0.55rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                  onClick={() => toggleSkill(skill)}
                  type="button"
                  aria-pressed
                >
                  {skill}
                  <span style={{ opacity: 0.6, fontSize: "0.65rem" }}>✕</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Add custom skill */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <input
          className="gen-input"
          style={{
            ...S.input,
            flex: 1,
            padding: "0.55rem 0.9rem",
            fontSize: "0.85rem",
          }}
          type="text"
          placeholder="Add a custom skill (e.g. Prompt Engineering, MATLAB...)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addCustom())
          }
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!customInput.trim()}
          style={{
            background: customInput.trim()
              ? "rgba(22,163,74,0.2)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${customInput.trim() ? "#16a34a" : "rgba(255,255,255,0.15)"}`,
            borderRadius: "10px",
            padding: "0.55rem 1rem",
            color: customInput.trim() ? "#4ade80" : "rgba(255,255,255,0.3)",
            fontFamily: "inherit",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: customInput.trim() ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

// ── Week Video Card ───────────────────────────────────────────────
function WeekVideoCard({ week, index }) {
  const [playing, setPlaying] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);

  useEffect(() => {
    const query = `${week.title} tutorial ${week.topics?.[0] || ""}`;
    fetchYouTubeVideos(query)
      .then((results) => {
        if (results.length > 0) setEmbedUrl(results[0].embedUrl);
      })
      .catch(() => {});
  }, [week]);

  return (
    <div
      style={{
        background: "rgba(6,51,22,0.4)",
        border: "1px solid rgba(26,173,74,0.15)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "#020f07",
        }}
      >
        {!playing && (
          <div
            onClick={() => {
              if (embedUrl) setPlaying(true);
            }}
            style={{
              position: "absolute",
              inset: 0,
              cursor: embedUrl ? "pointer" : "not-allowed",
              background:
                "linear-gradient(135deg, rgba(6,51,22,0.9), rgba(2,15,7,0.95))",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: embedUrl
                  ? "rgba(255,0,0,0.85)"
                  : "rgba(100,100,100,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: embedUrl ? "0 0 32px rgba(255,0,0,0.4)" : "none",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div
              style={{ fontSize: "0.82rem", color: "rgba(122,181,146,0.7)" }}
            >
              {embedUrl ? "Click to watch" : "Loading..."}
            </div>
          </div>
        )}
        {playing && embedUrl && (
          <iframe
            src={`${embedUrl}&autoplay=1`}
            title={week.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(6,51,22,0.85)",
            border: "1px solid #16a34a",
            borderRadius: "100px",
            padding: "0.2rem 0.65rem",
            fontSize: "0.7rem",
            color: "#4ade80",
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          Week {index + 1}
        </div>
      </div>
      <div style={{ padding: "1rem 1.2rem" }}>
        <div
          style={{
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: "0.35rem",
          }}
        >
          {week.title}
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "rgba(122,181,146,0.6)",
            lineHeight: 1.5,
            marginBottom: "0.6rem",
          }}
        >
          {week.milestone}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {(week.topics || []).slice(0, 4).map((t, i) => (
            <span
              key={i}
              style={{
                padding: "0.18rem 0.55rem",
                borderRadius: "6px",
                fontSize: "0.7rem",
                background: "rgba(10,77,33,0.5)",
                border: "1px solid rgba(26,173,74,0.2)",
                color: "#bbf7d0",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Video Script Panel ────────────────────────────────────────────
function VideoScriptPanel({ pathId, token }) {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOpen(true);
    try {
      const data = await generateVideoScript(pathId, token);
      setScript(data.script || "");
    } catch {
      setScript("Failed to generate script. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "0.2rem",
            }}
          >
            🎬 Video Script
          </div>
          <div style={{ fontSize: "0.8rem", color: "rgba(122,181,146,0.6)" }}>
            AI-generated YouTube script for your learning path
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            background: loading ? "rgba(22,163,74,0.3)" : "rgba(22,163,74,0.2)",
            border: "1px solid #16a34a",
            color: "#4ade80",
            borderRadius: "100px",
            padding: "0.5rem 1.25rem",
            fontFamily: "inherit",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Generating..." : open ? "Regenerate" : "Generate Script"}
        </button>
      </div>
      {open && (
        <div
          style={{
            background: "rgba(2,15,7,0.6)",
            border: "1px solid rgba(26,173,74,0.15)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1.2rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "rgba(122,181,146,0.5)",
                fontFamily: "monospace",
              }}
            >
              script.txt
            </span>
            <button
              onClick={copy}
              disabled={!script || loading}
              style={{
                background: "none",
                border: "1px solid rgba(26,173,74,0.3)",
                color: copied ? "#4ade80" : "rgba(122,181,146,0.7)",
                borderRadius: "8px",
                padding: "0.25rem 0.75rem",
                fontFamily: "inherit",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ padding: "1.25rem 1.5rem", minHeight: "120px" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "rgba(122,181,146,0.5)",
                  fontSize: "0.85rem",
                }}
              >
                <div className="spinner" /> Writing your script...
              </div>
            ) : (
              <pre
                style={{
                  margin: 0,
                  fontFamily: "inherit",
                  fontSize: "0.85rem",
                  color: "rgba(200,230,210,0.85)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {script}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Generator ────────────────────────────────────────────────
export default function Generator() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [domain, setDomain] = useState("Web Development");
  const [focus, setFocus] = useState("");
  const [time, setTime] = useState(8);
  const [duration, setDuration] = useState("12 weeks — Deep Dive");
  const [activeSkills, setActiveSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [activeTab, setActiveTab] = useState("path");
  const resultsRef = useRef(null);
  const resultsHeadingRef = useRef(null);

  useEffect(() => {
    if (loading)
      announce("Generating your personalized learning path, please wait…");
  }, [loading]);
  useEffect(() => {
    if (error) announce(`Error: ${error}`, true);
  }, [error]);
  useEffect(() => {
    if (result) {
      announce(`Your learning path "${result.pathTitle}" has been generated.`);
      setTimeout(() => resultsHeadingRef.current?.focus(), 200);
    }
  }, [result]);

  // Called when resume is analyzed — pre-fills form fields
  const handleResumeAnalyzed = useCallback((data) => {
    if (data.name) setName(data.name);
    if (data.goal) setGoal(data.goal);
    if (data.level) setLevel(data.level);
    if (data.domain && DOMAINS.includes(data.domain)) setDomain(data.domain);
    if (Array.isArray(data.skills) && data.skills.length > 0)
      setActiveSkills(data.skills);
    if (data.summary) setFocus((prev) => prev || data.summary);
  }, []);

  const generate = async () => {
    if (!goal) {
      setError("Please enter your target goal.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setRawData(null);

    const token = localStorage.getItem("np_token");
    if (!token) {
      setError("Please log in to generate a learning path.");
      setLoading(false);
      return;
    }

    try {
      const focusText =
        `Level: ${level}. Domain: ${domain}. Skills: ${activeSkills.join(", ")}. Weekly time: ${time}hrs. Duration: ${duration}. ${focus}`.trim();
      const data = await generatePath({ goal, focus: focusText }, token);
      if (data.detail) {
        setError(data.detail);
        return;
      }

      setRawData(data);
      const pathJson = data.path_json || {};
      const weeks = pathJson.weeks || [];

      setResult({
        pathTitle: pathJson.title || goal,
        summary: `Your personalized ${pathJson.duration_weeks || 8}-week learning path to become: ${goal}`,
        duration: `${pathJson.duration_weeks || 8} weeks`,
        totalHours: `${(pathJson.duration_weeks || 8) * time} hrs`,
        difficulty: level,
        steps: weeks.map((w) => ({
          week: `Week ${w.week}`,
          title: w.title,
          description: w.milestone || "",
          topics: w.topics || [],
          resources: (w.resources || []).map((r) => r.title),
          milestone: w.milestone || "",
        })),
        skillsGained: weeks
          .flatMap((w) =>
            (w.topics || []).map((t, i) => ({
              skill: t,
              coverage: Math.min(95, 50 + i * 10),
            })),
          )
          .slice(0, 6),
        weeks,
      });

      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (e) {
      setError(e.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("np_token");

  return (
    <main
      id="main-content"
      style={S.wrapper}
      aria-label="Learning path generator"
    >
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.9s linear infinite;flex-shrink:0; }
        .dots span { animation:blink 0.9s ease infinite; }
        .dots span:nth-child(2){animation-delay:0.2s}
        .dots span:nth-child(3){animation-delay:0.4s}
        .gen-results { animation: fadeUp 0.5s ease; }
        .step-card-anim { animation: fadeUp 0.5s ease both; }
        .gen-input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.15) !important; }
        .gen-input::placeholder { color: rgba(0,0,0,0.3) !important; }
        .gen-textarea::placeholder { color: rgba(0,0,0,0.3) !important; }
        .step-body-hover:hover { border-color: #15803d !important; }
        .btn-generate-hover:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(18,138,59,0.45); }
        .chip-btn:hover { background: #f0fdf4 !important; border-color: #16a34a !important; color: #15803d !important; }
        .tab-btn { padding: 0.5rem 1.25rem; border-radius: 100px; border: 1px solid rgba(26,173,74,0.3); background: transparent; color: rgba(122,181,146,0.7); fontFamily: inherit; fontSize: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: rgba(22,163,74,0.2); border-color: #16a34a; color: #4ade80; font-weight: 700; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#15803d;border:2px solid #ffffff;box-shadow:0 0 8px rgba(22,163,74,0.4);cursor:pointer; }
        .skill-bar-fill { height:100%;border-radius:4px;background:linear-gradient(90deg,#15803d,#4ade80); }
        .sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
        @media(max-width:768px){ .form-grid-resp{grid-template-columns:1fr!important} .gen-wrapper-resp{padding:4rem 1.5rem!important} .gen-form-resp{padding:1.5rem!important} }
      `}</style>

      <div id="aria-live-region" aria-live="polite" className="sr-only" />
      <div
        id="aria-alert-region"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      <div style={S.inner}>
        <section
          aria-labelledby="generator-heading"
          style={S.card}
          id="generator"
        >
          <h2 id="generator-heading" className="sr-only">
            AI Learning Path Generator
          </h2>

          <div style={S.form} className="gen-form-resp" role="form">
            <div style={S.formGrid} className="form-grid-resp">
              {/* ── Resume Upload (optional) ── */}
              <ResumeUpload onAnalyzed={handleResumeAnalyzed} />

              {/* ── Standard fields ── */}
              <div>
                <label htmlFor="np-name" style={S.label}>
                  Your Name
                </label>
                <input
                  id="np-name"
                  className="gen-input"
                  style={S.input}
                  type="text"
                  placeholder="e.g. Gagan Chaudhary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="np-goal" style={S.label}>
                  Target Goal / Role
                </label>
                <input
                  id="np-goal"
                  className="gen-input"
                  style={S.input}
                  type="text"
                  placeholder="e.g. Pass NEET, Become a Cardiologist, Clear JEE, Senior Developer..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="np-level" style={S.label}>
                  Current Skill Level
                </label>
                <select
                  id="np-level"
                  style={S.select}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="complete beginner">Complete Beginner</option>
                  <option value="beginner with basics">Some Basics</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label htmlFor="np-domain" style={S.label}>
                  Field / Domain
                </label>
                <select
                  id="np-domain"
                  style={S.select}
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setActiveSkills([]);
                  }}
                >
                  {GROUPED_DOMAIN_OPTIONS.map(({ category, icon, domains }) => (
                    <optgroup key={category} label={category}>
                      {domains.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* ── Skill Search + Custom ── */}
              <SkillSelector
                domain={domain}
                activeSkills={activeSkills}
                setActiveSkills={setActiveSkills}
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="np-focus" style={S.label}>
                  Specific focus or context
                  <span
                    style={{
                      marginLeft: "0.4rem",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                      color: "rgba(216, 227, 220, 0.5)",
                      fontSize: "0.7rem",
                    }}
                  >
                    (optional — add anything beyond your resume)
                  </span>
                </label>
                <textarea
                  id="np-focus"
                  className="gen-textarea gen-input"
                  style={S.textarea}
                  placeholder="e.g. I'm preparing for NEET 2025, weak in Biology. / I want a job at a startup with 6 months React experience. / I'm in Class 11 PCM and want to crack JEE..."
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="np-time" style={S.label}>
                  Weekly Time
                </label>
                <div style={S.timeBox}>
                  <div style={S.timeDisplay}>{time} hrs/week</div>
                  <input
                    id="np-time"
                    type="range"
                    style={S.range}
                    min="2"
                    max="40"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="np-duration" style={S.label}>
                  Path Duration
                </label>
                <select
                  id="np-duration"
                  style={S.select}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option>4 weeks — Sprint</option>
                  <option>8 weeks — Standard</option>
                  <option>12 weeks — Deep Dive</option>
                  <option>24 weeks — Full Transformation</option>
                </select>
              </div>
            </div>

            <div style={S.cta}>
              <button
                className="btn-generate-hover"
                style={loading ? S.btnDisabled : S.btnGenerate}
                onClick={generate}
                disabled={loading}
              >
                {loading ? (
                  <span style={S.loadingInner}>
                    <span className="spinner" aria-hidden="true" />
                    <span>Generating your path</span>
                    <span className="dots" aria-hidden="true">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                ) : (
                  <>
                    <span aria-hidden="true">✦ </span>Generate My Learning Path
                  </>
                )}
              </button>
            </div>
            {error && (
              <div style={S.errorBox} role="alert">
                <span aria-hidden="true">⚠ </span>
                {error}
              </div>
            )}
          </div>

          {result && (
            <section
              className="gen-results"
              style={S.results}
              ref={resultsRef}
              aria-labelledby="results-heading"
            >
              <h2
                id="results-heading"
                ref={resultsHeadingRef}
                style={S.resultsTitle}
                tabIndex={-1}
              >
                {result.pathTitle}
              </h2>
              <div style={{ ...S.badgesWrap, marginBottom: "1rem" }}>
                {result.duration && (
                  <span style={S.badge}>{result.duration}</span>
                )}
                {result.totalHours && (
                  <span style={S.badge}>{result.totalHours} total</span>
                )}
                {result.difficulty && (
                  <span style={S.badge}>{result.difficulty}</span>
                )}
              </div>
              {result.summary && <p style={S.summary}>{result.summary}</p>}

              <div
                style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem" }}
              >
                <button
                  className={`tab-btn ${activeTab === "path" ? "active" : ""}`}
                  onClick={() => setActiveTab("path")}
                >
                  Learning Path
                </button>
                <button
                  className={`tab-btn ${activeTab === "videos" ? "active" : ""}`}
                  onClick={() => setActiveTab("videos")}
                >
                  Videos per Week
                </button>
              </div>

              {activeTab === "path" && (
                <>
                  <ol style={S.timeline}>
                    {(result.steps || []).map((step, i) => (
                      <li
                        key={i}
                        className="step-card-anim"
                        style={{
                          ...S.stepCard,
                          animationDelay: `${i * 0.08}s`,
                          listStyle: "none",
                        }}
                      >
                        <div style={S.stepNum} aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div className="step-body-hover" style={S.stepBody}>
                          <div style={S.stepWeek}>{step.week}</div>
                          <h3 style={S.stepName}>{step.title}</h3>
                          <p style={S.stepDesc}>{step.description}</p>
                          {step.topics?.length > 0 && (
                            <div style={{ marginTop: "0.75rem" }}>
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#4ade80",
                                  fontWeight: 600,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  marginBottom: "0.4rem",
                                }}
                              >
                                Topics
                              </div>
                              <div style={S.stepResources}>
                                {step.topics.map((t, j) => (
                                  <span
                                    key={j}
                                    style={{
                                      ...S.resourceTag,
                                      background: "rgba(6,51,22,0.6)",
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {step.resources?.length > 0 && (
                            <div style={{ marginTop: "0.75rem" }}>
                              <div
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#4ade80",
                                  fontWeight: 600,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  marginBottom: "0.4rem",
                                }}
                              >
                                Resources
                              </div>
                              <div style={S.stepResources}>
                                {step.resources.map((r, j) => (
                                  <span key={j} style={S.resourceTag}>
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>

                  {result.skillsGained?.length > 0 && (
                    <section style={S.skillCoverage}>
                      <h3 style={S.coverageTitle}>
                        Skill Coverage After This Path
                      </h3>
                      {result.skillsGained.map((s, i) => (
                        <SkillBar
                          key={i}
                          skill={s.skill}
                          pct={s.coverage}
                          delay={i * 100}
                        />
                      ))}
                    </section>
                  )}

                  {rawData?.id && (
                    <VideoScriptPanel pathId={rawData.id} token={token} />
                  )}
                </>
              )}

              {activeTab === "videos" && (
                <div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(122,181,146,0.6)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Curated videos matching each week's topics.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    {(result.weeks || []).map((week, i) => (
                      <WeekVideoCard key={i} week={week} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function SkillBar({ skill, pct, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 400);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      <span
        style={{
          fontSize: "0.83rem",
          color: "rgba(122,181,146,0.7)",
          minWidth: "130px",
        }}
      >
        {skill}
      </span>
      <div
        role="progressbar"
        aria-label={`${skill} coverage`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          flex: 1,
          height: "4px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          className="skill-bar-fill"
          style={{
            width: `${width}%`,
            transition: `width 1.2s cubic-bezier(.16,.84,.44,1) ${delay}ms`,
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.78rem",
          color: "#4ade80",
          fontWeight: 600,
          minWidth: "36px",
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
