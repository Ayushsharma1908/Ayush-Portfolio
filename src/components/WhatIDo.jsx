import { useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel, SectionTitle } from './SectionHelpers';

const ROLES = [
  {
    num: '01',
    title: 'Full-Stack Dev',
    desc: 'I architect and ship end-to-end web products — pixel-perfect React & Next.js frontends wired to robust Node.js/Express backends with MongoDB or PostgreSQL.',
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
  },
  {
    num: '02',
    title: 'AI-Powered Apps',
    desc: 'Integrating LLMs and intelligent systems into real products — chatbots, repo analysis tools, and smart assistants that actually solve problems at scale.',
    tags: ['LLMs', 'AI Chatbots', 'REST APIs', 'Intelligent Systems'],
  },
  {
    num: '03',
    title: 'UI / UX Craft',
    desc: 'Design-obsessed developer. Clean interfaces, thoughtful motion, the space between each interaction — where design meets function beautifully.',
    tags: ['Tailwind CSS', 'Figma', 'Motion Design', 'Responsive'],
  },
  {
    num: '04',
    title: 'Scalable Products',
    desc: 'From idea to deployment — building products with real users, real traffic, and real scalability in mind. Vercel, cloud, clean architecture.',
    tags: ['Vercel', 'Git', 'TypeScript', 'Clean Architecture'],
  },
];

function RoleCard({ role, delay }) {
  const ref = useScrollReveal({ delay });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef(null);

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      rx: ((e.clientY - cy) / (rect.height / 2)) * -7,
      ry: ((e.clientX - cx) / (rect.width / 2)) * 7,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div ref={ref}>
      <div
        ref={cardRef}
        data-hover
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative bg-coal-card border border-grey-border p-8 overflow-hidden transition-[border-color] duration-300 hover:border-grey"
        style={{
          transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.rx || tilt.ry ? '8px' : '0px'})`,
          transition: 'transform 0.2s ease, border-color 0.3s',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Red left bar */}
        <div className="absolute top-0 left-0 w-[3px] h-0 bg-red-DEFAULT group-hover:h-full transition-all duration-500 ease-out" />

        <div className="font-display text-6xl text-white/5 leading-none mb-1 select-none">{role.num}</div>
        <h3 className="font-display text-2xl tracking-widest text-white uppercase mb-3">{role.title}</h3>
        <p className="font-body text-sm leading-relaxed text-grey-muted font-light">{role.desc}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {role.tags.map(t => (
            <span
              key={t}
              className="text-[10px] tracking-[0.18em] uppercase border border-grey-border text-grey-muted px-3 py-1 group-hover:border-red-dark group-hover:text-white transition-all duration-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Glow overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(192,57,43,0.05) 0%, transparent 60%)' }}
        />
      </div>
    </div>
  );
}

export default function WhatIDo() {
  return (
    <section className="relative z-10 py-32 px-[6vw] bg-coal border-t border-grey-border">
      <SectionLabel>01 — Expertise</SectionLabel>
      <SectionTitle>
        What<br />
        <em className="font-serif not-italic" style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}>
          I Do
        </em>
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-grey-border">
        {ROLES.map((role, i) => (
          <div key={i} className="bg-coal-DEFAULT">
            <RoleCard role={role} delay={i * 0.08} />
          </div>
        ))}
      </div>
    </section>
  );
}
