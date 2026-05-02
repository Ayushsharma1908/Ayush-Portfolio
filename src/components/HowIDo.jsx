import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel, SectionTitle } from './SectionHelpers';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TECH_CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '⚡',
    color: '#c0392b',
    desc: 'Crafting pixel-perfect, responsive UIs with modern React ecosystem.',
    stacks: [
      { name: 'React',       pct: 88, tag: 'Expert',         line: 'My primary weapon — I think in components.' },
      { name: 'Next.js',     pct: 75, tag: 'Proficient',     line: 'SSR, SSG, App Router — all covered.' },
      { name: 'TypeScript',  pct: 70, tag: 'Proficient',     line: 'Type-safe codebases, fewer bugs.' },
      { name: 'Tailwind CSS',pct: 85, tag: 'Expert',         line: 'Utility-first CSS is my second language.' },
      { name: 'HTML & CSS',  pct: 92, tag: 'Expert',         line: 'The foundation — solid as rock.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '🛠',
    color: '#8b1a1a',
    desc: 'Building robust, scalable APIs and server-side systems.',
    stacks: [
      { name: 'Node.js',    pct: 82, tag: 'Expert',     line: 'Full async, event-loop, everything.' },
      { name: 'Express.js', pct: 80, tag: 'Expert',     line: 'REST APIs, middleware, routing — daily driver.' },
      { name: 'MongoDB',    pct: 75, tag: 'Proficient', line: 'NoSQL schemas, aggregation pipelines.' },
      { name: 'PostgreSQL', pct: 60, tag: 'Intermediate', line: 'Relational DB when structure matters.' },
      { name: 'REST APIs',  pct: 85, tag: 'Expert',     line: 'Designing clean, versioned API contracts.' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & ML',
    icon: '🤖',
    color: '#c0392b',
    desc: 'Integrating intelligent systems into real-world products.',
    stacks: [
      { name: 'LLM Integration', pct: 75, tag: 'Proficient',    line: 'OpenAI, Gemini, Claude APIs — production apps.' },
      { name: 'AI Chatbots',     pct: 78, tag: 'Proficient',    line: 'Built "Hear Me Out" — full AI chat system.' },
      { name: 'Prompt Eng.',     pct: 72, tag: 'Proficient',    line: 'Crafting prompts for reliable AI outputs.' },
      { name: 'ML Concepts',     pct: 50, tag: 'Learning',      line: 'Exploring supervised learning & neural nets.' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    icon: '💬',
    color: '#8b1a1a',
    desc: 'Programming languages in my daily toolkit.',
    stacks: [
      { name: 'JavaScript', pct: 90, tag: 'Expert',       line: 'The language I dream in. ES2024+.' },
      { name: 'TypeScript', pct: 70, tag: 'Proficient',   line: 'Adding safety to JS — love it.' },
      { name: 'Python',     pct: 55, tag: 'Intermediate', line: 'Scripting, ML exploration, automation.' },
      { name: 'SQL',        pct: 62, tag: 'Intermediate', line: 'Queries, joins, stored procedures.' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: '🔧',
    color: '#c0392b',
    desc: 'Shipping, versioning and deploying with confidence.',
    stacks: [
      { name: 'Git & GitHub', pct: 85, tag: 'Expert',       line: 'Branching strategies, PR reviews, actions.' },
      { name: 'Vercel',       pct: 82, tag: 'Expert',       line: 'Zero-config deploy — my go-to platform.' },
      { name: 'VS Code',      pct: 95, tag: 'Expert',       line: 'My IDE, fully configured for speed.' },
      { name: 'Linux/Bash',   pct: 60, tag: 'Intermediate', line: 'Command line for daily dev tasks.' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    icon: '🎨',
    color: '#8b1a1a',
    desc: 'From wireframes to pixel-perfect implementations.',
    stacks: [
      { name: 'Figma',          pct: 70, tag: 'Proficient',   line: 'UI design, prototyping, component libraries.' },
      { name: 'UI/UX Design',   pct: 72, tag: 'Proficient',   line: 'User-centric design thinking.' },
      { name: 'Motion Design',  pct: 65, tag: 'Intermediate', line: 'GSAP, Framer Motion, CSS animations.' },
      { name: 'Responsive CSS', pct: 88, tag: 'Expert',       line: 'Mobile-first layouts, every screen.' },
    ],
  },
];

const TAG_COLORS = {
  Expert:       { bg: 'rgba(192,57,43,0.15)', border: '#c0392b',  text: '#ff6b55' },
  Proficient:   { bg: 'rgba(139,26,26,0.12)', border: '#8b1a1a',  text: '#cc4433' },
  Intermediate: { bg: 'rgba(60,60,60,0.2)',   border: '#444',     text: '#aaa'    },
  Learning:     { bg: 'rgba(30,30,30,0.2)',   border: '#333',     text: '#777'    },
};

const MARQUEE_ITEMS = [
  'React','·','Node.js','·','TypeScript','·','MongoDB','·',
  'Next.js','·','PostgreSQL','·','Tailwind CSS','·','Express.js','·',
  'Figma','·','Vercel','·','Git','·','LLM APIs','·',
  'React','·','Node.js','·','TypeScript','·','MongoDB','·',
  'Next.js','·','PostgreSQL','·','Tailwind CSS','·','Express.js','·',
  'Figma','·','Vercel','·','Git','·','LLM APIs','·',
];

/* ─────────────────────────────────────────────
   3D Circle Progress (SVG + CSS 3D shimmer)
───────────────────────────────────────────── */
function CircleProgress({ pct, color, size = 180 }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 20) / 2;
  const circ   = 2 * Math.PI * radius;
  const stroke = circ * (1 - displayed / 100);

  useEffect(() => {
    setDisplayed(0);
    const t = setTimeout(() => {
      let v = 0;
      const step = setInterval(() => {
        v += 1.5;
        if (v >= pct) { setDisplayed(pct); clearInterval(step); }
        else setDisplayed(Math.round(v));
      }, 14);
      return () => clearInterval(step);
    }, 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 40px 8px ${color}33, 0 0 80px 16px ${color}11`, borderRadius: '50%' }} />

      <svg width={size} height={size} style={{ transform: 'rotateX(12deg)', filter: `drop-shadow(0 8px 24px ${color}55)` }}>
        <defs>
          <linearGradient id={`grad-${pct}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#ff6b55" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="#1a1a1a" strokeWidth="10" />
        {/* Progress arc */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke={`url(#grad-${pct})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
        {/* Center dot */}
        <circle cx={size/2} cy={size/2} r="5" fill={color} opacity="0.8" />
      </svg>

      {/* Percentage text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl text-white leading-none" style={{ textShadow: `0 0 20px ${color}` }}>
          {displayed}
        </span>
        <span className="text-[11px] tracking-[0.2em] text-grey-muted uppercase mt-1">%</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stack Detail Modal
───────────────────────────────────────────── */
function StackModal({ stack, catColor, onClose }) {
  const tagStyle = TAG_COLORS[stack.tag] || TAG_COLORS.Intermediate;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full border border-grey-border"
        style={{
          background: '#0d0d0d',
          transform: 'perspective(800px) rotateX(2deg)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px ${catColor}44, 0 0 60px ${catColor}22`,
          animation: 'modalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${catColor}, transparent)` }} />

        <div className="p-8 flex flex-col items-center gap-6">
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 text-grey-muted hover:text-white text-xl leading-none transition-colors"
            data-hover>✕</button>

          {/* Stack name */}
          <h3 className="font-display text-3xl tracking-widest uppercase text-white text-center">{stack.name}</h3>

          {/* 3D Circle */}
          <CircleProgress pct={stack.pct} color={catColor} size={190} />

          {/* Tag badge */}
          <div className="px-5 py-1.5 text-[11px] tracking-[0.3em] uppercase border font-body"
            style={{ background: tagStyle.bg, borderColor: tagStyle.border, color: tagStyle.text }}>
            {stack.tag}
          </div>

          {/* Tagline */}
          <p className="font-serif italic text-grey-muted text-center text-base leading-relaxed px-2">
            "{stack.line}"
          </p>

          {/* Mastery label */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-grey-muted mb-2">
              <span>Mastery</span><span>{stack.pct}%</span>
            </div>
            <div className="h-1 bg-grey-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${stack.pct}%`, background: `linear-gradient(90deg, ${catColor}, #ff6b55)` }} />
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${catColor})` }} />
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:perspective(800px) rotateX(2deg) scale(0.88) translateY(30px); }
          to   { opacity:1; transform:perspective(800px) rotateX(2deg) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stack Item Row (inside a category card)
───────────────────────────────────────────── */
function StackItem({ stack, catColor, onClick }) {
  const tagStyle = TAG_COLORS[stack.tag] || TAG_COLORS.Intermediate;
  return (
    <button
      data-hover
      onClick={onClick}
      className="w-full text-left group/item py-3 border-b border-grey-border last:border-b-0 hover:pl-2 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-sm text-white group-hover/item:text-white transition-colors">{stack.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border"
            style={{ background: tagStyle.bg, borderColor: tagStyle.border, color: tagStyle.text }}>
            {stack.tag}
          </span>
          <span className="font-display text-sm" style={{ color: catColor }}>{stack.pct}%</span>
        </div>
      </div>
      {/* Mini progress bar */}
      <div className="h-0.5 bg-grey-border rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{
          width: `${stack.pct}%`,
          background: `linear-gradient(90deg, ${catColor}99, ${catColor})`,
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   Category Card
───────────────────────────────────────────── */
function CategoryCard({ cat, delay }) {
  const ref = useScrollReveal({ delay });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tilt, setTilt] = useState({ rx:0, ry:0 });
  const cardRef = useRef(null);

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    setTilt({
      rx: ((e.clientY - cy) / (rect.height/2)) * -6,
      ry: ((e.clientX - cx) / (rect.width /2)) *  6,
    });
  };

  // average pct for the category
  const avg = Math.round(cat.stacks.reduce((s, x) => s + x.pct, 0) / cat.stacks.length);

  return (
    <>
      <div ref={ref}>
        <div
          ref={cardRef}
          data-hover
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ rx:0, ry:0 })}
          onClick={() => setOpen(o => !o)}
          className="relative border border-grey-border cursor-pointer overflow-hidden transition-all duration-300"
          style={{
            background: '#111',
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: 'transform 0.25s ease, box-shadow 0.3s ease',
            boxShadow: open ? `0 0 0 1px ${cat.color}, 0 20px 50px ${cat.color}22` : 'none',
          }}
        >
          {/* Top accent */}
          <div className="h-0.5 w-full transition-all duration-300"
            style={{ background: open ? `linear-gradient(90deg,${cat.color},transparent)` : 'transparent' }} />

          {/* Header */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="font-display text-2xl tracking-widest uppercase text-white">{cat.label}</h3>
              </div>
              {/* Avg pct ring */}
              <div className="flex flex-col items-center">
                <span className="font-display text-2xl leading-none" style={{ color: cat.color }}>{avg}</span>
                <span className="text-[9px] text-grey-muted tracking-widest uppercase">avg %</span>
              </div>
            </div>

            <p className="text-xs text-grey-muted font-light leading-relaxed mb-4">{cat.desc}</p>

            {/* Mini sparkline summary */}
            <div className="flex gap-1 items-end h-8">
              {cat.stacks.map((s) => (
                <div key={s.name} className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    height: `${(s.pct / 100) * 32}px`,
                    background: `${cat.color}${open ? 'cc' : '66'}`,
                    minWidth: 0,
                  }} />
              ))}
            </div>

            {/* Expand hint */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] uppercase text-grey-muted">
                {open ? 'Click to collapse' : 'Click to expand'}
              </span>
              <span className="text-grey-muted transition-transform duration-300 text-sm"
                style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>
          </div>

          {/* Expanded stacks */}
          <div style={{
            maxHeight: open ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="px-6 pb-6 border-t border-grey-border">
              <p className="text-[10px] tracking-[0.25em] uppercase text-grey-muted pt-4 pb-2">
                Click any stack for details
              </p>
              {cat.stacks.map((s) => (
                <StackItem key={s.name} stack={s} catColor={cat.color}
                  onClick={(e) => { e.stopPropagation(); setSelected(s); }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <StackModal stack={selected} catColor={cat.color} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
export default function HowIDo() {
  return (
    <section className="relative z-10 py-32 px-[6vw] bg-coal-mid border-t border-grey-border">
      <SectionLabel>02 — Process &amp; Stack</SectionLabel>
      <SectionTitle>
        How<br />
        <em className="font-serif" style={{ color:'#c0392b', fontSize:'0.6em', fontStyle:'italic', display:'block' }}>
          I Do It
        </em>
      </SectionTitle>

      {/* Marquee */}
      <div className="overflow-hidden border-t border-b border-grey-border py-5 mb-16">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i}
              className="font-display text-sm tracking-[0.2em] uppercase flex-shrink-0"
              style={{ color: item === '·' ? '#333' : '#666' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Instruction */}
      <p className="text-[11px] tracking-[0.3em] uppercase text-grey-muted mb-8">
        — Click a category to expand · Click a skill for 3D detail view
      </p>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TECH_CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} delay={i * 0.07} />
        ))}
      </div>
    </section>
  );
}
