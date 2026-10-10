import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, GitFork } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { education } from "../data/education";
import Timeline from "./Timeline";
import { FillModel, HeadModel, type ModelKind } from "./FillModel";
import { Heatmap } from "./Extras";

const S = ({
  id,
  title,
  sub,
  model,
  children,
}: {
  id?: string;
  title: string;
  sub?: string;
  model?: ModelKind;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20"
  >
    {model && <HeadModel kind={model} />}
    <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
    {sub && <p className="mt-2 text-fg2">{sub}</p>}
    <div className="mt-8">{children}</div>
  </section>
);

const steps = [
  ["Understand", "What problem are we solving?"],
  ["Collect", "Where does the data come from?"],
  ["Clean", "Can we trust the data?"],
  ["Transform", "How should the data be modeled?"],
  ["Analyze", "What does the data tell us?"],
  ["Visualize", "How can we communicate it?"],
  ["Decide", "What action should the business take?"],
];
export const Process = () => (
  <S title="How I Work with Data" model="workflow">
    <ol
      data-stagger
      className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {steps.map(([t, q], i) => (
        <li
          key={t}
          className="lift rounded-2xl border border-white/10 bg-card p-5"
        >
          <span className="font-mono text-xs text-cyan">Step {i + 1}</span>
          <h3 className="mt-1 font-semibold">{t}</h3>
          <p className="text-sm text-fg2">{q}</p>
        </li>
      ))}
      <li className="min-h-[9rem]" aria-hidden>
        <FillModel kind="neural" className="h-full min-h-[9rem] w-full" />
      </li>
    </ol>
  </S>
);

const DataCube3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.DataCube3D })),
);
const Database3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.Database3D })),
);
const NeuralNet3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.NeuralNet3D })),
);
const pillars = [
  {
    t: "Data Analytics",
    d: "Turning data into insights and decisions with SQL, Python, Power BI, Excel and Tableau.",
    tags: ["SQL", "Power BI", "EDA", "KPIs"],
    M: DataCube3D,
  },
  {
    t: "Data Engineering",
    d: "Building reliable data pipelines and analytics-ready datasets on Databricks and AWS.",
    tags: ["Databricks", "PySpark", "AWS", "ETL / ELT"],
    M: Database3D,
  },
  {
    t: "Data Science",
    d: "Statistical analysis and machine learning to find patterns and build data-driven solutions.",
    tags: ["Python", "Statistics", "ML", "GenAI"],
    M: NeuralNet3D,
  },
];
export const WhatIBuild = () => (
  <S title="What I do" sub="Three connected areas of data work.">
    <div data-stagger className="stagger grid gap-5 md:grid-cols-3">
      {pillars.map(({ t, d, tags, M }) => (
        <div
          key={t}
          className="lift overflow-hidden rounded-2xl border border-white/10 bg-card"
        >
          <div className="h-44 bg-gradient-to-b from-accent/10 to-transparent">
            <Suspense fallback={null}>
              <M />
            </Suspense>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-accent">{t}</h3>
            <p className="mt-2 text-sm text-fg2">{d}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.map((x) => (
                <li
                  key={x}
                  className="chip rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </S>
);

export const Education = () => (
  <S id="education" title="Education">
    <Timeline
      models={["cap", "book", "book"]}
      items={education.map((e) => (
        <div
          key={e.degree}
          className="lift rounded-2xl border border-white/10 bg-card p-5"
        >
          <p className="font-mono text-xs text-cyan">{e.years}</p>
          <h3 className="mt-1 font-semibold">{e.degree}</h3>
          <p className="text-sm text-fg2">{e.school}</p>
          <p className="mt-3 inline-block rounded-full bg-accent/15 px-3 py-1 font-mono text-xs text-accent">
            {e.score}
          </p>
        </div>
      ))}
    />
  </S>
);

const DATA_REPOS = [
  "Data-Analyst",
  "Data-Analytics-Projects",
  "AWS-DA",
  "Databricks-Projects",
  "Databricks",
];
interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  html_url: string;
}
export function GitHub() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    fetch(
      "https://api.github.com/users/OmkarYelsange/repos?sort=pushed&per_page=50",
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Repo[]) => {
        const f = d.filter((r) => DATA_REPOS.includes(r.name));
        if (!f.length) throw new Error("none");
        setRepos(f.slice(0, 6));
        setState("ok");
      })
      .catch(() => setState("error"));
  }, []);
  return (
    <S
      title="GitHub"
      sub="Data repositories: code is where the implementation lives."
      model="git"
    >
      {state === "loading" && (
        <p className="text-fg2" role="status">
          Loading repositories…
        </p>
      )}
      {state === "error" && (
        <p className="text-fg2">
          Couldn't load repositories right now. Browse them on{" "}
          <a className="text-accent underline" href={siteConfig.social.github}>
            GitHub
          </a>
          .
        </p>
      )}
      <div
        data-stagger
        className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {repos.map((r) => (
          <a
            key={r.id}
            href={r.html_url}
            target="_blank"
            rel="noreferrer"
            className="lift rounded-2xl border border-white/10 bg-card p-5 transition hover:border-accent/50"
          >
            <h3 className="font-mono text-sm font-semibold">{r.name}</h3>
            <p className="mt-2 text-sm text-fg2">
              {r.description ?? "No description."}
            </p>
            <p className="mt-4 flex gap-4 text-xs text-muted">
              <span>{r.language ?? "—"}</span>
              <span className="flex items-center gap-1">
                <Star size={12} />
                {r.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={12} />
                {r.forks_count}
              </span>
              <span>Updated {new Date(r.pushed_at).toLocaleDateString()}</span>
            </p>
          </a>
        ))}
      </div>
      <Heatmap />
    </S>
  );
}

export const posts: { title: string; url: string }[] = []; // TODO: add real articles (title + url)
export const Blog = () =>
  posts.length === 0 ? null : (
    <S
      title="From my notebook"
      sub="Technical articles, experiments and lessons from working with data."
    >
      {posts.length === 0 ? (
        <p className="text-muted">Articles are coming soon.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.url}>
              <a
                className="block lift rounded-2xl border border-white/10 bg-card p-5"
                href={p.url}
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </S>
  );

const Shape3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.Shape3D })),
);
export const ResumeCTA = () => (
  <S
    title="Ready to work with data?"
    sub="Explore my resume to learn more about my experience, projects and technical background."
  >
    <div className="grid items-center gap-6 md:grid-cols-2">
      <div className="flex gap-3 text-sm font-semibold">
        <a
          className="rounded-lg btn-shine bg-gradient-to-r from-accent to-cyan px-5 py-3 text-bg transition hover:brightness-110"
          href={siteConfig.resume}
          target="_blank"
          rel="noreferrer"
        >
          View resume
        </a>
        <a
          className="rounded-lg border border-white/15 px-5 py-3"
          href={siteConfig.resume}
          download
        >
          Download resume
        </a>
      </div>
      <Suspense fallback={<div className="h-56" />}>
        <Shape3D kind="ico" />
      </Suspense>
    </div>
  </S>
);

export const OtherWorkTeaser = () => (
  <S
    title="Beyond data"
    sub="My primary focus is data, and I also bring a broader multidisciplinary engineering background."
  >
    <div className="lift flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-transparent to-cyan/10 p-6 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold">
          Other Work: full stack, robotics, IoT and hardware
        </p>
        <p className="mt-1 max-w-[60ch] text-sm text-fg2">
          Web applications, a final-year IoT monitoring project, sensors and
          embedded builds, kept on a separate page so you can explore them if
          you like.
        </p>
      </div>
      <Link
        to="/other-work"
        className="btn-shine shrink-0 rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 text-sm font-semibold text-bg"
      >
        Explore Other Work →
      </Link>
    </div>
  </S>
);
