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
    role: "Project Management Internship",
    dates: "Jan 2026 – Feb 2026",
    type: "Internship",
    points: [],
    tech: [],
  },
  {
    track: "other",
    company: "Drushya Digital India Pvt Ltd",
    role: "Full Stack Development Internship",
    dates: "Sept 2025 – Nov 2025",
    type: "Internship",
    points: [],
    tech: [],
  },
];

export const dataExperience = experience.filter((e) => e.track === "data");
export const otherExperience = experience.filter((e) => e.track === "other");
