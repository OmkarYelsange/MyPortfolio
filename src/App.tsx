import { lazy, Suspense, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Reveal } from './components/Motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import RecruiterSnapshot from './components/RecruiterSnapshot'
import Projects from './components/Projects'
import { Skills, Experience, Contact, Footer } from './components/Sections'
import { Process, WhatIBuild, Education, GitHub, Blog, ResumeCTA, OtherWorkTeaser } from './components/More'
import { TechMatrix } from './components/Extras'
import { Cursor, Loader } from './components/Chrome'
import { Certifications, CoCurricular } from './components/Achievements'
import BackToTop from './components/BackToTop'
import About from './components/About'
import Terminal from './components/Terminal'
import AssistantChat from './components/AssistantChat'
import CommandPalette from './components/CommandPalette'
import CaseStudy from './pages/CaseStudy'
import OtherWork from './pages/OtherWork'

const Background3D = lazy(() => import('./components/Scenes').then(m => ({ default: m.Background3D })))
const R = ({ children }: { children: React.ReactNode }) => <Reveal>{children}</Reveal>
const Home = () => (<main><Hero /><R><About /></R><R><RecruiterSnapshot /></R><R><WhatIBuild /></R><R><Skills /></R><R><Experience /></R><Projects /><R><TechMatrix /></R><R><Process /></R><R><Education /></R><R><Certifications /></R><R><CoCurricular /></R><R><GitHub /></R><R><Blog /></R><R><ResumeCTA /></R><R><Contact /></R><R><OtherWorkTeaser /></R></main>)
export default function App() {
  const { scrollYProgress } = useScroll(); const { pathname } = useLocation()
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.15 })
    document.querySelectorAll('[data-stagger]').forEach(n => io.observe(n)); return () => io.disconnect()
  }, [pathname])
  return (<><motion.div style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-accent via-cyan to-pink" aria-hidden /><Loader /><Cursor /><Terminal /><AssistantChat /><BackToTop /><Suspense fallback={null}><Background3D /></Suspense><Navbar /><CommandPalette />
    <motion.div key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}><Routes><Route path="/" element={<Home />} /><Route path="/projects/:id" element={<CaseStudy />} /><Route path="/other-work" element={<OtherWork />} />
      <Route path="*" element={<p className="p-10 pt-28">Page not found.</p>} /></Routes></motion.div>
    <Footer /></>)
}
