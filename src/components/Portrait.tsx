const chips: [string, string, string][] = [['SQL', 'left-0 top-[18%] sm:-left-2', '0s'], ['Python', 'right-0 top-[10%] sm:-right-4', '.8s'], ['Power BI', 'left-0 top-[52%] sm:-left-4', '1.6s'], ['PySpark', 'right-0 top-[60%] sm:-right-6', '2.4s']]

// Cut-out portrait that sits directly on the page: glowing halo, rings, floating tool chips, soft fade into the 3D platform below.
export default function Portrait({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-[clamp(230px,62vw,340px)] sm:w-[clamp(300px,46vh,430px)] lg:w-[clamp(300px,50vh,540px)] ${className}`}>
      <div className="absolute left-1/2 top-[44%] aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-accent/45 via-cyan/25 to-pink/35 blur-2xl" aria-hidden />
      <div className="spin-slow absolute left-1/2 top-[44%] aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/50" aria-hidden />
      <div className="absolute left-1/2 top-[44%] aspect-square w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/30 bg-gradient-to-b from-white/5 to-transparent" aria-hidden />
      <img src="/images/omkar-cutout-1000.webp" srcSet="/images/omkar-cutout-560.webp 560w, /images/omkar-cutout-1000.webp 1000w" sizes="(min-width:1024px) 470px, 340px" width={1000} height={1046}
        alt="Omkar Yelsange, Data Analyst, in a navy suit" fetchPriority="high" decoding="async"
        className="relative h-auto w-full object-contain drop-shadow-[0_20px_40px_rgba(91,71,224,.45)] [mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)]" />
      {chips.map(([t, pos, d]) => <span key={t} style={{ animationDelay: d }} className={`floaty absolute ${pos} rounded-full border border-white/20 bg-card px-2.5 py-1 font-mono text-[11px] text-fg shadow-lg backdrop-blur sm:text-xs`}><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />{t}</span>)}
    </div>
  )
}
