import { BarChart3, Brain, Cloud, Code2, Database, FileSpreadsheet, Filter, Gauge, Layers, LineChart, Radio, Sparkles, Workflow, type LucideIcon } from 'lucide-react'
import { FillModel, type ModelKind } from './FillModel'
import { brandIcons } from '../data/skillIcons'
import { otherSkills, skills } from '../data/skills'

// Skills without a brand glyph in the icon set get a themed lucide icon in the brand's colour.
const fallback: Record<string, [LucideIcon, string]> = {
  'Power BI': [BarChart3, '#F2C811'], Excel: [FileSpreadsheet, '#33C481'], Tableau: [BarChart3, '#E97627'], DAX: [FileSpreadsheet, '#F2C811'], SQL: [Database, '#38BDF8'], EDA: [LineChart, '#8B7CFF'],
  'Data Cleaning': [Filter, '#38BDF8'], 'Data Visualization': [BarChart3, '#F472B6'], 'KPI Analysis': [Gauge, '#34D399'], 'Delta Lake': [Layers, '#00ADD4'], 'AWS S3': [Cloud, '#FF9900'], 'AWS Glue': [Cloud, '#FF9900'], 'AWS Athena': [Cloud, '#FF9900'],
  'ETL / ELT': [Workflow, '#8B7CFF'], 'Data Warehousing': [Database, '#38BDF8'], 'Medallion Architecture': [Layers, '#F5C542'], Statistics: [LineChart, '#34D399'], 'Machine Learning': [Brain, '#F472B6'], NLP: [Brain, '#8B7CFF'],
  'Generative AI': [Sparkles, '#F472B6'], 'VS Code': [Code2, '#3B9CFF'], CSS: [Code2, '#38A9F0'], Blynk: [Radio, '#23C48E'], Sensors: [Radio, '#38BDF8'], 'Load cells': [Gauge, '#F59E0B'],
}

export function SkillIcon({ name }: { name: string }) {
  const b = brandIcons[name]
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-900/90 ring-1 ring-white/10" aria-hidden>
      {b ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill={b.c ? '#fff' : b.h}><path d={b.p} /></svg> : (() => { const [I, c] = fallback[name] ?? [Code2, '#8B7CFF']; return <I size={16} color={c} /> })()}
    </span>)
}

export const SkillChip = ({ name }: { name: string }) => (
  <li className="chip inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm text-fg"><SkillIcon name={name} />{name}</li>)

export function SkillGroups({ data, filler, fillerClass = '' }: { data: Record<string, string[]>; filler?: ModelKind; fillerClass?: string }) {
  return (
    <div data-stagger className="stagger grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(data).map(([g, items]) => (
        <div key={g} className="lift rounded-2xl border border-white/10 bg-card p-5"><h3 className="font-semibold text-accent">{g}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">{items.map(i => <SkillChip key={i} name={i} />)}</ul></div>))}
      {filler && <div className={`min-h-[12rem] ${fillerClass}`}><FillModel kind={filler} className="h-full min-h-[12rem] w-full" /></div>}
    </div>)
}

export const dataSkillGroups = skills
export const otherSkillGroups = otherSkills
