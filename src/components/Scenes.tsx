import type { ReactNode } from 'react'
import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { accent, palette, useScene, type Ctx } from '../lib/useScene'

// Site-wide backdrop: a deep field of data-themed solids (databases, bar towers, cubes, rings, knots) plus drifting particles.
// The camera travels down with the page scroll and the whole field leans toward the pointer.
export function Background3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    const mobile = innerWidth < 768; const N = mobile ? 16 : 34
    const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TorusGeometry(0.8, 0.25, 8, 18), new THREE.TorusKnotGeometry(0.6, 0.18, 56, 6), new THREE.BoxGeometry(1.3, 1.3, 1.3), new THREE.CylinderGeometry(0.8, 0.8, 0.5, 18), new THREE.DodecahedronGeometry(1, 0)]
    geos.forEach(g => track(g))
    const world = new THREE.Group(); scene.add(world)
    const items: { o: THREE.Object3D; s: number; i: number; mats: (THREE.LineBasicMaterial | THREE.MeshBasicMaterial)[] }[] = []
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const place = (o: THREE.Object3D) => { o.position.set(rnd(-15, 15), rnd(-17, 17), rnd(-14, 1)); world.add(o) }
    for (let k = 0; k < N; k++) {
      const g = geos[k % geos.length]; const eg = new THREE.EdgesGeometry(g); track(eg)
      const lm = new THREE.LineBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: rnd(0.3, 0.55) }); track(lm)
      const grp = new THREE.Group(); grp.add(new THREE.LineSegments(eg, lm)); const mats: (THREE.LineBasicMaterial | THREE.MeshBasicMaterial)[] = [lm]
      if (k % 3 === 0) { const fm = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: 0.07 }); track(fm); grp.add(new THREE.Mesh(g, fm)); mats.push(fm) }
      grp.scale.setScalar(rnd(0.5, 1.3)); place(grp); items.push({ o: grp, s: rnd(0.08, 0.3), i: k % 3, mats })
    }
    // mini 3D bar-chart towers
    const bg = new THREE.BoxGeometry(0.34, 1, 0.34); bg.translate(0, 0.5, 0); track(bg); const beg = new THREE.EdgesGeometry(bg); track(beg)
    for (let t = 0; t < (mobile ? 2 : 5); t++) {
      const grp = new THREE.Group(); const mats: THREE.LineBasicMaterial[] = []
      for (let b = 0; b < 5; b++) { const lm = new THREE.LineBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.5 }); track(lm); mats.push(lm); const m = new THREE.LineSegments(beg, lm); m.position.x = (b - 2) * 0.5; m.scale.y = rnd(0.5, 2.6); grp.add(m) }
      grp.scale.setScalar(rnd(0.8, 1.4)); place(grp); items.push({ o: grp, s: rnd(0.05, 0.12), i: 1, mats })
    }
    // particle field
    const P = mobile ? 140 : 360; const pos = new Float32Array(P * 3)
    for (let k = 0; k < P; k++) { pos[k * 3] = rnd(-18, 18); pos[k * 3 + 1] = rnd(-20, 20); pos[k * 3 + 2] = rnd(-16, 3) }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pm = new THREE.PointsMaterial({ color: '#38BDF8', size: 0.07, transparent: true, opacity: 0.7 }); track(pg); track(pm)
    const pts = new THREE.Points(pg, pm); world.add(pts)
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    return (dt: number) => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); const f = scrollY / max
      cam.position.y += ((12 - f * 24) - cam.position.y) * 0.08; world.rotation.y += ((px * 0.35) - world.rotation.y) * 0.04; world.rotation.x += ((py * 0.18) - world.rotation.x) * 0.04
      const pal = palette(); pm.color.set(pal[1]); pts.rotation.y += dt * 0.01
      items.forEach(({ o, s, i, mats }) => { o.rotation.x += dt * s; o.rotation.y += dt * s * 1.3; mats.forEach(m => m.color.set(pal[i])) })
    }
  }, [])
  useScene(ref, build, 50, 14)
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 opacity-80" aria-hidden />
}

