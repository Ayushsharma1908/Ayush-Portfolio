import { useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';

const ROLES = [
  {
    num: '01',
    title: 'Full-Stack Development',
    shortTitle: 'Full-Stack',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="m8 21 4-4 4 4"/><path d="M12 17v4"/>
        <path d="m7 8 3 3-3 3"/><path d="M13 14h4"/>
      </svg>
    ),
    desc: 'I architect and ship end-to-end web products from the ground up. Pixel-perfect React & Next.js frontends paired with robust Node.js/Express backends, connected to MongoDB or PostgreSQL databases.',
    details: [
      'Component-driven UI architecture',
      'RESTful API design & integration',
      'Database modelling & optimisation',
      'Authentication & authorization flows',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'TypeScript'],
    accent: '#c0392b',
  },
  {
    num: '02',
    title: 'AI-Powered Applications',
    shortTitle: 'AI Apps',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
        <path d="M9.5 12.5 11 14l3.5-4"/>
      </svg>
    ),
    desc: 'Integrating large language models and intelligent systems into real-world products. From AI chatbots to repository analysis tools — building smart assistants that genuinely solve user problems.',
    details: [
      'LLM API integration (OpenAI, Gemini, Claude)',
      'Conversational UI & chatbot systems',
      'Intelligent data analysis pipelines',
      'Prompt engineering for reliable outputs',
    ],
    tags: ['LLMs', 'AI Chatbots', 'OpenAI API', 'Prompt Engineering', 'REST APIs'],
    accent: '#c0392b',
  },
  {
    num: '03',
    title: 'UI / UX Craft',
    shortTitle: 'Design',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="11.5" r="2.5"/>
        <circle cx="13.5" cy="17.5" r="2.5"/>
        <path d="m11 7-4.5 4m4.5 2.5-4.5 3M16 8l-2 8"/>
      </svg>
    ),
    desc: 'Design-obsessed developer who bridges the gap between aesthetics and function. Every interaction, animation, and layout decision is intentional — creating interfaces users love to use.',
    details: [
      'Responsive, mobile-first layouts',
      'Micro-interactions & scroll animations',
      'Figma to code, pixel-perfect delivery',
      'Accessibility-aware UI patterns',
    ],
    tags: ['Tailwind CSS', 'Figma', 'Framer Motion', 'GSAP', 'Three.js', 'Responsive'],
    accent: '#c0392b',
  },
  {
    num: '04',
    title: 'Scalable Product Building',
    shortTitle: 'Products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>
      </svg>
    ),
    desc: 'From napkin idea to live deployment — I build products designed for scale. Clean architecture, maintainable codebases, and efficient CI/CD workflows so teams can move fast without breaking things.',
    details: [
      'Vercel & cloud deployment pipelines',
      'Git branching strategies & code reviews',
      'Performance optimisation & Core Web Vitals',
      'Open-source contribution & documentation',
    ],
    tags: ['Vercel', 'Git', 'TypeScript', 'CI/CD', 'Clean Architecture', 'Open Source'],
    accent: '#c0392b',
  },
];

