import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel, SectionTitle } from './SectionHelpers';

const PROJECTS = [
  {
    num: '01',
    name: 'Repolens',
    desc: 'AI-powered tool that helps beginners understand any public GitHub repository in seconds — code analysis, structure breakdown, instant explanations.',
    lang: 'JavaScript',
    stars: 4,
    url: 'https://github.com/Ayushsharma1908/Repolens',
    year: '2024',
    type: 'AI Tool',
  },
  {
    num: '02',
    name: 'Hear Me Out',
    desc: 'Full-stack AI chatbot web app with real-time conversations and an intelligent assistant. React frontend + Node.js/Express backend architecture.',
    lang: 'JavaScript',
    stars: 4,
    url: 'https://github.com/Ayushsharma1908/hear-me-out',
    year: '2024',
    type: 'Full-Stack',
  },
  {
    num: '03',
    name: 'More Projects',
    desc: '15+ repositories spanning full-stack apps, AI integrations, scalable backend services, and open-source tools built with modern web tech.',
    lang: 'Various',
    stars: null,
    url: 'https://github.com/Ayushsharma1908',
    year: '2024—',
    type: 'Open Source',
  },
];

function ProjectRow({ project, delay }) {
  const ref = useScrollReveal({ delay, from: 'translateY(30px)' });
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref}>
      <div
        data-hover
        className="group relative grid items-center gap-6 py-7 border-b border-grey-border cursor-pointer overflow-hidden"
        style={{ gridTemplateColumns: 'auto 1fr auto auto' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => window.open(project.url, '_blank')}
      >
        {/* Hover BG sweep */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, rgba(192,57,43,0.04) 0%, transparent 70%)',
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Number */}
        <span className="font-display text-base tracking-[0.25em] transition-colors duration-300 min-w-[3rem]"
          style={{ color: hovered ? '#c0392b' : '#333' }}>
          {project.num}
        </span>

        {/* Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="font-display uppercase leading-none transition-all duration-300 truncate"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
              letterSpacing: '0.03em',
              color: hovered ? '#c0392b' : '#f0f0f0',
            }}
          >
            {project.name}
          </h3>
          <p className="text-sm text-grey-muted font-light leading-relaxed max-w-xl hidden md:block">{project.desc}</p>
        </div>

        {/* Meta */}
        <div className="hidden sm:flex flex-col items-end gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase border border-grey-border text-grey-muted px-3 py-1">{project.lang}</span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-grey-muted">{project.type}</span>
          {project.stars && (
            <span className="text-[11px] text-grey-muted">★ {project.stars}</span>
          )}
        </div>

        {/* Arrow */}
        <span
          className="text-2xl transition-all duration-300"
          style={{
            color: hovered ? '#c0392b' : '#333',
            transform: hovered ? 'translate(6px,-6px)' : 'none',
          }}
        >
          ↗
        </span>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="relative z-10 py-32 px-[6vw] bg-coal border-t border-grey-border">
      <SectionLabel>03 — Work</SectionLabel>
      <SectionTitle>
        Featured<br />
        <em className="font-serif" style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}>
          Projects
        </em>
      </SectionTitle>

      <div>
        <div className="flex items-center gap-6 pb-4 border-b border-grey-border">
          <span className="text-[10px] tracking-[0.3em] uppercase text-grey-muted">Project</span>
          <span className="ml-auto hidden sm:block text-[10px] tracking-[0.3em] uppercase text-grey-muted">Stack</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-grey-muted mr-8">Link</span>
        </div>

        {PROJECTS.map((p, i) => (
          <ProjectRow key={i} project={p} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