// Rotating "data globe": wireframe sphere with glowing nodes, tilted orbit rings and orbiting satellites.
export function Globe3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, track }: Ctx) => {
    const g = new THREE.IcosahedronGeometry(1.5, 2); const wm = new THREE.MeshBasicMaterial({ color: '#8B7CFF', wireframe: true, transparent: true, opacity: 0.35 }); track(g); track(wm)
    const globe = new THREE.Group(); globe.add(new THREE.Mesh(g, wm)); scene.add(globe)
    const nm = new THREE.PointsMaterial({ color: '#38BDF8', size: 0.09 }); track(nm); globe.add(new THREE.Points(g, nm))
    const core = new THREE.IcosahedronGeometry(0.55, 1); const cm = new THREE.MeshBasicMaterial({ color: '#F472B6', wireframe: true }); track(core); track(cm); globe.add(new THREE.Mesh(core, cm))
    const rings: THREE.Mesh[] = []; const rm = new THREE.MeshBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.6 }); track(rm)
    const sats: { m: THREE.Mesh; r: number; sp: number; ph: number; ring: THREE.Mesh }[] = []
    const sg = new THREE.SphereGeometry(0.09, 12, 12); const sm = new THREE.MeshBasicMaterial({ color: '#F472B6' }); track(sg); track(sm)
    ;[[1.4, 0.3], [0.2, 1.0], [-0.9, 0.6]].forEach(([rx, rz], k) => {
      const tg = new THREE.TorusGeometry(2.1 + k * 0.18, 0.008, 6, 120); track(tg); const ring = new THREE.Mesh(tg, rm); ring.rotation.set(rx, 0, rz); scene.add(ring); rings.push(ring)
      const s = new THREE.Mesh(sg, sm); ring.add(s); sats.push({ m: s, r: 2.1 + k * 0.18, sp: 0.6 + k * 0.3, ph: k * 2, ring })
    })
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    let t = 0
    return (dt: number) => {
      t += dt; const pal = palette(); wm.color.set(pal[0]); nm.color.set(pal[1]); cm.color.set(pal[2]); rm.color.set(pal[1]); sm.color.set(pal[2])
      globe.rotation.y += dt * 0.25; globe.rotation.x += (py * 0.6 - globe.rotation.x) * 0.04; scene.rotation.y += (px * 0.6 - scene.rotation.y) * 0.04
      sats.forEach(s => s.m.position.set(Math.cos(t * s.sp + s.ph) * s.r, Math.sin(t * s.sp + s.ph) * s.r, 0))
    }
  }, [])
  useScene(ref, build, 40, 7)
  return <div ref={ref} className="relative h-full w-full" role="img" aria-label="Decorative rotating 3D data globe" />
}

// Small rotating wireframe that leans toward the pointer.
export function Shape3D({ kind = 'ico' }: { kind?: 'ico' | 'torus' }) {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, track }: Ctx) => {
    const g = kind === 'torus' ? new THREE.TorusKnotGeometry(1, 0.3, 90, 10) : new THREE.IcosahedronGeometry(1.5, 1)
    const mat = new THREE.MeshBasicMaterial({ color: '#8B7CFF', wireframe: true, transparent: true, opacity: 0.8 })
    const m = new THREE.Mesh(g, mat); scene.add(m); track(g); track(mat)
    const inner = new THREE.IcosahedronGeometry(0.6, 0); const im = new THREE.MeshBasicMaterial({ color: '#38BDF8', wireframe: true }); const core = new THREE.Mesh(inner, im)
    if (kind === 'ico') { scene.add(core) } track(inner); track(im)
    let px = 0, py = 0; const mv = (e: PointerEvent) => { px = (e.clientX / innerWidth - 0.5) * 1.2; py = (e.clientY / innerHeight - 0.5) * 1.2 }
    addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    return (dt: number) => { m.rotation.y += dt * 0.4; m.position.x += (px - m.position.x) * 0.05; m.position.y += (-py - m.position.y) * 0.05; core.rotation.y -= dt * 0.8; mat.color.set(accent()); im.color.set(palette()[1]) }
  }, [kind])
  useScene(ref, build, 40, 6)
  return <div ref={ref} className="relative h-56 w-full min-w-0 overflow-hidden sm:h-72" role="img" aria-label="Decorative rotating 3D wireframe" />
}

const tint = (c: THREE.Color, a: string, b: string, t: number) => c.set(a).lerp(new THREE.Color(b), t)

