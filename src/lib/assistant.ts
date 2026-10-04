import kb from '../data/knowledge.json'

export type PageCtx = 'data' | 'other'
export interface Action { label: string; to: string }
export interface Msg { role: 'user' | 'assistant'; text: string; action?: Action }
export interface QA { group: string; q: string; keywords: string; a: string; ctx: 'data' | 'other' | 'both'; pop?: boolean }
interface Line { t: string; ctx: 'data' | 'other' | 'both' }

const allQA = kb.qa as QA[]
const allLines = kb.profile as Line[]
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const fits = (c: QA['ctx'], page: PageCtx) => c === 'both' || c === page

// Questions shown for a page: page-specific entries win over shared ones with the same wording.
export function questionsFor(page: PageCtx): QA[] {
  const mine = allQA.filter(x => fits(x.ctx, page)); const seen = new Map<string, QA>()
  for (const x of mine) { const k = norm(x.q); const cur = seen.get(k); if (!cur || (cur.ctx === 'both' && x.ctx !== 'both')) seen.set(k, x) }
  return [...seen.values()]
}
export const groupsFor = (page: PageCtx) => [...new Set(questionsFor(page).map(x => x.group))]

// ---- domain routing: keep each page's assistant inside its own context ----
const OTHER_RE = /\b(robot\w*|iot|hardware|embedded|esp32|arduino|blynk|full[- ]?stack|react|next\.?js|node(\.?js)?|express|firebase|flask|django|front-?end|back-?end|web ?(app|apps|site|development|dev)|chat ?app|clones?|e-?commerce|voting|downloader|deepseek|sams|chair|microcontroller|circuit)\b/i
const DATA_RE = /\b(data (analy\w*|engineer\w*|scien\w*)|analytics|sql|power ?bi|tableau|excel|databricks|pyspark|spark|aws|glue|athena|etl|elt|pipelines?|warehouse|lakehouse|eda|dashboards?|kpi|machine learning|statistics|medallion|goodcabs|ola|zepto|blinkit|bi)\b/i
export const OTHER_PAGE: Action = { label: 'Explore Other Work', to: '/other-work' }
export const DATA_PAGE: Action = { label: 'Back to Data Portfolio', to: '/' }

export function redirectFor(q: string, page: PageCtx): { text: string; action: Action } | null {
  const other = OTHER_RE.test(q); const data = DATA_RE.test(q.replace(/air\s?bnb clone/i, ''))
  if (page === 'data' && other && !data) return { text: 'My primary portfolio focuses on Data Analytics, Data Engineering and Data Science. I also have additional experience in Full Stack Development, Robotics and IoT, which you can explore in the Other Work section.', action: OTHER_PAGE }
  if (page === 'other' && data && !other) return { text: 'This page covers my Full Stack, Robotics, IoT and hardware work. My main focus (Data Analytics, Data Engineering and Data Science) is on the main portfolio.', action: DATA_PAGE }
  return null
}

// ---- retrieval (offline fallback and instant answers) ----
const stop = new Set('you your the and what are how can does did about tell with know for have has this that who which any please me my is it do was were will would could should there their from into on in of to a an at be been being'.split(' '))
const syn: Record<string, string> = { cv: 'resume', job: 'role', jobs: 'role', employer: 'company', college: 'education', university: 'education', studies: 'education', study: 'education', marks: 'percentage', percent: 'percentage', score: 'percentage', tools: 'skills', tech: 'skills', stack: 'skills', technologies: 'skills', repo: 'github', repos: 'github', repository: 'github', ctc: 'salary', pay: 'salary', hire: 'contact', reach: 'contact', mail: 'email', number: 'phone', projects: 'project', internships: 'internship', certifications: 'certification', certificates: 'certification', awards: 'achievements', award: 'achievements', worked: 'experience', location: 'based', live: 'based', city: 'based', pyspark: 'databricks', spark: 'databricks', glue: 'aws', athena: 'aws', s3: 'aws', quicksight: 'aws', tableau: 'powerbi', power: 'powerbi' }
const toks = (s: string) => norm(s).split(' ').filter(w => w.length > 1 && !stop.has(w)).map(w => syn[w] ?? w)
const cache: Partial<Record<PageCtx, { idx: { x: QA; k: Set<string>; q: Set<string>; a: Set<string> }[]; lines: { t: string; k: Set<string> }[] }>> = {}
function indexFor(page: PageCtx) {
  return cache[page] ??= {
    idx: questionsFor(page).map(x => ({ x, k: new Set(toks(x.keywords)), q: new Set(toks(x.q)), a: new Set(toks(x.a)) })),
    lines: allLines.filter(l => fits(l.ctx, page)).flatMap(l => l.t.split(/(?<=\.)\s+/)).map(t => ({ t, k: new Set(toks(t)) })),
  }
}

export function matchPredefined(q: string, page: PageCtx) { return questionsFor(page).find(x => norm(x.q) === norm(q))?.a }

export function localAnswer(q: string, page: PageCtx): string {
  const n = norm(q)
  if (/^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/.test(n)) return "Hi! I'm Omkar's assistant. Ask me about his experience, projects, skills, education or how to contact him."
  if (/\b(thanks|thank you|thx)\b/.test(n)) return "You're welcome! Anything else you'd like to know?"
  const t = [...new Set(toks(q))]; const { idx, lines } = indexFor(page)
  let best = { s: 0, a: '' }
  for (const e of idx) { let s = 0; for (const w of t) { if (e.k.has(w)) s += 3; if (e.q.has(w)) s += 2; if (e.a.has(w)) s += 1 } if (s > best.s) best = { s, a: e.x.a } }
  if (best.s >= 4) return best.a
  const ranked = lines.map(l => ({ l, s: t.filter(w => l.k.has(w)).length })).filter(r => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 2)
  if (ranked.length) return ranked.map(r => r.l.t).join(' ')
  return "I don't have that information yet. You can ask about Omkar's experience, projects, skills or education, or email omkaryelsange1010@gmail.com."
}

// Predefined questions answer instantly; off-context questions get a pointer to the other page; everything else goes to Gemini (/api/chat) with the offline matcher as fallback.
export async function askAssistant(history: Msg[], page: PageCtx): Promise<{ text: string; action?: Action }> {
  const last = history[history.length - 1].text
  const canned = matchPredefined(last, page); if (canned) return { text: canned }
  const redirect = redirectFor(last, page); if (redirect) return redirect
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: page, messages: history.slice(-8).map(m => ({ role: m.role, text: m.text })) }) })
    if (r.ok && (r.headers.get('content-type') ?? '').includes('json')) { const d = await r.json(); if (d.reply) return { text: d.reply } }
  } catch { /* fall through */ }
  return { text: localAnswer(last, page) }
}
