// Only facts supplied by Omkar. Add `points` (responsibilities) when you want bullet details under a role.
export interface Role {
  track: "data" | "other";
  company: string;
  role: string;
  dates: string;
  current?: boolean;
  type: string;
  points: string[];
  tech: string[];
}
export const experience: Role[] = [
  {
    track: "data",
    company: "Autoline Industries Ltd",
    role: "Data Analyst",
    dates: "June 2026 – Present",
    current: true,
    type: "Full-time",
    points: [
      "Collected, consolidated, and organized operational data from multiple departments, including Production, Quality, Stores/Inventory, and Material Requirements, to support manufacturing performance analysis and reporting.",

      "Performed data cleaning and preprocessing using Python and Advanced Excel, handling missing values, null records, outliers, and inconsistencies to improve data quality and reporting reliability.",

      "Developed interactive Power BI dashboards to monitor production output, performance trends, monthly material requirements, and operational KPIs, enabling teams to identify production fluctuations and performance gaps.",

      "Analyzed production performance against operational requirements to identify trends, deviations, and potential bottlenecks, supporting data-driven discussions around production planning and process efficiency.",

      "Applied analytical and problem-solving techniques to identify production improvement opportunities and support operational decision-making through data-backed insights.",

      "Used SQL, Python, Jupyter Notebook, and AI-powered tools to streamline data analysis, explore operational datasets, and improve analytical workflows.",
    ],
    tech: [
      "Python",
      "SQL",
      "Advanced Excel",
      "Power BI",
      "Jupyter Notebook",
      "AI Tools & Prompt Engineering",
    ],
  },

  {
    track: "data",
    company: "Lumax Cornaglia Auto Technologies Pvt Ltd",
    role: "Project Management Intern",
    dates: "Jan 2026 – Feb 2026",
    type: "Internship",
    points: [
      "Supported project planning, milestone tracking, and execution monitoring across manufacturing workflows to help maintain project timelines and completion targets.",

      "Coordinated with two on-site clients to communicate project progress, provide completion updates, discuss timelines, and support alignment on project deliverables.",

      "Prepared project status reports, maintained project documentation, and tracked pending activities to improve progress visibility and support timely follow-ups.",

      "Assisted senior management with project coordination, progress reviews, task prioritization, and deadline monitoring to support smooth project execution.",

      "Gained practical exposure to auditing activities, documentation checks, and process compliance within a manufacturing environment.",

      "Strengthened stakeholder management, professional communication, time management, and problem-solving skills while coordinating project activities and meeting deadlines.",
    ],
    tech: [
      "Project Coordination",
      "Project Tracking",
      "MS Excel",
      "MS Office",
      "Project Reporting",
      "Audit Documentation",
      "Client Communication",
      "Time Management",
    ],
  },

  {
    track: "other",
    company: "Drushya Digital India Pvt Ltd",
    role: "Full Stack Developer Intern",
    dates: "Sept 2025 – Nov 2025",
    type: "Internship",
    points: [
      "Developed and maintained web application components using React.js, JavaScript, and modern frontend technologies, focusing on responsive interfaces and usability.",

      "Built and integrated RESTful APIs using Node.js and Express.js to connect frontend components with backend services and application data.",

      "Worked with MongoDB and SQL databases to manage application data and support backend functionality.",

      "Implemented and tested application features, debugged issues, and improved functionality through iterative development and testing.",

      "Used Git and GitHub for version control, source code management, and tracking development changes throughout the project lifecycle.",

      "Collaborated on development tasks, incorporated feedback, and managed assigned deliverables to support timely project progress.",
    ],
    tech: [
      "JavaScript",
      "Python",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "SQL",
      "REST APIs",
      "Git",
      "GitHub",
      "Tailwind CSS",
    ],
  },
];

export const dataExperience = experience.filter((e) => e.track === "data");
export const otherExperience = experience.filter((e) => e.track === "other");
