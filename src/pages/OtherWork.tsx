import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cpu, Globe2, Radio } from 'lucide-react'
import { otherCategories, otherProjects } from '../data/projects'
import { otherExperience } from '../data/experience'
import { otherSkills } from '../data/skills'
import { siteConfig } from '../data/siteConfig'
import { ProjectsSection } from '../components/Projects'
import { SkillGroups } from '../components/Skills'
import { RoleCard } from '../components/Sections'
import Timeline from '../components/Timeline'
import { Reveal } from '../components/Motion'
import { FillModel } from '../components/FillModel'

const areas = [[Globe2, 'Full Stack & Web', 'React, Next.js, Node.js, Express, Flask, Django'], [Radio, 'Robotics & IoT', 'Sensors, ESP32, Arduino, live dashboards'], [Cpu, 'Hardware & Embedded', 'Final-year monitoring system, smart-chair kit']] as const

export default function OtherWork() {
  useEffect(() => { document.title = 'Other Work: Full Stack, Robotics & IoT | Omkar Yelsange'; window.scrollTo(0, 0); return () => { document.title = 'Omkar Yelsange | Data Analytics, Data Engineering & Data Science' } }, [])
  return (
    <main className="overflow-x-clip">
      <header className="relative mx-auto grid max-w-[1400px] items-center gap-6 px-4 pb-6 pt-28 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Link to="/" className="btn-shine inline-flex items-center gap-2 rounded-full border border-white/15 bg-card px-4 py-2 text-sm hover:border-accent"><ArrowLeft size={14} />Back to Data Portfolio</Link>
          <p className="mt-8 font-mono text-xs text-cyan">OTHER WORK</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl">Beyond <span className="bg-gradient-to-r from-accent via-cyan to-pink bg-clip-text text-transparent">data</span></h1>
          <p className="mt-5 max-w-[60ch] text-lg text-fg2">My primary focus is data analytics, data engineering and data science. This page collects the full stack, robotics, IoT and hardware work from my multidisciplinary engineering background.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">{areas.map(([I, t, d]) => <li key={t} className="lift rounded-2xl border border-white/10 bg-card p-4"><I size={18} className="text-accent" /><p className="mt-2 text-sm font-semibold">{t}</p><p className="text-xs text-fg2">{d}</p></li>)}</ul>
        </div>
        <FillModel kind="chip" label="3D microchip" className="hidden h-80 lg:block" />
      </header>
      <Reveal><section id="other-skills" className="relative mx-auto max-w-[1400px] scroll-mt-20 px-4 py-14 sm:px-6"><h2 className="mb-8 text-2xl font-bold sm:text-3xl">Skills</h2><SkillGroups data={otherSkills} filler="chip" fillerClass="hidden xl:block" /></section></Reveal>
      <Reveal><section id="other-experience" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 py-14 sm:px-6"><h2 className="mb-8 text-2xl font-bold sm:text-3xl">Experience</h2>
        <Timeline models={['code']} items={otherExperience.map(e => <RoleCard key={e.company + e.role} e={e} />)} /></section></Reveal>
      <ProjectsSection id="other-projects" eyebrow="SOFTWARE, WEB & HARDWARE" title="Projects" items={otherProjects} cats={otherCategories} model="code"
        intro="Web applications and hardware projects, each with a case study covering the problem, approach, solution, result, benefits and how it differs from usual methods." />
      <Reveal><section className="mx-auto max-w-[1400px] px-4 pb-24 pt-6 sm:px-6"><div className="lift flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-transparent to-cyan/10 p-6 sm:flex-row sm:items-center">
        <div><p className="text-lg font-semibold">Back to the main portfolio</p><p className="text-sm text-fg2">Data analytics, data engineering and data science projects, skills and experience.</p></div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold"><Link to="/" className="btn-shine rounded-lg bg-gradient-to-r from-accent to-cyan px-5 py-3 text-bg">← Back to Data Portfolio</Link><a href={siteConfig.resume} className="btn-shine rounded-lg border border-white/20 px-5 py-3">Resume</a><a href="/#contact" className="btn-shine rounded-lg border border-white/20 px-5 py-3">Contact</a></div></div></section></Reveal>
    </main>)
}
