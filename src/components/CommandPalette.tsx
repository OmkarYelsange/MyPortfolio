import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'
import { siteConfig } from '../data/siteConfig'

export default function CommandPalette() {
  const [open, setOpen] = useState(false); const [q, setQ] = useState(''); const [i, setI] = useState(0)
  const nav = useNavigate(); const ref = useRef<HTMLInputElement>(null)
  const go = (id: string) => () => { nav('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50) }
  const items: [string, () => void][] = [['Go to Work', go('work')], ['Go to About', go('about')], ['Other Work (full stack, IoT, hardware)', () => nav('/other-work')], ['Back to Data Portfolio', () => nav('/')], ['Go to Certifications', go('certifications')], ['Go to Co-curricular', go('activities')], ['Go to Skills', go('skills')], ['Open terminal', () => window.dispatchEvent(new Event('toggle-terminal'))], ['Ask the AI assistant', () => window.dispatchEvent(new Event('toggle-assistant'))], ['Go to Experience', go('experience')], ['Contact Omkar', go('contact')],
    ['Open GitHub', () => window.open(siteConfig.social.github)], ['Download resume', () => window.open(siteConfig.resume)],
    ...projects.map(p => [`Project: ${p.title}`, () => nav(`/projects/${p.id}`)] as [string, () => void])]
  const shown = items.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()))
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o) } if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => { if (open) { setQ(''); setI(0); ref.current?.focus() } }, [open])
  if (!open) return null
  const run = (n: number) => { shown[n]?.[1](); setOpen(false) }
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-[#15152b]/40 backdrop-blur-sm p-4 pt-[15vh]" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-lg rounded-xl border border-white/10 bg-bg2" onClick={e => e.stopPropagation()}>
        <input ref={ref} value={q} onChange={e => { setQ(e.target.value); setI(0) }} placeholder="Type a command or project…" aria-label="Search commands"
          onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setI(Math.min(i + 1, shown.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI(Math.max(i - 1, 0)) } if (e.key === 'Enter') run(i) }}
          className="w-full border-b border-white/10 bg-transparent px-4 py-3 outline-none" />
        <ul role="listbox" className="max-h-72 overflow-auto p-2">
          {shown.map(([l], n) => <li key={l} role="option" aria-selected={n === i} onClick={() => run(n)} className={`cursor-pointer rounded-md px-3 py-2 text-sm ${n === i ? 'bg-accent/15 text-accent' : 'text-fg2'}`}>{l}</li>)}
          {shown.length === 0 && <li className="px-3 py-2 text-sm text-muted">No results.</li>}
        </ul>
      </div>
    </div>)
}
