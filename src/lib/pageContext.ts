import { useLocation } from 'react-router-dom'
import { isData, projects } from '../data/projects'
import type { PageCtx } from './assistant'

// Which part of the portfolio the visitor is viewing: the main data portfolio or the Other Work area.
export function usePageContext(): PageCtx {
  const { pathname } = useLocation()
  if (pathname.startsWith('/other-work')) return 'other'
  const m = pathname.match(/^\/projects\/([^/]+)/)
  if (m) { const p = projects.find(x => x.id === m[1]); if (p) return isData(p) ? 'data' : 'other' }
  return 'data'
}
