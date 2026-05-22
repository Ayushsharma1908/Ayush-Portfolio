import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';


/* ═══════════════════════════════════════════
   MINIMAL SVG ICONS
═══════════════════════════════════════════ */
const ICONS = {
  react:       <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)"/></svg>,
  nextjs:      <svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v20M3 7l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1"/></svg>,
  tailwind:    <svg viewBox="0 0 24 24"><path d="M12 5C9.5 5 8 6.5 7.5 9.5C8.5 8 9.75 7.5 11.25 8C12.25 8.25 13 9 14 10C15.5 11.5 17 13 20 13C22.5 13 24 11.5 24.5 8.5C23.5 10 22.25 10.5 20.75 10C19.75 9.75 19 9 18 8C16.5 6.5 15 5 12 5Z" fill="currentColor" opacity="0.8"/></svg>,
  typescript:  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M15 18v-1.5h-2.5V8h-2v8.5H8V18z" fill="currentColor"/><path d="M17 18l-3-4h2.5L18 16l1.5-2H22l-3 4z" fill="currentColor"/></svg>,
  html:        <svg viewBox="0 0 24 24"><path d="M4 2l2 18 6 2 6-2 2-18z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 6h10l-.5 5H12m0 0H7.5L8 16l4 1.5L16 16l-.5-3" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  nodejs:      <svg viewBox="0 0 24 24"><path d="M12 2L3 7v10l9 5 9-5V7z" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/></svg>,
  express:     <svg viewBox="0 0 24 24"><path d="M3 18l4-12 4 12M7 14h4M14 6v12l6-12v12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mongodb:     <svg viewBox="0 0 24 24"><path d="M12 2C8 6 6 10 6 14c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-8-6-12z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v18" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  postgresql:  <svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h4l1 3 2-1 2 1 1-3h-4" fill="none" stroke="currentColor" strokeWidth="1.2"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1"/></svg>,
  api:         <svg viewBox="0 0 24 24"><rect x="3" y="6" width="4" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="9" width="4" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="17" y="4" width="4" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  javascript:  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 18l2-10h2l-1 7h2l.5-3h2l-.5 4h-2l-1 2z" fill="currentColor"/></svg>,
  python:      <svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/><path d="M8 10C8 15 6 18 12 18s4-3 4-8-2-8-8-8-4 3-4 8" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M16 14c0-5 2-8-4-8s-4 3-4 8 2 8 8 8 4-3 4-8" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  sql:         <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="12" cy="6" rx="7" ry="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="6" x2="5" y2="18" stroke="currentColor" strokeWidth="1"/><line x1="19" y1="6" x2="19" y2="18" stroke="currentColor" strokeWidth="1"/></svg>,
  bash:        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M6 9l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ai:          <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="19" y1="11" x2="21" y2="11" stroke="currentColor" strokeWidth="1"/><line x1="20" y1="10" x2="20" y2="14" stroke="currentColor" strokeWidth="1"/></svg>,
  chatbot:     <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="11" r="1.2" fill="currentColor"/><circle cx="15" cy="11" r="1.2" fill="currentColor"/><path d="M8 15c0 0 1.5 1.5 4 1.5s4-1.5 4-1.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  prompt:      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="13" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  git:         <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5"/><line x1="15" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5"/></svg>,
  figma:       <svg viewBox="0 0 24 24"><rect x="6" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="11" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="11" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="7" r="1.5" fill="currentColor"/><circle cx="18" cy="15" r="1.5" fill="currentColor"/></svg>,
};

