import { Award, BadgeCheck, BookOpen, Trophy, Users, Sparkles, Rocket, FlaskConical } from 'lucide-react'
import { certifications, cocurricular } from '../data/achievements'
import { HeadModel, type ModelKind } from './FillModel'

const kindIcon = { Certificate: BadgeCheck, Award: Trophy, Publication: BookOpen } as const
const actIcon = [Users, Sparkles, Trophy, Award, Rocket, FlaskConical]

const S = ({ id, eyebrow, title, sub, model, children }: { id: string; eyebrow: string; title: string; sub?: string; model?: ModelKind; children: React.ReactNode }) => (
  <section id={id} className="relative mx-auto max-w-[1400px] scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">{model && <HeadModel kind={model} />}
    <p className="font-mono text-xs text-cyan">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h2>
    {sub && <p className="mt-2 max-w-[65ch] text-fg2">{sub}</p>}<div className="mt-8">{children}</div></section>)

export const Certifications = () => (
  <S id="certifications" eyebrow="CERTIFICATIONS" title="Certifications & recognition" sub="Latest first." model="medal">
    <ol data-stagger className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {certifications.map(c => { const I = kindIcon[c.kind]; return (
        <li key={c.title} className="lift flex gap-4 rounded-2xl border border-white/10 bg-card p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><I size={20} /></span>
          <div className="min-w-0"><p className="font-mono text-xs text-cyan">{c.date} · {c.kind}</p><h3 className="mt-1 font-semibold leading-snug">{c.title}</h3><p className="text-sm text-fg2">{c.issuer}</p>{c.note && <p className="mt-2 text-sm text-muted">{c.note}</p>}</div>
        </li>) })}
    </ol>
  </S>)

export const CoCurricular = () => (
  <S id="activities" eyebrow="BEYOND THE CLASSROOM" title="Co-curricular activities" model="trophy">
    <ul data-stagger className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cocurricular.map((a, i) => { const I = actIcon[i % actIcon.length]; return (
        <li key={a.title} className="lift flex gap-4 rounded-2xl border border-white/10 bg-card p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan/15 text-cyan"><I size={20} /></span>
          <div><h3 className="font-semibold">{a.title}</h3><p className="text-sm text-fg2">{a.detail}</p></div>
        </li>) })}
    </ul>
  </S>)
