import { useEffect, useState } from "react";
import { HeadModel } from "./FillModel";
import { DonutChart, KPIStat, MiniBarChart, MiniLineChart } from "./Charts";
import { dataProjects as projects } from "../data/projects";

export function TechMatrix() {
  const map = new Map<string, string[]>();
  projects.forEach((p) =>
    p.technologies.forEach((t) => map.set(t, [...(map.get(t) ?? []), p.title])),
  );
  const rows = [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 12);
  return (
    <section
      className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20"
      aria-labelledby="tm"
    >
      <HeadModel kind="db" />
      <h2 id="tm" className="text-2xl font-bold sm:text-3xl">
        Technologies by Project
      </h2>
      <p className="mt-2 text-fg2">
        The twelve data tools I use most, and where each was used.
      </p>
      <dl data-stagger className="stagger mt-8 grid gap-3 sm:grid-cols-2">
        {rows.map(([t, ps]) => (
          <div
            key={t}
            className="rounded-xl border border-white/10 bg-card p-4"
          >
            <dt className="font-mono text-sm text-accent">{t}</dt>
            <dd className="mt-1 text-sm text-fg2">{ps.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

interface Day {
  date: string;
  count: number;
  level: number;
}
const shade = [
  "bg-white/5",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];
export function Heatmap() {
  const [days, setDays] = useState<Day[]>([]);
  const [st, setSt] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    fetch(
      "https://github-contributions-api.jogruber.de/v4/OmkarYelsange?y=last",
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { contributions: Day[] }) => {
        setDays(d.contributions.slice(-182));
        setSt("ok");
      })
      .catch(() => setSt("error"));
  }, []);
  if (st === "loading")
    return (
      <p className="mt-8 text-sm text-fg2" role="status">
        Loading contribution activity…
      </p>
    );
  if (st === "error")
    return (
      <p className="mt-8 text-sm text-muted">
        Contribution activity is unavailable right now.
      </p>
    );
  const total = days.reduce((s, d) => s + d.count, 0);
  return (
    <figure className="mt-10">
      <div className="overflow-x-auto">
        <div
          className="grid grid-flow-col grid-rows-7 gap-1"
          style={{ width: "max-content" }}
          role="img"
          aria-label={`${total} contributions in the last six months`}
        >
          {days.map((d) => (
            <span
              key={d.date}
              title={`${d.date}: ${d.count}`}
              className={`h-3 w-3 rounded-sm ${shade[d.level] ?? shade[0]}`}
            />
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-muted">
        {total} contributions in the last six months (data via a third-party
        GitHub contributions API).
      </figcaption>
    </figure>
  );
}

// Layout preview only. Bars are fixed decorative shapes, not project results.
export function DashboardPreview({ kpis }: { kpis: string[] }) {
  const bars = [40, 65, 50, 80, 60, 90, 70];
  return (
    <section id="dashboard" className="mt-12 scroll-mt-32" aria-labelledby="dp">
      <h2 id="dp" className="mb-1 text-xl font-bold">
        Dashboard preview
      </h2>
      <p className="mb-4 text-sm text-muted">
        Illustrative layout only. These shapes are not real project data; add
        screenshots in <code className="font-mono">public/projects/</code>.
      </p>
      <div className="rounded-2xl border border-dashed border-white/15 bg-card p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((k) => (
            <KPIStat key={k} label={k} />
          ))}
        </div>
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-3" aria-hidden>
          <MiniBarChart data={bars} />
          <MiniLineChart data={bars} />
          <DonutChart data={[50, 30, 20]} />
        </div>
      </div>
    </section>
  );
}