function SkillIcon({ icon, hovered }) {
  return (
    <div className="w-4 h-4" style={{ color: hovered ? '#c0392b' : '#555' }}>
      {ICONS[icon]}
    </div>
  );
}
/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React',        pct: 88, tag: 'Expert',       icon: 'react',      note: 'My primary weapon — I think in components.' },
      { name: 'Next.js',      pct: 75, tag: 'Proficient',   icon: 'nextjs',     note: 'SSR, SSG, App Router — all covered.' },
      { name: 'Tailwind CSS', pct: 85, tag: 'Expert',       icon: 'tailwind',   note: 'Utility-first CSS is my second language.' },
      { name: 'TypeScript',   pct: 70, tag: 'Proficient',   icon: 'typescript', note: 'Type-safe codebases, fewer bugs.' },
      { name: 'HTML & CSS',   pct: 92, tag: 'Expert',       icon: 'html',       note: 'The foundation — solid as rock.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js',    pct: 82, tag: 'Expert',       icon: 'nodejs',     note: 'Full async, event-loop, everything.' },
      { name: 'Express.js', pct: 80, tag: 'Expert',       icon: 'express',    note: 'REST APIs, middleware — daily driver.' },
      { name: 'MongoDB',    pct: 75, tag: 'Proficient',   icon: 'mongodb',    note: 'NoSQL schemas, aggregation pipelines.' },
      { name: 'PostgreSQL', pct: 60, tag: 'Intermediate', icon: 'postgresql', note: 'Relational DB when structure matters.' },
      { name: 'REST APIs',  pct: 85, tag: 'Expert',       icon: 'api',        note: 'Designing clean, versioned API contracts.' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'JavaScript', pct: 90, tag: 'Expert',       icon: 'javascript', note: 'The language I dream in. ES2024+.' },
      { name: 'TypeScript', pct: 70, tag: 'Proficient',   icon: 'typescript', note: 'Adding safety to JS — love it.' },
      { name: 'Python',     pct: 55, tag: 'Intermediate', icon: 'python',     note: 'Scripting, ML exploration, automation.' },
      { name: 'SQL',        pct: 62, tag: 'Intermediate', icon: 'sql',        note: 'Queries, joins, stored procedures.' },
      { name: 'Bash',       pct: 50, tag: 'Learning',     icon: 'bash',       note: 'Shell scripting for dev workflows.' },
    ],
  },
  {
    id: 'tools',
    label: 'AI & Tools',
    skills: [
      { name: 'LLM APIs',     pct: 75, tag: 'Proficient', icon: 'ai',      note: 'OpenAI, Gemini, Claude — production apps.' },
      { name: 'AI Chatbots',  pct: 78, tag: 'Proficient', icon: 'chatbot', note: 'Built "Hear Me Out" — full AI chat system.' },
      { name: 'Prompt Eng.',  pct: 72, tag: 'Proficient', icon: 'prompt',  note: 'Crafting prompts for reliable AI outputs.' },
      { name: 'Git & GitHub', pct: 85, tag: 'Expert',     icon: 'git',     note: 'Branching strategies, PRs, GitHub Actions.' },
      { name: 'Figma',        pct: 70, tag: 'Proficient', icon: 'figma',   note: 'UI design & prototyping, component libs.' },
    ],
  },
];

const TAG_META = {
  Expert:       { color: '#ff5540', bg: 'rgba(192,57,43,0.14)', border: 'rgba(192,57,43,0.45)' },
  Proficient:   { color: '#e07060', bg: 'rgba(192,57,43,0.07)', border: 'rgba(192,57,43,0.22)' },
  Intermediate: { color: '#666',    bg: 'rgba(70,70,70,0.14)',  border: 'rgba(80,80,80,0.32)'  },
  Learning:     { color: '#444',    bg: 'rgba(30,30,30,0.18)',  border: 'rgba(55,55,55,0.38)'  },
};

const MARQUEE = [
  'React','·','Next.js','·','Node.js','·','Express','·','MongoDB','·','TypeScript','·',
  'JavaScript','·','Tailwind CSS','·','PostgreSQL','·','Python','·','Figma','·',
  'Vercel','·','Git','·','REST APIs','·','LLM APIs','·','Three.js','·','GSAP','·',
  'React','·','Next.js','·','Node.js','·','Express','·','MongoDB','·','TypeScript','·',
  'JavaScript','·','Tailwind CSS','·','PostgreSQL','·','Python','·','Figma','·',
  'Vercel','·','Git','·','REST APIs','·','LLM APIs','·','Three.js','·','GSAP','·',
];

