import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minimize2, X } from 'lucide-react'
import { dataProjects, otherProjects, projects } from '../data/projects'
import { usePageContext } from '../lib/pageContext'
import { skills } from '../data/skills'
import { experience } from '../data/experience'
import { education } from '../data/education'
import { certifications, cocurricular } from '../data/achievements'
import { siteConfig } from '../data/siteConfig'
import { askAssistant } from '../lib/assistant'

type Line = { k: 'in' | 'out' | 'err'; t: string }
type Cmd = (a: string[]) => string[] | Promise<string[]> | void
const sections = ['about', 'work', 'skills', 'experience', 'education', 'certifications', 'activities', 'github', 'contact']
const banner: Line[] = ['Omkar Yelsange: Data Analytics · Data Engineering · Data Science', "Type 'help' for commands. Try: projects, goto experience, ask what is your current role", ''].map(t => ({ k: 'out', t }))

export default function Terminal() {
  const ctx = usePageContext(); const [open, setOpen] = useState(false); const [big, setBig] = useState(false); const [lines, setLines] = useState<Line[]>(banner); const [val, setVal] = useState('')
  const hist = useRef<string[]>([]); const hi = useRef(-1); const inp = useRef<HTMLInputElement>(null); const end = useRef<HTMLDivElement>(null); const nav = useNavigate()
  const go = (id: string) => { nav('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120) }
  const theme = (t: 'dark' | 'light') => window.dispatchEvent(new CustomEvent('set-theme', { detail: t }))
  const show = (id: string, out: string[]): Cmd => () => { go(id); return out }

  const cmds: Record<string, Cmd> = {
    help: () => ['about · work · skills · experience · education · certifications · activities · contact   print a section and jump to it', 'projects                 list projects      open <id>   open a case study', 'goto <section>          ' + sections.join(' | '), 'ask <question>          ask the AI assistant', 'theme dark|light        other (Other Work) · home (data portfolio) · resume · github · linkedin · neofetch · clear · max · min · exit', 'Tab autocompletes, ↑/↓ browse history.'],
    whoami: () => ['omkar: Data Analyst @ Autoline Industries Ltd. (June 2026 – present)'],
    neofetch: () => ['  ┌──────────┐   omkar@portfolio', '  │ ▂ ▅ ▇ ▆ │   ───────────────', '  │ DATA LAB │   role: Data Analyst | Data Engineer', '  └──────────┘   stack: Python, SQL, Power BI, Databricks, PySpark, AWS', '                 location: Pune, India'],
    about: show('about', ['Data Analyst at Autoline Industries Ltd. B.E. Robotics & Automation Engineering. Interested in turning raw data into reliable pipelines, dashboards and decisions.']),
    work: show('work', dataProjects.map(p => `${p.id.padEnd(18)} ${p.title}`)),
    other: () => { nav('/other-work'); window.scrollTo({ top: 0 }); return [...otherProjects.map(p => `${p.id.padEnd(18)} ${p.title} [${p.category}]`), '', 'Back to the data portfolio: type `home`'] },
    home: () => { nav('/'); window.scrollTo({ top: 0 }); return ['→ main data portfolio'] },
    projects: () => { const list = ctx === 'other' ? otherProjects : dataProjects; return [...list.map(p => `${p.id.padEnd(18)} ${p.title} [${p.category}]`), '', ctx === 'other' ? 'open <id> for a case study · `home` returns to the data portfolio' : 'open <id> for a case study · `other` shows full stack, IoT and hardware work'] },
    skills: show('skills', Object.entries(skills).map(([g, i]) => `${g.padEnd(17)} ${i.join(', ')}`)),
    experience: show('experience', experience.map(e => `${(e.dates || 'dates n/a').padEnd(22)} ${e.role} @ ${e.company}`)),
    certifications: show('certifications', certifications.map(c => `${c.date.padEnd(11)} ${c.title}`)),
    activities: show('activities', cocurricular.map(a => `${a.title}: ${a.detail}`)),
    education: show('education', education.map(e => `${e.years.padEnd(13)} ${e.degree}: ${e.school} (${e.score})`)),
    contact: show('contact', [`email     ${siteConfig.email}`, `github    ${siteConfig.social.github}`, `linkedin  ${siteConfig.social.linkedin}`]),
    goto: a => { const id = a[0]?.toLowerCase(); if (!id || !sections.includes(id)) return ['usage: goto <' + sections.join('|') + '>']; go(id); return [`→ ${id}`] },
    open: a => { const p = projects.find(x => x.id === a[0]?.toLowerCase()); if (!p) return ['usage: open <id>  (run `projects` for ids)']; nav(`/projects/${p.id}`); setOpen(false); return [] },
    theme: a => { if (a[0] !== 'dark' && a[0] !== 'light') return ['usage: theme dark|light']; theme(a[0]); return [`theme set to ${a[0]}`] },
    resume: () => { window.open(siteConfig.resume); return ['opening resume…'] },
    github: () => { window.open(siteConfig.social.github); return ['opening GitHub…'] },
    linkedin: () => { window.open(siteConfig.social.linkedin); return ['opening LinkedIn…'] },
    ask: async a => { if (!a.length) return ['usage: ask <question>']; const r = await askAssistant([{ role: 'user', text: a.join(' ') }], ctx); return [...r.text.split('\n'), ...(r.action ? [`→ ${r.action.label}: type \`${r.action.to === '/' ? 'home' : 'other'}\``] : [])] },
    max: () => { setBig(true) },
    min: () => { setBig(false) },
    clear: () => { setLines([]) },
    exit: () => { setOpen(false) },
  }

  async function run(raw: string) {
    const text = raw.trim(); setLines(l => [...l, { k: 'in', t: text }]); if (!text) return
    hist.current.unshift(text); hi.current = -1
    const [c, ...a] = text.split(/\s+/); const fn = cmds[c.toLowerCase()]
    if (!fn) return setLines(l => [...l, { k: 'err', t: `command not found: ${c}. Type 'help'.` }])
    const r = await fn(a); if (Array.isArray(r)) setLines(l => [...l, ...r.map(t => ({ k: 'out' as const, t }))])
  }
  useEffect(() => {
    const tog = () => setOpen(o => !o)
    const key = (e: KeyboardEvent) => { const tag = (e.target as HTMLElement).tagName; if (e.key === '`' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); tog() } if (e.key === 'Escape') setOpen(false) }
    addEventListener('toggle-terminal', tog); addEventListener('keydown', key); return () => { removeEventListener('toggle-terminal', tog); removeEventListener('keydown', key) }
  }, [])
  useEffect(() => { if (open) setTimeout(() => inp.current?.focus(), 150) }, [open])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [lines, open])

  return (
    <AnimatePresence>{open && (
      <motion.div role="dialog" aria-label="Terminal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className={`fixed inset-x-0 bottom-0 z-[80] mx-auto flex w-full flex-col overflow-hidden rounded-t-xl border border-white/15 bg-bg2 font-mono text-[13px] text-fg shadow-2xl backdrop-blur transition-[height,max-width] duration-300 sm:text-sm ${big ? "h-[100dvh] max-w-none rounded-none" : "h-[min(58dvh,520px)] max-w-[1100px] sm:w-[calc(100%-1.5rem)]"}`} onClick={() => inp.current?.focus()}>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2"><span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" /><span className="ml-3 text-xs text-muted">omkar@portfolio: ~</span><button aria-label={big ? "Restore terminal size" : "Maximize terminal"} onClick={e => { e.stopPropagation(); setBig(b => !b) }} className="ml-auto text-muted hover:text-fg">{big ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button><button aria-label="Close terminal" onClick={() => setOpen(false)} className="ml-2 text-muted hover:text-fg"><X size={16} /></button></div>
        <div className="flex-1 overflow-auto px-4 py-3" aria-live="polite">
          {lines.map((l, i) => <pre key={i} className={`whitespace-pre-wrap break-words font-mono ${l.k === 'in' ? 'text-fg' : l.k === 'err' ? 'text-red-400' : 'text-fg2'}`}>{l.k === 'in' ? <><span className="text-accent">$ </span>{l.t}</> : l.t}</pre>)}
          <div className="flex items-center gap-2"><span className="text-accent">$</span>
            <input ref={inp} value={val} onChange={e => setVal(e.target.value)} aria-label="Terminal input" autoComplete="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent text-[16px] text-fg caret-accent outline-none sm:text-sm"
              onKeyDown={e => {
                if (e.key === 'Enter') { run(val); setVal('') }
                else if (e.key === 'ArrowUp') { e.preventDefault(); hi.current = Math.min(hi.current + 1, hist.current.length - 1); setVal(hist.current[hi.current] ?? '') }
                else if (e.key === 'ArrowDown') { e.preventDefault(); hi.current = Math.max(hi.current - 1, -1); setVal(hist.current[hi.current] ?? '') }
                else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(cmds).find(c => val && !val.includes(' ') && c.startsWith(val.toLowerCase())); if (m) setVal(m + ' ') }
              }} /></div>
          <div ref={end} />
        </div>
      </motion.div>)}</AnimatePresence>)
}