// DATA ANALYTICS: a 3D bar matrix (think pivot / dashboard) that ripples like live metrics.
export function DataCube3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    cam.position.set(0, 3.4, 7.2); cam.lookAt(0, 0.6, 0)
    const g = new THREE.BoxGeometry(0.5, 1, 0.5); g.translate(0, 0.5, 0); track(g); const eg = new THREE.EdgesGeometry(g); track(eg)
    const root = new THREE.Group(); scene.add(root); const bars: { m: THREE.Mesh; mat: THREE.MeshBasicMaterial; x: number; z: number }[] = []
    const em = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.25 }); track(em)
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      const mat = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: 0.8 }); track(mat)
      const m = new THREE.Mesh(g, mat); m.position.set((i - 2.5) * 0.7, 0, (j - 2.5) * 0.7); m.add(new THREE.LineSegments(eg, em)); root.add(m); bars.push({ m, mat, x: i, z: j })
    }
    const grid = new THREE.GridHelper(4.6, 6, '#8B7CFF', '#8B7CFF'); const gm = grid.material as THREE.Material; gm.transparent = true; gm.opacity = 0.25; root.add(grid); track(grid.geometry); track(gm)
    let t = 0
    return (dt: number) => {
      t += dt; const pal = palette(); root.rotation.y += dt * 0.3
      bars.forEach(({ m, mat, x, z }) => { const h = 0.3 + 1.5 * (0.5 + 0.5 * Math.sin(t * 1.4 + x * 0.7 + z * 0.9)); m.scale.y = h; tint(mat.color, pal[0], pal[2], Math.min(1, (h - 0.3) / 1.5)).lerp(new THREE.Color(pal[1]), 0.15) })
    }
  }, [])
  useScene(ref, build, 40, 7)
  return <div ref={ref} className="relative h-full w-full" role="img" aria-label="3D animated bar matrix representing data analytics" />
}

// DATA ENGINEERING: a database stack ingesting streams of records.
export function Database3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    cam.position.set(0, 2.2, 7); cam.lookAt(0.6, 0.5, 0)
    const dg = new THREE.CylinderGeometry(1, 1, 0.42, 36); const dEdge = new THREE.EdgesGeometry(dg, 20); track(dg); track(dEdge)
    const db = new THREE.Group(); db.position.x = 1; scene.add(db); const discs: { g: THREE.Group; fill: THREE.MeshBasicMaterial; line: THREE.LineBasicMaterial }[] = []
    for (let k = 0; k < 4; k++) {
      const fill = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: 0.22 }); const line = new THREE.LineBasicMaterial({ color: '#8B7CFF' }); track(fill); track(line)
      const g = new THREE.Group(); g.add(new THREE.Mesh(dg, fill), new THREE.LineSegments(dEdge, line)); g.position.y = k * 0.55 - 0.8; db.add(g); discs.push({ g, fill, line })
    }
    const cg = new THREE.BoxGeometry(0.26, 0.26, 0.26); const cEdge = new THREE.EdgesGeometry(cg); track(cg); track(cEdge)
    const cm = new THREE.LineBasicMaterial({ color: '#38BDF8' }); const cf = new THREE.MeshBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.5 }); track(cm); track(cf)
    const recs = Array.from({ length: 9 }, (_, i) => { const g = new THREE.Group(); g.add(new THREE.Mesh(cg, cf), new THREE.LineSegments(cEdge, cm)); scene.add(g); return { g, ph: i / 9, y: (i % 4) * 0.55 - 0.8 } })
    let t = 0
    return (dt: number) => {
      t += dt; const pal = palette(); db.rotation.y += dt * 0.35
      discs.forEach(({ g, fill, line }, k) => { g.position.y = k * 0.55 - 0.8 + Math.sin(t * 1.6 + k) * 0.05; fill.color.set(pal[k % 2 ? 1 : 0]); line.color.set(pal[k % 2 ? 1 : 0]) }); cm.color.set(pal[1]); cf.color.set(pal[1])
      recs.forEach(r => { const u = (t * 0.28 + r.ph) % 1; r.g.position.set(-3.6 + u * 4.2, r.y + Math.sin(u * 6) * 0.1, 0); r.g.rotation.set(u * 5, u * 4, 0); r.g.scale.setScalar(u < 0.85 ? 1 : (1 - u) / 0.15) })
    }
  }, [])
  useScene(ref, build, 40, 7)
  return <div ref={ref} className="relative h-full w-full" role="img" aria-label="3D database stack ingesting data records, representing data engineering" />
}

