import { useEffect, type RefObject } from 'react'
import * as THREE from 'three'

export type Ctx = { scene: THREE.Scene; cam: THREE.PerspectiveCamera; track: (d: { dispose(): void }) => void }
export const palette = () => (document.documentElement.dataset.theme === 'light' ? ['#5B47E0', '#0284C7', '#DB2777'] : ['#8B7CFF', '#38BDF8', '#F472B6'])
export const accent = () => palette()[0]

// Shared three.js boilerplate. The WebGL renderer exists only while the element is on (or near) the screen and is released when it
// scrolls away, so a page with many 3D models never exceeds the browser's WebGL-context limit.
export function useScene(ref: RefObject<HTMLDivElement | null>, build: (c: Ctx) => (dt: number) => void, fov = 45, z = 8) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let stop: (() => void) | null = null
    const start = () => {
      let r: THREE.WebGLRenderer
      try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return null }
      r.setPixelRatio(Math.min(devicePixelRatio, 1.5)); Object.assign(r.domElement.style, { position: 'absolute', inset: '0' }); el.appendChild(r.domElement)
      const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 100); cam.position.z = z
      const ds: { dispose(): void }[] = []
      const update = build({ scene, cam, track: d => ds.push(d) })
      const size = () => { const w = el.clientWidth || 1, h = el.clientHeight || 1; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix() }
      size(); const ro = new ResizeObserver(size); ro.observe(el)
      let raf = 0; let last = performance.now()
      const frame = () => { raf = requestAnimationFrame(frame); if (document.hidden) return; const now = performance.now(); update(Math.min((now - last) / 1000, 0.05)); last = now; r.render(scene, cam) }
      if (reduce) { update(0); r.render(scene, cam) } else frame()
      return () => { cancelAnimationFrame(raf); ro.disconnect(); ds.forEach(d => d.dispose()); r.dispose(); r.forceContextLoss(); r.domElement.remove() }
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!stop) stop = start() } else if (stop) { stop(); stop = null }
    }, { rootMargin: '150px' })
    io.observe(el)
    return () => { io.disconnect(); stop?.(); stop = null }
  }, [ref, build, fov, z])
}
