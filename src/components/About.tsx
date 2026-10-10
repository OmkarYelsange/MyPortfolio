import { Link } from "react-router-dom";
import { FillModel } from "./FillModel";
import { MapPin, Briefcase, GraduationCap, Target } from "lucide-react";

const facts = [
  [MapPin, "Location", "Pune / Lonavala, India"],
  [Briefcase, "Currently", "Data Analyst, Autoline Industries Ltd."],
  [
    GraduationCap,
    "Education",
    "B.E. Robotics & Automation Engineering (2022–2026)",
  ],
  [Target, "Focus", "Data Analytics · Data Engineering · Data Science"],
] as const;

const journey = [
  "Robotics & Automation",
  "Software",
  "Data Analytics",
  "Data Engineering",
  "Data + ML",
];

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20"
      aria-labelledby="about-h"
    >
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {/* LEFT — IMAGE + FACTS */}
        <div className="space-y-4 lg:order-1">
          <figure className="lift relative mx-auto aspect-[5/4] max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/30 via-cyan/15 to-pink/25 lg:max-w-none">
            <div
              className="absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/40 to-pink/30 blur-2xl"
              aria-hidden
            />

            <img
              src="/images/omkar-cutout-1000.webp"
              srcSet="/images/omkar-cutout-560.webp 560w, /images/omkar-cutout-1000.webp 1000w"
              sizes="(min-width:1024px) 400px, 90vw"
              width={1000}
              height={1046}
              alt="Omkar Yelsange, Data Analyst"
              loading="lazy"
              decoding="async"
              className="relative h-full w-full object-contain object-bottom"
            />

            <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs text-white backdrop-blur">
              <b>Omkar Yelsange</b> · Pune, India
            </figcaption>
          </figure>

          {/* 3D SENSOR MODEL — KEPT */}
          <div className="relative mt-6 hidden h-56 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-transparent to-cyan/10 lg:block">
            <FillModel
              kind="sensor"
              label="3D live sensor data waveform"
              className="absolute inset-0"
            />

            <p className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-card px-3 py-1 font-mono text-xs text-fg2">
              live sensor data → analysis → insight
            </p>
          </div>
        </div>

        {/* RIGHT — ABOUT CONTENT */}
        <div className="space-y-4 text-fg2 lg:order-2">
          <p className="font-mono text-xs text-cyan">ABOUT ME</p>
          <h2 id="about-h" className="text-2xl font-bold sm:text-3xl">
            From Raw Data to Actionable Insights
          </h2>

          <p>
            I'm Omkar Yelsange, a Data Analyst at Autoline Industries Ltd in
            Pune, focused on turning raw data into meaningful insights that
            support better business decisions. I work with cross-functional
            operational data, using Python, SQL, and Power BI to analyze
            performance, improve data quality, and build actionable reports and
            dashboards.
          </p>
          <p>
            My experience includes data cleaning, handling missing values and
            outliers, analyzing production trends, and tracking operational
            KPIs. I'm also strengthening my data engineering skills with
            Databricks, PySpark, AWS, and the Medallion architecture, with a
            focus on building scalable and reliable data workflows.
          </p>
          <p>
            I'm interested in opportunities across Data Analytics, Data
            Engineering, Business Intelligence, and Python/SQL development,
            where I can solve practical problems, write efficient code, and
            build data-driven solutions that deliver measurable value. My
            additional software development projects are available on the
            separate{" "}
            <Link to="/other-work" className="u-link text-accent">
              Other Work
            </Link>{" "}
            page.
          </p>

          {/* CAREER JOURNEY */}
          <ol
            data-stagger
            className="stagger flex flex-wrap gap-2 pt-2 font-mono text-xs"
            aria-label="Career journey"
          >
            {journey.map((j, k) => (
              <li
                key={j}
                className="rounded-full border border-white/15 bg-card px-3 py-1 text-fg"
              >
                {j}

                {k < journey.length - 1 && (
                  <span className="ml-2 text-accent">→</span>
                )}
              </li>
            ))}
          </ol>
          <ul data-stagger className="stagger grid gap-3">
            {facts.map(([Icon, l, v]) => (
              <li
                key={l}
                className="flex items-start gap-3 lift rounded-2xl border border-white/10 bg-card p-4"
              >
                <Icon size={18} className="mt-0.5 text-accent" />

                <div>
                  <p className="text-xs text-muted">{l}</p>
                  <p className="text-sm">{v}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
