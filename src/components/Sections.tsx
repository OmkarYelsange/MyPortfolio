import { skills } from "../data/skills";
import { SkillGroups } from "./Skills";
import { Link } from "react-router-dom";
import { dataExperience, type Role } from "../data/experience";
import { siteConfig } from "../data/siteConfig";
import { lazy, Suspense } from "react";
import Timeline from "./Timeline";
import { HeadModel } from "./FillModel";
import ContactForm from "./ContactForm";

const Shape3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.Shape3D })),
);
const Globe3D = lazy(() =>
  import("./Scenes").then((m) => ({ default: m.Globe3D })),
);
const S = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20"
  >
    <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{title}</h2>
    {children}
  </section>
);

export const Skills = () => (
  <S id="skills" title="Skills & Tech Stack">
    <HeadModel kind="globe" />
    <p className="-mt-4 mb-8 max-w-[65ch] text-fg2">
      Data-first toolkit: analytics and BI, data engineering and cloud,
      programming and databases, and data science.
    </p>
    <SkillGroups data={skills} filler="orbit" />
  </S>
);

export const RoleCard = ({ e }: { e: Role }) => (
  <div className="lift rounded-2xl border border-white/10 bg-card p-5">
    <div className="flex flex-wrap items-center gap-2">
      <h3 className="font-semibold">{e.role}</h3>
      <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-fg2">
        {e.type}
      </span>
      {e.current && (
        <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
          Current
        </span>
      )}
    </div>
    <p className="text-fg2">{e.company}</p>
    <p className="font-mono text-sm text-cyan">
      {e.dates || "Dates to be added"}
    </p>
    {e.points.length > 0 ? (
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fg2">
        {e.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-muted">Details to be added.</p>
    )}
    {e.tech.length > 0 && (
      <ul className="mt-3 flex flex-wrap gap-2">
        {e.tech.map((t) => (
          <li
            key={t}
            className="chip rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-fg2"
          >
            {t}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const Experience = () => (
  <S id="experience" title="Experience">
    <Timeline
      models={["sensor", "gantt"]}
      items={dataExperience.map((e) => (
        <RoleCard key={e.company + e.role} e={e} />
      ))}
    />
    <p className="mt-8 text-sm text-fg2">
      I also completed a Full Stack Development internship: see{" "}
      <Link to="/other-work" className="u-link text-accent">
        Other Work
      </Link>
      .
    </p>
  </S>
);

export const Contact = () => (
  <S id="contact" title="Let's connect">
    <p className="max-w-[60ch] text-fg2">
      Have an opportunity, project, or collaboration involving data? I'd love to
      hear from you.
    </p>
    <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
      <a
        className="rounded-lg btn-shine bg-gradient-to-r from-accent to-cyan px-5 py-3 text-bg"
        href={`mailto:${siteConfig.email}`}
      >
        Email me
      </a>
      <a
        className="rounded-lg border border-white/15 px-5 py-3"
        href={siteConfig.social.github}
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
      {siteConfig.social.linkedin && (
        <a
          className="rounded-lg border border-white/15 px-5 py-3"
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      )}
    </div>
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <ContactForm />
      <Suspense fallback={<div className="h-56" />}>
        <Shape3D kind="torus" />
      </Suspense>
    </div>
  </S>
);

export const Footer = () => (
  <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-muted">
    <p className="text-fg">{siteConfig.name}</p>
    <p className="mt-1">Data Analytics · Data Engineering · Data Science</p>
    <nav
      aria-label="Footer"
      className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2"
    >
      <a className="u-link hover:text-fg" href="/#about">
        About
      </a>
      <a className="u-link hover:text-fg" href="/#work">
        Projects
      </a>
      <a className="u-link hover:text-fg" href="/#contact">
        Contact
      </a>
      <Link className="u-link hover:text-fg" to="/other-work">
        Other Work
      </Link>
      <a className="u-link hover:text-fg" href={siteConfig.resume}>
        Resume
      </a>
    </nav>
    <p className="mt-4">
      {siteConfig.location} · © 2026 · Built with React + Vite + Tailwind
    </p>
  </footer>
);
