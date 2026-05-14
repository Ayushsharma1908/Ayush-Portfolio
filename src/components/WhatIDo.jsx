import { useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';

const ROLES = [
  {
    num: '01',
    title: 'Full-Stack Dev',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="m8 21 4-4 4 4"/><path d="M12 17v4"/>
        <path d="m7 8 3 3-3 3"/><path d="M13 14h4"/>
      </svg>
    ),
    desc: 'End-to-end web products — pixel-perfect React & Next.js frontends wired to Node.js/Express backends with MongoDB or PostgreSQL.',
    details: ['Component-driven UI', 'REST API design', 'Database modelling', 'Auth flows'],
    tags: ['React', 'Next.js', 'Node.js', 'MongoDB'],
  },
  {
    num: '02',
    title: 'AI-Powered Apps',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4z"/>
        <path d="M9.5 12.5 11 14l3.5-4"/>
      </svg>
    ),
    desc: 'LLMs and intelligent systems in real products — chatbots, repo analysis tools, and smart assistants that solve real problems.',
    details: ['LLM API integration', 'AI chatbot systems', 'Prompt engineering', 'Data pipelines'],
    tags: ['LLMs', 'OpenAI', 'Chatbots', 'APIs'],
  },
  {
    num: '03',
    title: 'UI / UX Craft',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="11.5" r="2.5"/>
        <circle cx="13.5" cy="17.5" r="2.5"/>
        <path d="m11 7-4.5 4m4.5 2.5-4.5 3M16 8l-2 8"/>
      </svg>
    ),
    desc: 'Design-obsessed developer. Every interaction and animation is intentional — bridging the gap between aesthetics and function.',
    details: ['Responsive layouts', 'Micro-animations', 'Figma to code', 'Accessibility'],
    tags: ['Tailwind', 'Figma', 'GSAP', 'Three.js'],
  },
  {
    num: '04',
    title: 'Scalable Products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>
      </svg>
    ),
    desc: 'From idea to deployment — clean architecture, maintainable code, and CI/CD workflows so teams move fast without breaking things.',
    details: ['Vercel deployment', 'Git strategies', 'Performance tuning', 'Open source'],
    tags: ['Vercel', 'Git', 'TypeScript', 'CI/CD'],
  },
];

function RoleCard({ role, delay }) {
  const ref     = useScrollReveal({ delay });
  const cardRef = useRef(null);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    setTilt({
      rx: ((e.clientY - cy) / (rect.height / 2)) * -6,
      ry: ((e.clientX - cx) / (rect.width  / 2)) *  6,
    });
  };

  return (
    <div ref={ref} className="h-full">
      <div
        ref={cardRef}
        data-hover
        onMouseMove={onMove}
        onMouseLeave={() => { setTilt({ rx:0, ry:0 }); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        className="group relative h-full flex flex-col overflow-hidden"
        style={{
          background:  '#0f0f0f',
          border:      `1px solid ${hovered ? '#c0392b55' : '#1e1e1e'}`,
          transform:   `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition:  'transform 0.22s ease, border-color 0.35s, box-shadow 0.35s',
          boxShadow:   hovered ? '0 20px 50px rgba(192,57,43,0.1), 0 4px 12px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top bar */}
        <div className="h-0.5 w-full flex-shrink-0"
          style={{ background: hovered ? 'linear-gradient(90deg,#c0392b,#8b1a1a,transparent)' : '#181818', transition: 'background 0.35s' }} />

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0, background: 'radial-gradient(ellipse at top left, rgba(192,57,43,0.07) 0%, transparent 60%)' }} />

        {/* Body */}
        <div className="relative z-10 flex flex-col flex-1 p-6">

          {/* Header: num + icon */}
          <div className="flex items-center justify-between mb-5">
            <span className="font-display text-[11px] tracking-[0.5em] transition-colors duration-300"
              style={{ color: hovered ? '#c0392b' : '#252525' }}>
              {role.num}
            </span>
            <div className="w-11 h-11 flex items-center justify-center border transition-all duration-350"
              style={{
                border:     `1px solid ${hovered ? '#c0392b' : '#1e1e1e'}`,
                color:      hovered ? '#c0392b' : '#2e2e2e',
                background: hovered ? 'rgba(192,57,43,0.07)' : 'transparent',
              }}>
              {role.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display uppercase text-white mb-3 leading-tight"
            style={{ fontSize: '1.45rem', letterSpacing: '0.05em' }}>
            {role.title}
          </h3>

          {/* Divider */}
          <div className="h-px mb-4 transition-colors duration-350"
            style={{ background: hovered ? '#c0392b33' : '#181818' }} />

          {/* Description */}
          <p className="font-body text-[0.82rem] leading-[1.8] text-[#666] font-light mb-5 flex-1">
            {role.desc}
          </p>

          {/* Bullet details */}
          <ul className="flex flex-col gap-2 mb-5">
            {role.details.map((d) => (
              <li key={d} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full flex-shrink-0 transition-colors duration-300"
                  style={{ background: hovered ? '#c0392b' : '#2a2a2a' }} />
                <span className="font-body text-[0.75rem] text-[#555] font-light">{d}</span>
              </li>
            ))}
          </ul>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {role.tags.map(t => (
              <span key={t}
                className="font-body text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 transition-all duration-300"
                style={{
                  border:     `1px solid ${hovered ? '#c0392b44' : '#1e1e1e'}`,
                  color:      hovered ? '#c0392b' : '#383838',
                  background: hovered ? 'rgba(192,57,43,0.04)' : 'transparent',
                }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-px flex-shrink-0 transition-all duration-350"
          style={{ background: hovered ? 'linear-gradient(90deg,transparent,#c0392b33)' : 'transparent' }} />
      </div>
    </div>
  );
}

export default function WhatIDo() {
  const introRef = useScrollReveal({ delay: 0.08, from: 'translateY(24px)' });

  return (
    <section className="relative z-10 py-28 px-[6vw] bg-[#0a0a0a] border-t border-[#1e1e1e]">
      <SectionLabel>01 — Expertise</SectionLabel>

      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <h2 className="font-display leading-none uppercase text-white"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)' }}>
          What<br />
          <em className="font-serif" style={{ color:'#c0392b', fontSize:'0.6em', fontStyle:'italic', display:'block' }}>
            I Do
          </em>
        </h2>
        <p ref={introRef}
          className="font-body text-xs text-[#444] font-light leading-relaxed max-w-[220px] md:text-right md:mb-1">
          A developer who designs.<br />A designer who ships.
        </p>
      </div>

      {/* Red divider */}
      <div className="w-full h-px mb-12" style={{ background: 'linear-gradient(90deg,#c0392b,#1e1e1e)' }} />

      {/* 2×2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map((role, i) => (
          <RoleCard key={i} role={role} delay={i * 0.09} />
        ))}
      </div>

      {/* Footer stats strip */}
      <div className="mt-12 pt-8 border-t border-[#141414] flex items-center gap-8 flex-wrap">
        {[['4', 'Core Areas'], ['15+', 'Projects'], ['2+', 'Years']].map(([n, l]) => (
          <div key={l} className="flex items-baseline gap-2">
            <span className="font-display text-xl text-white">{n}</span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#333]">{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
