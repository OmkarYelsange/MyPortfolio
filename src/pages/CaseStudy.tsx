import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { dataProjects, isData, otherProjects, projects } from '../data/projects'
import { FillModel, type ModelKind } from '../components/FillModel'
import DataPipeline, { type PipelineNodeData } from '../components/DataPipeline'

const Hero3D = lazy(() => import('../components/Hero3D'))
const arch: PipelineNodeData[] = [
  { id: 's3', label: 'AWS S3', sub: 'landing zone for raw files' }, { id: 'b', label: 'Bronze', sub: 'raw / minimally transformed' }, { id: 's', label: 'Silver', sub: 'cleaned / transformed' },
  { id: 'g', label: 'Gold', sub: 'analytics-ready datasets' }, { id: 'pbi', label: 'SQL / Power BI', sub: 'analysis and dashboards' },
]
const Empty = () => <p className="text-muted">Details will be added soon.</p>
const sideModel: Record<string, ModelKind> = { 'Data Engineering': 'db', 'Data Analytics': 'cube', 'Software / Web Development': 'code', Hardware: 'chip' }
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function SectionNav({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0][0])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-40% 0px -55% 0px' })
    items.forEach(([id]) => { const n = document.getElementById(id); if (n) io.observe(n) }); return () => io.disconnect()
  }, [items])
  return (
    <nav aria-label="Case study sections" className="sticky top-16 z-40 -mx-4 mt-8 flex gap-5 overflow-x-auto border-b border-white/10 bg-bg/80 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      {items.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id} className={`shrink-0 border-b-2 py-3 text-sm transition-colors ${active === id ? 'border-accent text-accent' : 'border-transparent text-fg2 hover:text-fg'}`}>{label}</a>)}
    </nav>)
}
const H = ({ id, n, t }: { id: string; n: string; t: string }) => <h2 id={id} className="mb-4 flex scroll-mt-32 items-baseline gap-3 text-xl font-bold sm:text-2xl"><span className="font-mono text-sm text-accent">{n}</span>{t}</h2>