/* ── Individual Card ── */
function RoleCard({ role, index, delay }) {
  const ref     = useScrollReveal({ delay });
  const cardRef = useRef(null);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    setTilt({
      rx: ((e.clientY - cy) / (rect.height / 2)) * -5,
      ry: ((e.clientX - cx) / (rect.width  / 2)) *  5,
    });
  };

  /* Alternate layout: even cards flip icon to right */
  const isAlt = index % 2 !== 0;

  return (
    <div ref={ref} className="w-full">
      <div
        ref={cardRef}
        data-hover
        onMouseMove={onMove}
        onMouseLeave={() => { setTilt({ rx:0, ry:0 }); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        className="group relative w-full overflow-hidden"
        style={{
          background:    '#0f0f0f',
          border:        `1px solid ${hovered ? '#c0392b44' : '#1e1e1e'}`,
          transform:     `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition:    'transform 0.25s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          boxShadow:     hovered ? '0 24px 64px rgba(192,57,43,0.12), 0 4px 16px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top gradient bar */}
        <div className="h-0.5 w-full"
          style={{ background: hovered ? `linear-gradient(90deg, #c0392b, #8b1a1a, transparent)` : 'linear-gradient(90deg, #1e1e1e, transparent)' , transition: 'background 0.4s ease' }} />

        {/* Radial glow on hover */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0,
            background: isAlt
              ? 'radial-gradient(ellipse at top right, rgba(192,57,43,0.07) 0%, transparent 55%)'
              : 'radial-gradient(ellipse at top left,  rgba(192,57,43,0.07) 0%, transparent 55%)',
          }} />

        {/* ── Card body ── */}
        <div className="relative z-10 p-8 md:p-10">

          {/* Header row: number + title + icon */}
          <div className={`flex items-start justify-between gap-6 mb-8 ${isAlt ? 'flex-row-reverse' : ''}`}>

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              {/* Number */}
              <span className="font-display text-[11px] tracking-[0.5em] uppercase transition-colors duration-300"
                style={{ color: hovered ? '#c0392b' : '#2a2a2a' }}>
                {role.num}
              </span>

              {/* Title */}
              <h3 className="font-display uppercase leading-none tracking-wide text-white"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', letterSpacing: '0.04em' }}>
                {role.title}
              </h3>
            </div>

            {/* Icon box */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center border transition-all duration-400"
              style={{
                border:     `1px solid ${hovered ? '#c0392b' : '#1e1e1e'}`,
                color:      hovered ? '#c0392b' : '#333',
                background: hovered ? 'rgba(192,57,43,0.06)' : 'transparent',
                boxShadow:  hovered ? '0 0 20px rgba(192,57,43,0.15)' : 'none',
                transition: 'all 0.4s ease',
              }}>
              {role.icon}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-8 transition-all duration-400"
            style={{ background: hovered ? 'linear-gradient(90deg,#c0392b44,transparent)' : '#1a1a1a' }} />

          {/* Description */}
          <p className="font-body text-[0.9rem] leading-[1.85] text-[#888] font-light mb-8 max-w-none">
            {role.desc}
          </p>

          {/* Detail bullets — 2 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
            {role.details.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Bullet */}
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300"
                  style={{ background: hovered ? '#c0392b' : '#333' }} />
                <span className="font-body text-sm text-[#666] font-light leading-snug group-hover:text-[#888] transition-colors duration-300">
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {role.tags.map(t => (
              <span key={t}
                className="font-body text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 transition-all duration-300"
                style={{
                  border:     `1px solid ${hovered ? '#c0392b55' : '#1e1e1e'}`,
                  color:      hovered ? '#c0392b' : '#444',
                  background: hovered ? 'rgba(192,57,43,0.05)' : 'transparent',
                }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full transition-all duration-400"
          style={{ background: hovered ? `linear-gradient(90deg, transparent, #c0392b44)` : 'transparent' }} />
      </div>
    </div>
  );
}

/* ── Section ── */
export default function WhatIDo() {
  const introRef = useScrollReveal({ delay: 0.05, from: 'translateY(30px)' });

  return (
    <section className="relative z-10 py-32 px-[6vw] bg-[#0a0a0a] border-t border-[#1e1e1e]">
      <SectionLabel>01 — Expertise</SectionLabel>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
        <h2 className="font-display leading-none uppercase text-white"
          style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6.5rem)' }}>
          What<br />
          <em className="font-serif" style={{ color:'#c0392b', fontSize:'0.6em', fontStyle:'italic', display:'block' }}>
            I Do
          </em>
        </h2>

        {/* Intro blurb right-aligned */}
        <p ref={introRef}
          className="font-body text-sm text-[#555] font-light leading-relaxed max-w-xs md:text-right md:mb-2">
          A developer who designs. A designer who ships. Here's what I bring to every project.
        </p>
      </div>

      {/* Thin red divider */}
      <div className="w-full h-px mb-16" style={{ background: 'linear-gradient(90deg, #c0392b, #1e1e1e)' }} />

      {/* ── Cards: full-width stacked, alternating accent side ── */}
      <div className="flex flex-col gap-5">
        {ROLES.map((role, i) => (
          <RoleCard key={i} role={role} index={i} delay={i * 0.1} />
        ))}
      </div>

      {/* Bottom count strip */}
      <div className="mt-16 flex items-center gap-6 border-t border-[#1a1a1a] pt-8">
        {[['4', 'Core Areas'], ['15+', 'Projects Built'], ['2+', 'Years Building']].map(([n, l]) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-white">{n}</span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#444]">{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
