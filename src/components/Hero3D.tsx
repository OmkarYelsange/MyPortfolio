import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { palette } from '../lib/useScene'

// Medallion-architecture scene: three data layers with records flowing up through them.
export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let r: THREE.WebGLRenderer
    try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return }
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(r.domElement)
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100); cam.position.set(0, 1.2, 13)
    const group = new THREE.Group(); group.rotation.x = 0.4; group.position.y = 0.7; scene.add(group)
    const disposables: { dispose(): void }[] = []
    const layers: [string, number][] = [['#CD7F32', -1.7], ['#C6CEDA', 0], ['#F5C542', 1.7]]
    const slabs: THREE.MeshBasicMaterial[] = []; const edges: THREE.LineBasicMaterial[] = []; const LT = ['#B45309', '#64748B', '#CA8A04']
    layers.forEach(([c, y]) => {
      const g = new THREE.BoxGeometry(4.4, 0.3, 4.4); const fill = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.18 })
      const edge = new THREE.LineBasicMaterial({ color: c }); const eg = new THREE.EdgesGeometry(g)
      const m = new THREE.Mesh(g, fill); m.position.y = y; const l = new THREE.LineSegments(eg, edge); l.position.y = y
      group.add(m, l); slabs.push(fill); edges.push(edge); disposables.push(g, fill, edge, eg)
      const grid = new THREE.GridHelper(4.4, 8, c, c); grid.position.y = y + 0.16; (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.25
      group.add(grid); disposables.push(grid.geometry, grid.material as THREE.Material)
    })
    const N = 240; const pos = new Float32Array(N * 3); const spd = new Float32Array(N)
    const seed = (i: number, y = -3.4 + Math.random() * 6.8) => { pos[i * 3] = (Math.random() - 0.5) * 3.8; pos[i * 3 + 1] = y; pos[i * 3 + 2] = (Math.random() - 0.5) * 3.8; spd[i] = 0.5 + Math.random() * 0.9 }
    for (let i = 0; i < N; i++) seed(i)
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const pm = new THREE.PointsMaterial({ color: '#8B7CFF', size: 0.07, transparent: true, opacity: 0.95 }); group.add(new THREE.Points(pg, pm)); disposables.push(pg, pm)
    const size = () => { const w = el.clientWidth, h = el.clientHeight; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix() }
    size(); const ro = new ResizeObserver(size); ro.observe(el)
    let tx = 0, ty = 0; const mv = (e: PointerEvent) => { const b = el.getBoundingClientRect(); tx = ((e.clientX - b.left) / b.width - 0.5) * 0.6; ty = ((e.clientY - b.top) / b.height - 0.5) * 0.3 }
    el.addEventListener('pointermove', mv)
    let raf = 0, visible = true; const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)
    let last = performance.now()
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!visible || document.hidden) return
      const nowT = performance.now(); const dt = Math.min((nowT - last) / 1000, 0.05); last = nowT; const light = document.documentElement.dataset.theme === 'light'
      pm.color.set(palette()[0]); slabs.forEach((s, i) => { s.opacity = light ? 0.3 : 0.18; const c = light ? LT[i] : layers[i][0]; s.color.set(c); edges[i].color.set(c) })
      group.rotation.y += (dt * 0.25) + (tx - group.rotation.y % (Math.PI * 2) * 0) * 0; group.rotation.x += ((0.4 + ty) - group.rotation.x) * 0.05
      for (let i = 0; i < N; i++) { pos[i * 3 + 1] += spd[i] * dt; if (pos[i * 3 + 1] > 3.4) seed(i, -3.4) }
      pg.attributes.position.needsUpdate = true; r.render(scene, cam)
    }
    if (reduce) { r.render(scene, cam) } else frame()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); el.removeEventListener('pointermove', mv); disposables.forEach(d => d.dispose()); r.dispose(); r.domElement.remove() }
  }, [])
  return (
    <div role="img" aria-label="3D illustration of Bronze, Silver and Gold data layers with records flowing upward">
      <div className="relative h-[300px] w-full sm:h-[400px]"><div ref={ref} className="absolute inset-0" /></div>
      <ul className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-xs text-fg2">
        {[['#F5C542', 'Gold: analytics-ready'], ['#94A3B8', 'Silver: cleaned'], ['#CD7F32', 'Bronze: raw']].map(([c, t]) => <li key={t} className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm" style={{ background: c }} />{t}</li>)}
      </ul>
    </div>)
}