// DATA SCIENCE: a small neural network with signals travelling between layers.
export function NeuralNet3D() {
  const ref = useRef<HTMLDivElement>(null)
  const build = useCallback(({ scene, cam, track }: Ctx) => {
    cam.position.set(0, 0.4, 7.4)
    const layers = [3, 5, 5, 2]; const root = new THREE.Group(); scene.add(root)
    const pos: THREE.Vector3[][] = layers.map((n, li) => Array.from({ length: n }, (_, i) => new THREE.Vector3((li - 1.5) * 1.55, (i - (n - 1) / 2) * 0.62, ((i * 37 + li * 11) % 5 - 2) * 0.16)))
    const sg = new THREE.SphereGeometry(0.12, 14, 14); track(sg); const nodeMats = layers.map(() => { const m = new THREE.MeshBasicMaterial({ color: '#8B7CFF' }); track(m); return m })
    pos.forEach((l, li) => l.forEach(p => { const m = new THREE.Mesh(sg, nodeMats[li]); m.position.copy(p); root.add(m) }))
    const segs: number[] = []; const edges: [THREE.Vector3, THREE.Vector3][] = []
    for (let li = 0; li < layers.length - 1; li++) pos[li].forEach(a => pos[li + 1].forEach(b => { segs.push(a.x, a.y, a.z, b.x, b.y, b.z); edges.push([a, b]) }))
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3)); const lm = new THREE.LineBasicMaterial({ color: '#38BDF8', transparent: true, opacity: 0.22 }); track(lg); track(lm); root.add(new THREE.LineSegments(lg, lm))
    const P = 26; const pp = new Float32Array(P * 3); const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); const pm = new THREE.PointsMaterial({ color: '#F472B6', size: 0.11 }); track(pg); track(pm); root.add(new THREE.Points(pg, pm))
    const sig = Array.from({ length: P }, (_, i) => ({ e: edges[(i * 7) % edges.length], o: i / P }))
    let t = 0, px = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5 }; addEventListener('pointermove', mv); track({ dispose: () => removeEventListener('pointermove', mv) })
    return (dt: number) => {
      t += dt; const pal = palette(); root.rotation.y = Math.sin(t * 0.4) * 0.5 + px * 0.5; root.rotation.x = 0.15
      nodeMats.forEach((m, i) => m.color.set(pal[i % 3])); lm.color.set(pal[1]); pm.color.set(pal[2])
      sig.forEach((s, i) => { const u = (t * 0.45 + s.o) % 1; pp[i * 3] = s.e[0].x + (s.e[1].x - s.e[0].x) * u; pp[i * 3 + 1] = s.e[0].y + (s.e[1].y - s.e[0].y) * u; pp[i * 3 + 2] = s.e[0].z + (s.e[1].z - s.e[0].z) * u })
      pg.attributes.position.needsUpdate = true
    }
  }, [])
  useScene(ref, build, 40, 7.4)
  return <div ref={ref} className="relative h-full w-full" role="img" aria-label="3D neural network with signals, representing data science and machine learning" />
}

// ---------- Small themed 3D models used to fill empty layout space ----------
export type ModelKind = 'sensor' | 'gantt' | 'code' | 'cap' | 'book' | 'medal' | 'trophy' | 'workflow' | 'git' | 'chip' | 'orbit' | 'db' | 'cube' | 'neural' | 'globe'

