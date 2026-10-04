import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { FillModel } from "./FillModel";

const HeroWorld = lazy(() => import("./HeroWorld"));

const roles = ["Data Analytics", "Data Engineering", "Data Science"];

const stack = [
  "Python",
  "SQL",
  "Power BI",
  "Databricks",
  "AWS",
  "ETL",
  "Data Pipelines",
  "PySpark",
  "Tableau",
  "Excel",
  "EDA",
  "Machine Learning",
];

const rise = (d: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: d,
    duration: 0.65,
    ease: "easeOut" as const,
  },
});

const icon =
  "chip grid h-10 w-10 place-items-center rounded-full border border-white/15 text-fg2 hover:border-accent hover:text-accent";

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % roles.length), 2200);

    return () => clearInterval(t);
  }, []);

  return (
    <header
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ================= BACKGROUND ================= */}
      <div className="grid-bg absolute inset-0" aria-hidden />

      {/* ================= HERO CONTENT ================= */}
      <div
        className="
          relative
          z-10
          mx-auto
          grid
          w-full
          max-w-[1350px]
          grid-cols-1
          gap-y-8
          px-4
          pt-24
          sm:px-6
          sm:pt-28
          lg:grid-cols-2
          lg:items-center
          lg:gap-x-10
          lg:gap-y-6
        "
      >
        {/* ================= LEFT: NAME ================= */}
        <div className="text-center lg:col-start-1 lg:row-start-1 lg:self-center lg:text-left">
          <motion.p
            {...rise(0)}
            className="
              inline-flex
              max-w-full
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-card
              px-3
              py-1
              text-xs
              text-fg2
            "
          >
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />

            <span className="truncate">
              Data Analyst · Autoline Industries Ltd.
            </span>
          </motion.p>

          <motion.p
            {...rise(0.1)}
            className="mt-4 text-xl text-cyan sm:text-3xl"
          >
            Hello! I'm
          </motion.p>

          {/* NAME */}
          <motion.h1
            {...rise(0.2)}
            className="
              text-[clamp(2.4rem,13vw,4.25rem)]
              font-extrabold
              uppercase
              leading-[0.95]
              tracking-tight
              sm:text-7xl
              lg:text-[clamp(2.6rem,4.6vw,5.5rem)]
            "
          >
            Omkar
            <br />
            Yelsange
          </motion.h1>
        </div>

        {/* ================= RIGHT: ROLES ================= */}
        <motion.div
          {...rise(0.4)}
          className="
            text-center
            lg:col-start-2
            lg:row-span-2
            lg:row-start-1
            lg:self-center
            lg:text-right
          "
          aria-label="Roles"
        >
          <p
            className="
              text-xl
              text-cyan
              sm:text-3xl
              lg:mb-1
            "
          >
            Focused on
          </p>

          {roles.map((r, k) => (
            <p
              key={r}
              className={`
                bg-gradient-to-r
                from-accent
                via-cyan
                to-pink
                bg-clip-text
                text-[clamp(2rem,10vw,3.5rem)]
                font-extrabold
                uppercase
                leading-[0.95]
                tracking-tight
                text-transparent
                transition-all
                duration-500
                sm:text-6xl
                lg:whitespace-nowrap
                lg:text-[clamp(2rem,3.6vw,4.2rem)]
                ${k === i ? "opacity-100" : "opacity-25"}
              `}
            >
              {r}
            </p>
          ))}
        </motion.div>

        {/* ================= LEFT: DESCRIPTION + BUTTONS ================= */}
        <div className="text-center lg:col-start-1 lg:row-start-2 lg:self-start lg:text-left">
          <motion.p
            {...rise(0.35)}
            className="
              mx-auto
              max-w-[46ch]
              text-sm
              leading-relaxed
              text-fg2
              sm:text-base
              lg:mx-0
            "
          >
            I turn raw data into reliable pipelines, insights and data-driven
            solutions with Python, SQL, Power BI, Databricks and AWS.
          </motion.p>

          {/* Primary Actions */}
          <motion.div
            {...rise(0.5)}
            className="
              mt-5
              flex
              flex-wrap
              items-center
              justify-center
              gap-3
              lg:justify-start
            "
          >
            {/* Explore Work */}
            <a
              href="#work"
              className="
                btn-shine
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-gradient-to-r
                from-accent
                to-cyan
                px-5
                py-3
                font-semibold
                text-bg
              "
            >
              Explore my work
              <ArrowDown size={16} />
            </a>

            {/* Resume */}
            <a
              href={siteConfig.resume}
              className="
                btn-shine
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-white/20
                px-4
                py-3
                font-semibold
                hover:border-accent
              "
            >
              <FileText size={16} />
              Resume
            </a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            {...rise(0.6)}
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-3
              lg:justify-start
            "
          >
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={icon}
            >
              <Github size={18} />
            </a>

            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={icon}
            >
              <Linkedin size={18} />
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className={icon}
            >
              <Mail size={18} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ================= 3D SENSOR MODEL ================= */}
      <FillModel
        kind="sensor"
        label="3D live sensor telemetry waveform"
        className="absolute bottom-24 left-6 z-0 hidden h-44 w-56 2xl:block"
      />

      {/* ================= 3D NEURAL MODEL ================= */}
      <FillModel
        kind="neural"
        label="3D neural network"
        className="absolute bottom-24 right-6 z-0 hidden h-44 w-56 2xl:block"
      />

      {/* ================= MAIN 3D HERO WORLD ================= */}
      <div className="pointer-events-none relative z-0 -mt-16 min-h-[230px] w-full flex-1 sm:-mt-24 sm:min-h-[290px] lg:-mt-28 lg:min-h-[300px]">
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <HeroWorld />
          </div>
        </Suspense>
      </div>

      {/* ================= RESUME LINK ================= */}
      <a
        href={siteConfig.resume}
        className="
          u-link
          absolute
          bottom-20
          right-8
          z-10
          hidden
          items-center
          gap-2
          text-sm
          tracking-[0.3em]
          text-muted
          hover:text-fg
          xl:flex
        "
      >
        RESUME
        <FileText size={16} />
      </a>

      {/* ================= SKILLS MARQUEE ================= */}
      <div
        className="
          relative
          z-10
          mt-auto
          overflow-hidden
          border-y
          border-white/10
          bg-bg/40
          py-3
          backdrop-blur
        "
        aria-hidden
      >
        <div className="marquee font-mono text-sm text-fg2">
          {[...stack, ...stack].map((s, k) => (
            <span key={k} className="mx-6">
              {s} <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
