import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileText, Menu, Moon, Sparkles, Sun, Terminal, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { siteConfig } from '../data/siteConfig'

const mainLinks = [['About', '/#about'], ['Skills', '/#skills'], ['Experience', '/#experience'], ['Projects', '/#work'], ['Contact', '/#contact']]
const otherLinks = [['Skills', '#other-skills'], ['Experience', '#other-experience'], ['Projects', '#other-projects'], ['Contact', '/#contact']]
const fire = (n: string) => () => window.dispatchEvent(new Event(n))
const btn = 'inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs text-fg2 transition hover:border-accent hover:text-fg'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, toggle] = useTheme()
  const isOther = useLocation().pathname.startsWith('/other-work')
  const links = isOther ? otherLinks : mainLinks
  useEffect(() => { setOpen(false) }, [isOther])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const swap = isOther
    ? <Link to="/" className="btn-shine inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-cyan px-3 py-2 text-sm font-semibold text-bg"><ArrowLeft size={14} />Data Portfolio</Link>
    : <Link to="/other-work" className="btn-shine inline-flex items-center gap-1.5 rounded-lg border border-accent/60 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/20">Other Work<ArrowRight size={14} /></Link>
  return (
    <nav aria-label="Main" className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? 'border-b border-white/10 bg-bg/80 backdrop-blur' : ''}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight" aria-label="Omkar Yelsange, home">
          <span className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-accent via-cyan to-pink ring-2 ring-accent/50"><img src="/images/omkar-avatar.webp" alt="" width={36} height={36} className="h-full w-full object-cover" /></span><span>OY<span className="text-accent">.</span></span></Link>
        <a href={`mailto:${siteConfig.email}`} className="hidden rounded-full border border-white/10 bg-card px-4 py-1.5 text-sm text-fg2 hover:text-fg 2xl:block">{siteConfig.email}</a>
        <ul className="ml-auto hidden items-center gap-5 text-sm text-fg2 lg:flex">
          {links.map(([l, h]) => <li key={l}><a className="u-link hover:text-fg" href={h}>{l}</a></li>)}
          <li><a href={siteConfig.resume} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-fg hover:border-accent"><FileText size={14} />Resume</a></li>
          <li>{swap}</li>
        </ul>
        <div className="flex items-center gap-1.5">
          <button className={`${btn} hidden sm:inline-flex`} onClick={fire('toggle-terminal')} aria-label="Open terminal"><Terminal size={14} /><span className="hidden xl:inline">Terminal</span></button>
          <button className={`${btn} hidden sm:inline-flex`} onClick={fire('toggle-assistant')} aria-label="Ask the AI assistant"><Sparkles size={14} /><span className="hidden xl:inline">Ask AI</span></button>
          <button className="rounded-lg p-2 text-fg2 hover:text-fg" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="p-2 lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <ul className="border-t border-white/10 px-4 pb-4 sm:px-6 lg:hidden">
        {links.map(([l, h]) => <li key={l}><a onClick={() => setOpen(false)} className="block py-3 text-lg" href={h}>{l}</a></li>)}
        <li><a onClick={() => setOpen(false)} className="block py-3 text-lg" href={siteConfig.resume}>Resume</a></li>
        <li className="flex flex-wrap gap-2 pt-2"><span onClick={() => setOpen(false)}>{swap}</span><button className={btn} onClick={() => { setOpen(false); fire('toggle-terminal')() }}><Terminal size={14} />Terminal</button><button className={btn} onClick={() => { setOpen(false); fire('toggle-assistant')() }}><Sparkles size={14} />Ask AI</button></li>
      </ul>}
    </nav>
  )
}