function kit(track: Ctx['track']) {
  const reg: { m: THREE.Material & { color: THREE.Color }; i: number }[] = []
  const mat = (i: number, o: number) => { const m = new THREE.MeshBasicMaterial({ color: '#8B7CFF', transparent: true, opacity: o }); track(m); reg.push({ m, i }); return m }
  const lmat = (i: number, o = 1) => { const m = new THREE.LineBasicMaterial({ color: '#8B7CFF', transparent: o < 1, opacity: o }); track(m); reg.push({ m, i }); return m }
  const solid = (g: THREE.BufferGeometry, i: number, o = 0.2) => { track(g); const eg = new THREE.EdgesGeometry(g, 20); track(eg); const grp = new THREE.Group(); grp.add(new THREE.Mesh(g, mat(i, o)), new THREE.LineSegments(eg, lmat(i))); return grp }
  const apply = () => { const p = palette(); reg.forEach(({ m, i }) => m.color.set(p[i % 3])) }
  return { mat, lmat, solid, apply }
}
const B = THREE.BoxGeometry, C = THREE.CylinderGeometry, T = THREE.TorusGeometry
const leanTo = () => { let px = 0; const mv = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5 }; addEventListener('pointermove', mv); return { get: () => px, off: () => removeEventListener('pointermove', mv) } }