export default function CaseStudy() {
  const { id } = useParams(); const [zoom, setZoom] = useState<string | null>(null)
  const idx = projects.findIndex(x => x.id === id); const p = projects[idx]
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  if (!p) return <main className="mx-auto max-w-[800px] px-6 pt-32"><p>Project not found.</p><Link to="/" className="text-accent">Back to projects</Link></main>
  const pool = isData(p) ? dataProjects : otherProjects; const pi = pool.indexOf(p); const prev = pool[(pi - 1 + pool.length) % pool.length], next = pool[(pi + 1) % pool.length]
  const nav: [string, string][] = [['problem', 'Problem'], ['approach', 'Approach'], ['solution', 'Solution'], ['result', 'Result'], ['benefits', 'Benefits'], ['different', 'Different from other methods'], ...(p.gallery.length ? [['gallery', 'Screenshots'] as [string, string]] : [])]
  return (
    <main className="mx-auto max-w-[1000px] px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
      <FillModel kind="orbit" label="3D tech orbit" className="fixed left-8 top-1/2 z-0 hidden h-52 w-52 -translate-y-1/2 2xl:block" />
      <FillModel kind={sideModel[p.category]} label="3D model for this project category" className="fixed right-8 top-1/2 z-0 hidden h-52 w-52 -translate-y-1/2 2xl:block" />
      {isData(p) ? <Link to="/#work" className="u-link inline-flex items-center gap-1 text-sm text-fg2 hover:text-fg"><ArrowLeft size={14} /> Back to data projects</Link> : <Link to="/other-work" className="u-link inline-flex items-center gap-1 text-sm text-fg2 hover:text-fg"><ArrowLeft size={14} /> Back to Other Work</Link>}
      <p className="mt-6 font-mono text-xs text-cyan">{p.category}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{p.title}</h1>
      <p className="mt-4 max-w-[70ch] text-fg2">{p.shortDescription}</p>
      <ul className="mt-5 flex flex-wrap gap-2">{p.technologies.map(t => <li key={t} className="chip rounded-md bg-white/5 px-2 py-1 font-mono text-xs">{t}</li>)}</ul>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        {p.github && !p.private ? <a href={p.github} target="_blank" rel="noreferrer" className="btn-shine inline-flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2 hover:border-accent">GitHub <ArrowUpRight size={14} /></a> : <span className="rounded-lg border border-white/15 px-4 py-2 text-muted">Private repository</span>}
        {p.extraLinks?.map(l => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-shine inline-flex items-center gap-1 rounded-lg border border-white/15 px-4 py-2 hover:border-accent">{l.label} <ArrowUpRight size={14} /></a>)}
        {p.dashboard && <a href={p.dashboard} target="_blank" rel="noreferrer" className="btn-shine rounded-lg bg-gradient-to-r from-accent to-cyan px-4 py-2 text-bg">Live dashboard</a>}
      </div>
      <figure className="mt-8 overflow-hidden lift rounded-2xl border border-white/10 bg-card">
        <img src={p.cover} alt={p.coverIsReal ? `${p.title} screenshot` : `${p.title} illustrative cover`} width={1200} height={750} decoding="async" fetchPriority="high" className="h-auto w-full object-cover" />
        <figcaption className="px-4 py-2 text-xs text-muted">{p.coverIsReal ? 'Screenshot from the project repository' : 'Illustrative cover (no screenshot available)'}</figcaption>
      </figure>
      {p.metrics.length > 0 && <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{p.metrics.map(m => <div key={m.label} className="lift rounded-xl border border-white/10 bg-card p-4"><dd className="break-words text-xl font-extrabold sm:text-2xl">{m.value}</dd><dt className="text-sm text-muted">{m.label}</dt></div>)}</dl>}
      <SectionNav items={nav} />
      <section className="mt-10"><H id="problem" n="01" t="Problem statement" />{p.problem ? <p className="max-w-[75ch] text-fg2">{p.problem}</p> : <Empty />}</section>
      <section className="mt-12"><H id="approach" n="02" t="Action approach" />
        {p.approach.length === 0 ? <Empty /> : <ol className="space-y-3">{p.approach.map((a, i) => <li key={a} className="lift flex gap-4 rounded-xl border border-white/10 bg-card p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 font-mono text-sm text-accent">{i + 1}</span><span className="text-fg2">{a}</span></li>)}</ol>}</section>
      <section className="mt-12"><H id="solution" n="03" t="Solution" />{p.solution ? <p className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-fg2">{p.solution}</p> : <Empty />}
        {p.id === 'goodcabs' && <div className="mt-6 grid items-center gap-8 md:grid-cols-2"><div className="max-w-sm"><DataPipeline nodes={arch} sources={['Raw transportation data']} /></div><Suspense fallback={null}><Hero3D /></Suspense></div>}</section>
      <section className="mt-12"><H id="result" n="04" t="Result" />
        {p.result.length === 0 ? <Empty /> : <ul className="space-y-2">{p.result.map(r => <li key={r} className="flex gap-3 text-fg2"><Check size={18} className="mt-0.5 shrink-0 text-accent" />{r}</li>)}</ul>}</section>
      <section className="mt-12"><H id="benefits" n="05" t="Benefits" />
        {p.benefits.length === 0 ? <Empty /> : <ul className="grid gap-3 sm:grid-cols-3">{p.benefits.map(b => <li key={b} className="lift rounded-xl border border-white/10 bg-card p-4 text-sm text-fg2">{b}</li>)}</ul>}</section>
      <section className="mt-12"><H id="different" n="06" t="Different from other methods" />
        {p.different.length === 0 ? <Empty /> : <ul className="space-y-3">{p.different.map(d => <li key={d} className="lift flex gap-3 rounded-xl border border-white/10 bg-card p-4 text-fg2"><ArrowRight size={18} className="mt-0.5 shrink-0 text-cyan" />{d}</li>)}</ul>}</section>
      {p.gallery.length > 0 && <section className="mt-12"><H id="gallery" n="07" t="Screenshots" />
        <ul className="grid gap-4 sm:grid-cols-2">{p.gallery.map((g, i) => <li key={g}><button onClick={() => setZoom(g)} className="group block w-full overflow-hidden rounded-xl border border-white/10 bg-card" aria-label={`Enlarge screenshot ${i + 1}`}>
          <img src={g} alt={`${p.title} screenshot ${i + 1}`} loading="lazy" decoding="async" width={1200} height={700} className="h-auto w-full transition duration-500 group-hover:scale-105" /></button></li>)}</ul></section>}
      <nav aria-label="More projects" className="mt-16 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
        <Link to={`/projects/${prev.id}`} className="lift rounded-xl border border-white/10 bg-card p-4"><span className="text-xs text-muted">← Previous</span><p className="font-semibold">{prev.title}</p></Link>
        <Link to={`/projects/${next.id}`} className="lift rounded-xl border border-white/10 bg-card p-4 sm:text-right"><span className="text-xs text-muted">Next →</span><p className="font-semibold">{next.title}</p></Link>
      </nav>
      {zoom && <div role="dialog" aria-modal="true" aria-label="Screenshot viewer" onClick={() => setZoom(null)} className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
        <button aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"><X /></button>
        <img src={zoom} alt="Enlarged project screenshot" className="max-h-[90vh] max-w-full rounded-lg" /></div>}
    </main>)
}
