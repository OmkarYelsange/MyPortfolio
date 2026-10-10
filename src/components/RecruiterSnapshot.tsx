import { experience } from "../data/experience";
import { dataProjects as projects } from "../data/projects";
import { Counter } from "./Motion";
import { skills } from "../data/skills";

const groups = [
  [
    "Data Analytics",
    ["Python", "SQL", "Power BI", "Excel", "EDA", "Data Visualization"],
  ],
  [
    "Data Engineering",
    [
      "AWS",
      "Databricks",
      "PySpark",
      "ETL / ELT",
      "Data Warehousing",
      "Data Pipelines",
    ],
  ],
  [
    "Data Science / ML",
    ["Python", "Statistics", "Machine Learning", "NLP", "Generative AI"],
  ],
] as const;

export default function RecruiterSnapshot() {
  // Counts are derived from the data files, never hard-coded.
  const stats = [
    [projects.length, "Data projects"],
    [new Set(Object.values(skills).flat()).size, "Tools & skills"],
    [
      experience.filter((e) => e.track === "data").length,
      "Data roles & internships",
    ],
  ];
  return (
    <section
      className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20"
      aria-labelledby="snap"
    >
      <h2 id="snap" className="text-2xl font-bold">
        Recruiter snapshot
      </h2>
      <p className="mt-2 text-fg2">
        A quick overview of what I bring to the table.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-5 sm:grid-cols-3">
          {groups.map(([t, items]) => (
            <div
              key={t}
              className="lift rounded-2xl border border-white/10 bg-card p-5"
            >
              <h3 className="font-semibold text-accent">{t}</h3>
              <ul className="mt-3 space-y-1 text-sm text-fg2">
                {items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <dl className="grid grid-cols-3 gap-4 lift rounded-2xl border border-white/10 bg-card p-5 lg:grid-cols-1">
          {stats.map(([n, l]) => (
            <div key={l}>
              <dd className="text-3xl font-extrabold">
                <Counter to={n as number} />
              </dd>
              <dt className="text-sm text-muted">{l}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