const builders: Partial<Record<ModelKind, (c: Ctx) => (dt: number) => void>> = {
  // live telemetry: a waveform in a frame with a gauge (sensor data work)
  sensor: ({ scene, cam, track }) => {
    cam.position.set(0, 0, 6.2); const k = kit(track); const frame = k.solid(new B(3.6, 2, 0.12), 0, 0.1); scene.add(frame)
    const N = 90; const pts = new Float32Array(N * 3); const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pts, 3)); track(lg)
    const line = new THREE.Line(lg, k.lmat(1)); line.position.z = 0.1; scene.add(line)
    const g2 = new THREE.BufferGeometry(); const p2 = new Float32Array(N * 3); g2.setAttribute('position', new THREE.BufferAttribute(p2, 3)); track(g2); const l2 = new THREE.Line(g2, k.lmat(2, 0.55)); l2.position.z = 0.1; scene.add(l2)
    const gauge = k.solid(new T(0.38, 0.05, 8, 28), 2, 0.4); gauge.position.set(1.15, 0.55, 0.15); scene.add(gauge)
    const needle = k.solid(new B(0.34, 0.04, 0.04), 0, 0.8); needle.position.set(1.15, 0.55, 0.2); scene.add(needle); let t = 0
    return dt => { t += dt; for (let i = 0; i < N; i++) { const x = (i / (N - 1) - 0.5) * 3.2; pts.set([x, Math.sin(x * 3 + t * 3) * 0.45 * (0.7 + 0.3 * Math.sin(t)) + Math.sin(x * 11 + t * 7) * 0.08 - 0.2, 0], i * 3); p2.set([x, Math.cos(x * 2 + t * 2) * 0.3 - 0.45, 0], i * 3) }
      lg.attributes.position.needsUpdate = true; g2.attributes.position.needsUpdate = true; needle.rotation.z = Math.sin(t * 1.4) * 1.1; scene.rotation.y = Math.sin(t * 0.5) * 0.35; k.apply() }
  },
  // project plan: Gantt bars growing and shifting
  gantt: ({ scene, cam, track }) => {
    cam.position.set(0, 0.2, 6.4); const k = kit(track); const bars: THREE.Group[] = []
    for (let r = 0; r < 5; r++) { const g = new B(1, 0.26, 0.26); g.translate(0.5, 0, 0); const b = k.solid(g, r % 3, 0.35); b.position.set(-1.6 + r * 0.35, 0.95 - r * 0.45, 0); scene.add(b); bars.push(b) }
    const ax = k.solid(new B(3.8, 0.04, 0.04), 0, 0.5); ax.position.set(0, -1.35, 0); scene.add(ax); const ms = k.solid(new THREE.OctahedronGeometry(0.17), 2, 0.6); scene.add(ms); let t = 0
    return dt => { t += dt; bars.forEach((b, r) => { b.scale.x = 0.9 + 1.4 * (0.5 + 0.5 * Math.sin(t * 0.9 + r * 0.8)) }); ms.position.set(-1.6 + 0.35 * 4 + bars[4].scale.x + 0.15, 0.95 - 4 * 0.45, 0.1); ms.rotation.y += dt * 2; scene.rotation.y = Math.sin(t * 0.5) * 0.3; scene.rotation.x = 0.12; k.apply() }
  },
  // code window typing lines (full stack work)
  code: ({ scene, cam, track }) => {
    cam.position.set(0, 0, 6.4); const k = kit(track); scene.add(k.solid(new B(3.4, 2.3, 0.1), 0, 0.12)); const hb = k.solid(new B(3.4, 0.28, 0.12), 1, 0.35); hb.position.y = 1.0; scene.add(hb)
    const lines: THREE.Group[] = []; const w = [1.9, 1.2, 2.3, 1.5, 0.9, 1.8]
    w.forEach((_, i) => { const g = new B(1, 0.12, 0.08); g.translate(0.5, 0, 0); const l = k.solid(g, i % 3, 0.55); l.position.set(-1.5 + (i % 3 === 1 ? 0.3 : 0), 0.55 - i * 0.28, 0.1); scene.add(l); lines.push(l) })
    const cur = k.solid(new B(0.12, 0.2, 0.08), 2, 0.9); scene.add(cur); let t = 0
    return dt => { t += dt; lines.forEach((l, i) => { const u = Math.min(1, Math.max(0, (t * 0.7 - i * 0.5) % 4.6)); l.scale.x = w[i] * Math.min(1, u) }); const li = Math.min(5, Math.floor(((t * 0.7) % 4.6) / 0.5)); cur.position.set(-1.5 + (li % 3 === 1 ? 0.3 : 0) + lines[li].scale.x + 0.1, 0.55 - li * 0.28, 0.1); cur.visible = Math.sin(t * 8) > -0.3; scene.rotation.y = Math.sin(t * 0.5) * 0.35; k.apply() }
  },
  cap: ({ scene, cam, track }) => {
    cam.position.set(0, 0.8, 6.4); const k = kit(track); const board = k.solid(new B(2.4, 0.14, 2.4), 0, 0.3); board.rotation.y = Math.PI / 4; board.position.y = 0.25; scene.add(board)
    const base = k.solid(new C(0.75, 0.85, 0.55, 6), 1, 0.25); base.position.y = -0.2; scene.add(base)
    const tg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.3, 0), new THREE.Vector3(1.2, 0.3, 0), new THREE.Vector3(1.2, -0.35, 0)]); track(tg); scene.add(new THREE.Line(tg, k.lmat(2)))
    const tas = k.solid(new THREE.SphereGeometry(0.11, 10, 10), 2, 0.8); tas.position.set(1.2, -0.45, 0); scene.add(tas); let t = 0
    return dt => { t += dt; scene.rotation.y += dt * 0.5; scene.position.y = Math.sin(t * 1.4) * 0.1; k.apply() }
  },
  book: ({ scene, cam, track }) => {
    cam.position.set(0, 1.4, 6.2); const k = kit(track); const L = k.solid(new B(1.5, 0.07, 2), 0, 0.28); L.position.x = -0.75; L.rotation.z = 0.28; const R = k.solid(new B(1.5, 0.07, 2), 1, 0.28); R.position.x = 0.75; R.rotation.z = -0.28; scene.add(L, R)
    const sheets = Array.from({ length: 4 }, (_, i) => { const s = k.solid(new B(0.7, 0.02, 0.9), 2, 0.4); scene.add(s); return { s, ph: i / 4 } }); let t = 0
    return dt => { t += dt; scene.rotation.y = Math.sin(t * 0.5) * 0.6; scene.rotation.x = 0.15; sheets.forEach(({ s, ph }) => { const u = (t * 0.25 + ph) % 1; s.position.set(Math.sin(u * 6 + ph * 5) * 0.6, 0.3 + u * 1.8, 0); s.rotation.set(u * 4, u * 3, 0); s.scale.setScalar(1 - u * 0.7) }); k.apply() }
  },
  medal: ({ scene, cam, track }) => {
    cam.position.set(0, 0, 6.2); const k = kit(track); scene.add(k.solid(new T(1, 0.11, 14, 44), 0, 0.3)); const d = k.solid(new C(0.72, 0.72, 0.14, 36), 1, 0.3); d.rotation.x = Math.PI / 2; scene.add(d)
    const star = k.solid(new THREE.OctahedronGeometry(0.36), 2, 0.5); star.position.z = 0.12; scene.add(star)
    const rb = k.solid(new B(0.38, 1.1, 0.04), 2, 0.4); rb.position.set(-0.28, 1.45, -0.05); rb.rotation.z = 0.25; const rb2 = k.solid(new B(0.38, 1.1, 0.04), 1, 0.4); rb2.position.set(0.28, 1.45, -0.05); rb2.rotation.z = -0.25; scene.add(rb, rb2); let t = 0
    return dt => { t += dt; scene.rotation.y += dt * 0.9; star.rotation.z += dt * 1.5; scene.position.y = -0.4 + Math.sin(t * 1.5) * 0.1; k.apply() }
  },
  trophy: ({ scene, cam, track }) => {
    cam.position.set(0, 0.4, 6.4); const k = kit(track); const cup = k.solid(new C(0.95, 0.5, 1.2, 28), 0, 0.28); cup.position.y = 0.6; scene.add(cup)
    const st = k.solid(new C(0.14, 0.14, 0.55, 12), 1, 0.4); st.position.y = -0.3; scene.add(st); const bs = k.solid(new B(1.3, 0.2, 1.3), 1, 0.3); bs.position.y = -0.72; scene.add(bs)
    ;[-1, 1].forEach(s => { const h = k.solid(new T(0.34, 0.06, 8, 20), 2, 0.5); h.position.set(s * 1.05, 0.65, 0); scene.add(h) }); const sp = k.solid(new THREE.OctahedronGeometry(0.2), 2, 0.7); scene.add(sp); let t = 0
    return dt => { t += dt; scene.rotation.y += dt * 0.7; sp.position.set(0, 1.55 + Math.sin(t * 2) * 0.1, 0); sp.rotation.y += dt * 2; k.apply() }
  },
  // pipeline: nodes joined by flowing pulses
  workflow: ({ scene, cam, track }) => {
    cam.position.set(0, 0.2, 7.2); const k = kit(track); const xs = [-2.8, -1.4, 0, 1.4, 2.8]; const nodes = xs.map((x, i) => { const n = k.solid(i % 2 ? new THREE.OctahedronGeometry(0.34) : new B(0.55, 0.55, 0.55), i % 3, 0.3); n.position.set(x, 0, 0); scene.add(n); return n })
    const lg = new THREE.BufferGeometry().setFromPoints(xs.map(x => new THREE.Vector3(x, 0, 0))); track(lg); scene.add(new THREE.Line(lg, k.lmat(1, 0.7)))
    const P = 14; const pp = new Float32Array(P * 3); const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); const pm = new THREE.PointsMaterial({ color: '#F472B6', size: 0.14 }); track(pg); track(pm); scene.add(new THREE.Points(pg, pm)); let t = 0
    return dt => { t += dt; nodes.forEach((n, i) => { n.rotation.y += dt * (0.6 + i * 0.15); n.rotation.x += dt * 0.4; n.position.y = Math.sin(t * 1.5 + i) * 0.12 }); for (let i = 0; i < P; i++) { const u = (t * 0.2 + i / P) % 1; pp.set([-2.8 + u * 5.6, Math.sin(u * 20 + t * 3) * 0.06, 0.1], i * 3) } pg.attributes.position.needsUpdate = true; pm.color.set(palette()[2]); scene.rotation.y = Math.sin(t * 0.4) * 0.35; scene.rotation.x = 0.2; k.apply() }
  },
  // branches and commits
  git: ({ scene, cam, track }) => {
    cam.position.set(0, 0, 7); const k = kit(track); const main = [-2.4, -1.2, 0, 1.2, 2.4]; const mk = (x: number, y: number, i: number) => { const n = k.solid(new THREE.SphereGeometry(0.17, 12, 12), i, 0.7); n.position.set(x, y, 0); scene.add(n); return n }
    const nodes = [...main.map(x => mk(x, 0, 0)), mk(-0.6, 0.9, 1), mk(0.6, 0.9, 1), mk(1.8, 0.9, 1)]
    const seg = (a: [number, number], b: [number, number], i: number) => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a[0], a[1], 0), new THREE.Vector3(b[0], b[1], 0)]); track(g); scene.add(new THREE.Line(g, k.lmat(i, 0.8))) }
    for (let i = 0; i < 4; i++) seg([main[i], 0], [main[i + 1], 0], 0); seg([-1.2, 0], [-0.6, 0.9], 1); seg([-0.6, 0.9], [0.6, 0.9], 1); seg([0.6, 0.9], [1.8, 0.9], 1); seg([1.8, 0.9], [2.4, 0], 1)
    let t = 0; return dt => { t += dt; nodes.forEach((n, i) => n.scale.setScalar(1 + 0.25 * Math.sin(t * 2 + i))); scene.rotation.y = Math.sin(t * 0.5) * 0.4; scene.rotation.x = 0.2; k.apply() }
  },
  // microchip with traces (hardware)
  chip: ({ scene, cam, track }) => {
    cam.position.set(0, 2.4, 6); cam.lookAt(0, 0, 0); const k = kit(track); scene.add(k.solid(new B(2, 0.25, 2), 0, 0.2)); const die = k.solid(new B(1.1, 0.3, 1.1), 1, 0.4); die.position.y = 0.05; scene.add(die)
    for (let s = 0; s < 4; s++) for (let i = 0; i < 6; i++) { const pin = k.solid(new B(0.08, 0.06, 0.34), 2, 0.6); const a = -0.8 + i * 0.32; const r = 1.17; pin.position.set(s % 2 ? (s === 1 ? r : -r) : a, 0, s % 2 ? a : (s === 0 ? r : -r)); if (s % 2) pin.rotation.y = Math.PI / 2; scene.add(pin) }
    const P = 10; const pp = new Float32Array(P * 3); const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); const pm = new THREE.PointsMaterial({ color: '#38BDF8', size: 0.12 }); track(pg); track(pm); scene.add(new THREE.Points(pg, pm)); let t = 0
    return dt => { t += dt; scene.rotation.y += dt * 0.45; for (let i = 0; i < P; i++) { const u = (t * 0.4 + i / P) % 1; const side = i % 4; const d = 0.5 + u * 1.5; pp.set([side === 0 ? -0.8 + (i % 6) * 0.32 : side === 1 ? d : side === 2 ? 0.8 - (i % 6) * 0.32 : -d, 0.05, side === 0 ? d : side === 1 ? -0.8 + (i % 6) * 0.32 : side === 2 ? -d : 0.8 - (i % 6) * 0.32], i * 3) } pg.attributes.position.needsUpdate = true; pm.color.set(palette()[1]); k.apply() }
  },
  // skills orbit: tools circling a core
  orbit: ({ scene, cam, track }) => {
    cam.position.set(0, 0.6, 7.2); const k = kit(track); const core = k.solid(new THREE.IcosahedronGeometry(0.75, 1), 0, 0.25); scene.add(core)
    const rings = [1.5, 2.05, 2.6].map((r, i) => { const rg = k.solid(new T(r, 0.012, 6, 90), 1, 0.4); rg.rotation.set(1.2 - i * 0.5, i * 0.6, i * 0.4); scene.add(rg); const s = k.solid(new THREE.OctahedronGeometry(0.17), (i + 1) % 3, 0.8); rg.add(s); return { r, s, sp: 0.7 - i * 0.18, ph: i * 2 } }); let t = 0
    return dt => { t += dt; core.rotation.y += dt * 0.6; core.rotation.x += dt * 0.3; rings.forEach(({ r, s, sp, ph }) => { s.position.set(Math.cos(t * sp + ph) * r, Math.sin(t * sp + ph) * r, 0); s.rotation.y += dt * 2 }); scene.rotation.y += dt * 0.15; k.apply() }
  },
}
const reuse: Partial<Record<ModelKind, () => ReactNode>> = { db: () => <Database3D />, cube: () => <DataCube3D />, neural: () => <NeuralNet3D />, globe: () => <Globe3D /> }

function Built({ kind }: { kind: ModelKind }) {
  const ref = useRef<HTMLDivElement>(null); const build = useCallback((c: Ctx) => { const u = builders[kind]!(c); const l = leanTo(); c.track({ dispose: l.off }); return (dt: number) => { u(dt); c.scene.rotation.y += (l.get() * 0.25) } }, [kind])
  useScene(ref, build, 40, 7)
  return <div ref={ref} className="relative h-full w-full" />
}
// Decorative 3D model that fills its parent; size it with the parent's height/width.
export function Model3D({ kind, label }: { kind: ModelKind; label?: string }) {
  return <div className="relative h-full w-full" role="img" aria-label={label ?? `Decorative 3D model: ${kind}`}>{reuse[kind] ? reuse[kind]!() : <Built kind={kind} />}</div>
}