/* ═══════════════════════════════════════════
   THREE.JS SCENE
═══════════════════════════════════════════ */
function FloatingOrb() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.18;
    ref.current.rotation.y = clock.getElapsedTime() * 0.26;
  });
  return (
    <Float speed={2.6} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} scale={1.5}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial color="#c0392b" distort={0.35} speed={2} wireframe opacity={0.5} transparent />
      </mesh>
    </Float>
  );
}

function WireBox({ pos, size, speed, opacity = 0.12 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.7;
    ref.current.rotation.y = t;
  });
  return (
    <mesh ref={ref} position={pos}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#c0392b" wireframe transparent opacity={opacity} />
    </mesh>
  );
}

function Particles() {
  const ref = useRef();
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(300 * 3);
  for (let i = 0; i < 300 * 3; i++) pos[i] = (Math.random() - 0.5) * 10;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.04; });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#661111" size={0.025} transparent opacity={0.9} />
    </points>
  );
}

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 55 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} color="#c0392b" intensity={5} />
      <pointLight position={[-3, -2, 2]} color="#ff2200" intensity={2.5} />
      <FloatingOrb />
      <WireBox pos={[ 2.8,  1.2, -1]}   size={0.7} speed={0.3} opacity={0.2} />
      <WireBox pos={[-2.5, -1.0, -1]}   size={0.5} speed={0.5} opacity={0.15} />
      <WireBox pos={[ 2.0, -1.8, -2]}   size={0.9} speed={0.2} opacity={0.1} />
      <WireBox pos={[-2.2,  1.5, -1.5]} size={0.4} speed={0.4} opacity={0.13} />
      <Particles />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED PROGRESS BAR
