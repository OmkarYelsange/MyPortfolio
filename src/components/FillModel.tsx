import { lazy, Suspense } from 'react'
import type { ModelKind } from './Scenes'

const Model3D = lazy(() => import('./Scenes').then(m => ({ default: m.Model3D })))

// Lazy 3D model that fills its parent. Pointer events are disabled so it never blocks content.
export function FillModel({ kind, label, className = '' }: { kind: ModelKind; label?: string; className?: string }) {
  return <div className={`pointer-events-none ${className}`}><Suspense fallback={null}><Model3D kind={kind} label={label} /></Suspense></div>
}
// Decorative model at the right of a section heading (large screens only).
export const HeadModel = ({ kind }: { kind: ModelKind }) => <FillModel kind={kind} className="absolute right-6 top-6 hidden h-40 w-40 lg:block xl:right-16 xl:h-48 xl:w-48" />
export type { ModelKind }
