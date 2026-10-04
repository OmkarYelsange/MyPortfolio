import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { FillModel, type ModelKind } from './FillModel'

const useWide = () => {
  const [w, setW] = useState(() => matchMedia('(min-width: 768px)').matches)
  useEffect(() => { const m = matchMedia('(min-width: 768px)'); const f = () => setW(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  return w
}


function Item({ left, wide, model, children }: { left: boolean; wide: boolean; model?: ModelKind; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null); const seen = useInView(ref, { once: true, margin: '-60px' })
  return (
    <li ref={ref} className="relative pb-10 pl-12 last:pb-0 md:grid md:grid-cols-2 md:pl-0">
      <motion.span animate={seen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
        className="absolute left-4 top-7 z-10 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border-2 border-accent bg-bg shadow-[0_0_16px_var(--color-accent)] md:left-1/2" aria-hidden><span className="h-1.5 w-1.5 rounded-full bg-accent" /></motion.span>
      <span aria-hidden className={`absolute top-[34px] hidden h-px w-12 md:block ${left ? 'right-1/2 mr-2.5 bg-gradient-to-l' : 'left-1/2 ml-2.5 bg-gradient-to-r'} from-accent/70 to-transparent`} />
      <motion.div initial={{ opacity: 0, x: wide ? (left ? -110 : 110) : 0, y: wide ? 0 : 50, scale: 0.88, filter: 'blur(12px)' }} animate={seen ? { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }} className={left ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12'}>{children}</motion.div>
      {model && <motion.div initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }} animate={seen ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined} transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        className={`hidden self-center md:block md:row-start-1 ${left ? 'md:col-start-2 md:pl-12' : 'md:col-start-1 md:pr-12'}`}><FillModel kind={model} className="mx-auto h-40 w-full max-w-[16rem]" /></motion.div>}
    </li>)
}

// Alternating timeline: card 1 on the left, card 2 on the right, and so on, with a centre line that fills with colour as you scroll.
export default function Timeline({ items, models }: { items: ReactNode[]; models?: ModelKind[] }) {
  const ref = useRef<HTMLOListElement>(null); const wide = useWide()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return (
    <div className="overflow-x-clip">
      <ol ref={ref} className="relative">
        <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-white/15 md:left-1/2" />
        <motion.span aria-hidden style={{ scaleY: fill }} className="absolute bottom-0 left-4 top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-accent via-cyan to-pink shadow-[0_0_14px_var(--color-accent)] md:left-1/2" />
        {items.map((it, i) => <Item key={i} left={i % 2 === 0} wide={wide} model={models?.[i]}>{it}</Item>)}
      </ol>
    </div>)
}