═══════════════════════════════════════════ */
function Bar({ pct, animate }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    setW(0);
    if (!animate) return;
    const t = setTimeout(() => setW(pct), 100);
    return () => clearTimeout(t);
  }, [animate, pct]);

  return (
    <div className="relative flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: '#181818' }}>
      <div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          width: `${w}%`,
          background: 'linear-gradient(90deg, #8b1a1a, #c0392b, #ff5540)',
          boxShadow: '0 0 6px rgba(192,57,43,0.6)',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SKILL ROW
═══════════════════════════════════════════ */
function SkillRow({ skill, animate, i }) {
  const tm = TAG_META[skill.tag] || TAG_META.Intermediate;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-3 sm:gap-4 px-5 py-3.5 border-b border-[#111] last:border-b-0 transition-all duration-200 cursor-default"
      style={{
        background: hovered ? 'rgba(192,57,43,0.03)' : 'transparent',
        transitionDelay: `${i * 60}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-display text-[10px] tracking-widest border transition-all duration-300"
        style={{
          border:     `1px solid ${hovered ? 'rgba(192,57,43,0.5)' : '#1a1a1a'}`,
          color:      hovered ? '#c0392b' : '#333',
          background: hovered ? 'rgba(192,57,43,0.07)' : '#0a0a0a',
        }}
      >
  <SkillIcon icon={skill.icon} hovered={hovered} />
      </div>

      {/* Name */}
      <span
        className="font-body text-[0.82rem] font-light flex-shrink-0 transition-colors duration-200"
        style={{ width: '7.5rem', color: hovered ? '#fff' : '#888' }}
      >
        {skill.name}
      </span>

      {/* Bar */}
      <Bar pct={skill.pct} animate={animate} />

      {/* % */}
      <span
        className="font-display text-sm flex-shrink-0 text-right transition-colors duration-200"
        style={{ width: '2.2rem', color: hovered ? '#ff5540' : '#c0392b', letterSpacing: '0.04em' }}
      >
        {skill.pct}%
      </span>

      {/* Tag */}
      <div className="hidden sm:block flex-shrink-0" style={{ width: '6rem' }}>
        <span
          className="font-body text-[9px] tracking-[0.16em] uppercase px-2 py-1 block text-center"
          style={{ color: tm.color, background: tm.bg, border: `1px solid ${tm.border}` }}
        >
          {skill.tag}
        </span>
      </div>

      {/* Note — appears on hover */}
      <span
        className="hidden lg:block font-body text-[10px] leading-relaxed flex-1 transition-all duration-300"
        style={{ color: hovered ? '#444' : '#252525', fontStyle: 'italic' }}
      >
        {skill.note}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function HowIDo() {
  const [activeTab, setActiveTab] = useState('frontend');
  const [animate, setAnimate]     = useState(true);
  const sectionRef = useRef(null);
  const panelRef   = useScrollReveal({ delay: 0.12 });
  const titleRef   = useScrollReveal({ delay: 0.04, from: 'translateX(-40px)' });

  const active = CATEGORIES.find(c => c.id === activeTab);
  const avg    = Math.round(active.skills.reduce((s, x) => s + x.pct, 0) / active.skills.length);

  const switchTab = (id) => {
    if (id === activeTab) return;
    setAnimate(false);
    setTimeout(() => { setActiveTab(id); setAnimate(true); }, 60);
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-28 px-[6vw] bg-[#0d0d0d] border-t border-[#1e1e1e] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(192,57,43,0.04) 0%, transparent 70%)' }} />

      <SectionLabel>02 — Skills & Stack</SectionLabel>

      {/* ── Title row + 3D Canvas ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div ref={titleRef}>
          <h2
            className="font-display leading-none uppercase text-white"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)' }}
          >
            Skills &amp;<br />
            <em
              className="font-serif"
              style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}
            >
              Strengths
            </em>
          </h2>
          <p className="font-body text-xs text-[#3a3a3a] font-light mt-3 max-w-xs leading-relaxed">
            Every tool sharpened. Click a category — see the depth.
          </p>
        </div>

        {/* 3D canvas box */}
        <div
          className="w-full lg:w-60 h-52 lg:h-56 flex-shrink-0 relative"
          style={{ border: '1px solid #1a1a1a', background: '#070707' }}
        >
          {/* Corner marks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c0392b44]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c0392b44]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c0392b44]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c0392b44]" />
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-[10px] tracking-widest text-[#222]">LOADING 3D…</span>
              </div>
            }
          >
            <Scene3D />
          </Suspense>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-t border-b border-[#111] py-4 mb-10">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {MARQUEE.map((item, i) => (
            <span
              key={i}
              className="font-display text-[10px] tracking-[0.28em] uppercase flex-shrink-0"
              style={{ color: item === '·' ? '#1e1e1e' : '#2a2a2a' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          BIG RECTANGLE PANEL
      ══════════════════════════════ */}
      <div
        ref={panelRef}
        className="relative w-full overflow-hidden"
        style={{ border: '1px solid #1e1e1e', background: '#090909' }}
      >
        {/* Top gradient bar */}
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, #c0392b, #8b1a1a 40%, transparent)' }}
        />

        <div className="flex flex-col lg:flex-row min-h-[420px]">

          {/* ── SIDEBAR tabs ── */}
          <div
            className="flex flex-row lg:flex-col flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#111]"
            style={{ width: 'auto', minWidth: '10rem' }}
          >
            {/* Sidebar header */}
            <div className="hidden lg:flex items-center justify-between px-5 py-4 border-b border-[#111]">
              <span className="font-display text-[9px] tracking-[0.45em] uppercase text-[#282828]">
                Category
              </span>
            </div>

            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  data-hover
                  onClick={() => switchTab(cat.id)}
                  className="relative flex-1 lg:flex-none text-left px-5 py-4 flex items-center gap-2.5 transition-all duration-200"
                  style={{ background: isActive ? 'rgba(192,57,43,0.05)' : 'transparent' }}
                >
                  {/* Active bar — left on desktop, bottom on mobile */}
                  <span
                    className="hidden lg:block absolute left-0 top-0 w-[2px] h-full transition-all duration-300"
                    style={{ background: isActive ? '#c0392b' : 'transparent' }}
                  />
                  <span
                    className="lg:hidden absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300"
                    style={{ background: isActive ? '#c0392b' : 'transparent' }}
                  />

                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
                    style={{ background: isActive ? '#c0392b' : '#222' }}
                  />
                  <span
                    className="font-display text-[12px] tracking-[0.14em] uppercase transition-colors duration-200 whitespace-nowrap"
                    style={{ color: isActive ? '#fff' : '#383838' }}
                  >
                    {cat.label}
                  </span>
                  <span
                    className="hidden lg:block ml-auto font-body text-[10px] transition-colors duration-200"
                    style={{ color: isActive ? '#c0392b' : '#252525' }}
                  >
                    {cat.skills.length}
                  </span>
                </button>
              );
            })}

            {/* Avg mastery — desktop only */}
            <div className="hidden lg:flex flex-col px-5 py-5 mt-auto border-t border-[#111] gap-0.5">
              <span className="font-display text-[9px] tracking-[0.38em] uppercase text-[#242424]">
                Average Mastery
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-3xl leading-none" style={{ color: '#c0392b' }}>
                  {avg}
                </span>
                <span className="font-display text-sm" style={{ color: '#8b1a1a' }}>%</span>
              </div>
            </div>
          </div>

          {/* ── MAIN SKILL PANEL ── */}
          <div className="flex-1 flex flex-col">

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#111] flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="font-display text-base tracking-[0.12em] uppercase text-white"
                >
                  {active.label}
                </span>
                <span
                  className="font-body text-[9px] tracking-[0.22em] uppercase px-2.5 py-1"
                  style={{
                    color: '#c0392b',
                    border: '1px solid rgba(192,57,43,0.3)',
                    background: 'rgba(192,57,43,0.06)',
                  }}
                >
                  {active.skills.length} skills
                </span>
              </div>

              {/* Column labels */}
              <div className="hidden md:flex items-center gap-3 pr-1">
                {[['Skill', '7.5rem'], ['Mastery', 'flex-1'], ['%', '2.2rem'], ['Level', '6rem'], ['Note', 'flex-1']].map(
                  ([lbl, w]) => (
                    <span
                      key={lbl}
                      className="font-body text-[9px] tracking-[0.3em] uppercase text-right"
                      style={{ color: '#222', minWidth: w === 'flex-1' ? undefined : w, flex: w === 'flex-1' ? 1 : undefined }}
                    >
                      {lbl}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Skill rows */}
            <div className="flex flex-col">
              {active.skills.map((skill, i) => (
                <SkillRow
                  key={`${activeTab}-${skill.name}`}
                  skill={skill}
                  animate={animate}
                  i={i}
                />
              ))}
            </div>

            {/* Bottom stat bar */}
            <div className="flex items-center gap-5 px-5 py-3.5 border-t border-[#111] mt-auto flex-wrap">
              {Object.entries(
                active.skills.reduce((acc, s) => {
                  acc[s.tag] = (acc[s.tag] || 0) + 1;
                  return acc;
                }, {})
              ).map(([tag, count]) => {
                const tm = TAG_META[tag] || TAG_META.Intermediate;
                return (
                  <div key={tag} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: tm.color }} />
                    <span
                      className="font-body text-[9px] tracking-[0.18em] uppercase"
                      style={{ color: tm.color }}
                    >
                      {count} {tag}
                    </span>
                  </div>
                );
              })}
              <div className="ml-auto flex items-center gap-1.5">
                <span className="font-display text-[10px] tracking-[0.2em] uppercase text-[#252525]">
                  Hover a skill for complete details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          className="h-[1px] w-full"
          style={{ background: 'linear-gradient(90deg, transparent, #c0392b44)' }}
        />
      </div>
    </section>
  );
}
