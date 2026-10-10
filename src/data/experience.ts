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
      "Consolidated operational data from 4+ areas: Production, Quality, Stores/Inventory, and Material Requirements.",
      "Cleaned datasets using Python and Excel, handling missing values, outliers, and inconsistencies for reliable analysis.",
      "Built Power BI dashboards to track production output, monthly requirements, and performance trends, supporting data-driven decisions.",
    ],
    tech: [
      "Python",
      "SQL",
      "Advanced Excel",
      "Power BI",
      "Jupyter Notebook",
      "AI Tools",
    ],
  },

  {
    track: "data",
    company: "Lumax Cornaglia Auto Technologies Pvt Ltd",
    role: "Project Management Intern",
    dates: "Jan 2026 – Feb 2026",
    type: "Internship",
    points: [
      "Coordinated with 2 on-site clients on project progress, completion status, and delivery timelines.",
      "Prepared project status reports and tracked pending tasks, milestones, and deadlines for senior management.",
      "Supported audit documentation and project coordination to improve progress visibility and follow-up.",
    ],
    tech: [
      "Advanced Excel",
      "MS Office",
      "Project Tracking",
      "Project Reporting",
      "Audit Documentation",
      "Client Communication",
    ],
  },

  {
    track: "other",
    company: "Drushya Digital India Pvt Ltd",
    role: "Full Stack Developer Intern",
    dates: "Sept 2025 – Nov 2025",
    type: "Internship",
    points: [
      "Developed responsive web application interfaces using React.js, JavaScript, and Tailwind CSS.",
      "Built REST APIs with Node.js and Express.js and integrated backend services with MongoDB.",
      "Debugged application issues and managed code changes using Git and GitHub.",
    ],
    tech: [
      "JavaScript",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST APIs",
      "Git",
      "GitHub",
      "Tailwind CSS",
    ],
  },
];

export const dataExperience = experience.filter((e) => e.track === "data");
export const otherExperience = experience.filter((e) => e.track === "other");
