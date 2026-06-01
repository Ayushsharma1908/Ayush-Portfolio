import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';

/* ═══════════════════════════════════════════
   SVG ICONS — real tech logos, red/grey tinted
═══════════════════════════════════════════ */
const ICONS = {
  React: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="2.05" ry="2.05" fill="currentColor"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="currentColor" strokeWidth="1.1" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  NextJS: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.2 14.4V7.6l6.8 8.8H16L9.6 8.4v8H8.8z"/>
    </svg>
  ),
  Tailwind: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 17.15 9.5 18.3 12 18.3c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z"/>
    </svg>
  ),
  TypeScript: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6 10h6M9 10v6M14 14c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  HTML: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 3l1.5 16.5L12 21l6.5-1.5L20 3H4zm13 4H7.5l.2 2h9l-.6 6.5L12 17l-4.1-1.5-.3-3h2l.2 1.8L12 15l2.2-.7.2-2.3H7.4L7 7z"/>
    </svg>
  ),
  NodeJS: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.31L19.08 8 12 11.69 4.92 8 12 4.31zM4.5 9.46l7 3.87v7.21L4.5 16.67V9.46zm8.5 11.08v-7.21l7-3.87v7.21l-7 3.87z"/>
    </svg>
  ),
  Express: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12h14M3 7h18M3 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="19" cy="17" r="2" fill="currentColor"/>
    </svg>
  ),
  MongoDB: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 2 7.5 4 7.5 7c0 2.5 1.2 4.5 3 5.5v7.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V12.5c1.8-1 3-3 3-5.5C16.5 4 14.5 2 12 2z"/>
    </svg>
  ),
  PostgreSQL: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <ellipse cx="12" cy="7" rx="8" ry="3.5"/>
      <path d="M4 7v10c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5V7"/>
      <path d="M4 12c0 1.93 3.58 3.5 8 3.5s8-1.57 8-3.5"/>
    </svg>
  ),
  JavaScript: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 16c0 1.1.9 2 2 2s2-.9 2-2V10M16 10v4a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  Python: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-2.8 0-5 1.3-5 3v2h5v1H7c-2.2 0-4 1.8-4 4v3c0 2.2 1.8 4 4 4h1v-2c0-1.7 1.3-3 3-3h4c1.7 0 3-1.3 3-3V7c0-2.8-2.2-5-5-5zm-1.5 2.5a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
      <path d="M12 22c2.8 0 5-1.3 5-3v-2h-5v-1h5c2.2 0 4-1.8 4-4v-3c0-2.2-1.8-4-4-4h-1v2c0 1.7-1.3 3-3 3H9c-1.7 0-3 1.3-3 3v3c0 2.8 2.2 5 5 5zm1.5-2.5a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
    </svg>
  ),
  SQL: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <ellipse cx="12" cy="6" rx="8" ry="3"/>
      <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
      <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
      <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
    </svg>
  ),
  Bash: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <path d="M6 8l4 4-4 4M12 16h6"/>
    </svg>
  ),
  OpenAI: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.28 9.77a5.85 5.85 0 00-.5-4.8 6 6 0 00-6.44-2.87 5.85 5.85 0 00-4.41-2A6 6 0 005 3.8a5.85 5.85 0 00-3.9 2.83 6 6 0 00.74 7 5.85 5.85 0 00.5 4.8 6 6 0 006.44 2.87 5.85 5.85 0 004.41 2A6 6 0 0019 19.2a5.85 5.85 0 003.9-2.83 6 6 0 00-.62-6.6zM14 20.85a4.45 4.45 0 01-2.85-.95l.14-.08 4.73-2.73a.77.77 0 00.39-.68V11l2 1.15a.07.07 0 01.04.06v5.52A4.49 4.49 0 0114 20.85zm-9.63-4.13a4.45 4.45 0 01-.53-3l.14.08 4.73 2.73a.79.79 0 00.78 0l5.77-3.33v2.3a.08.08 0 01-.03.07L10.5 18.3a4.49 4.49 0 01-6.13-1.58zM3.61 8.29A4.45 4.45 0 016.46 6.3v5.58a.77.77 0 00.39.67l5.77 3.33-2 1.15a.08.08 0 01-.08 0L5.83 14a4.49 4.49 0 01-2.22-5.71zM19.69 13l-5.77-3.33 2-1.15a.08.08 0 01.08 0l4.72 2.73a4.48 4.48 0 01-.69 8.08v-5.58a.77.77 0 00-.34-.75zm2-3.08l-.14-.08-4.73-2.73a.79.79 0 00-.78 0L10.27 10.4V8.1a.08.08 0 01.03-.07L15 5.3a4.48 4.48 0 016.72 4.62zm-12.54 4.12l-2-1.15a.08.08 0 01-.04-.06V7.31a4.48 4.48 0 017.35-3.44l-.14.08-4.73 2.73a.77.77 0 00-.39.67v6.67zm1.09-2.35l2.57-1.49 2.57 1.48v3l-2.57 1.48-2.57-1.48V11.7z"/>
    </svg>
  ),
  Chatbot: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      <path d="M8 10h.01M12 10h.01M16 10h.01"/>
    </svg>
  ),
  Prompt: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Git: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.13 11.57L12.43.87a1.37 1.37 0 00-1.93 0L8.37 3l2.43 2.43a1.62 1.62 0 012.05 2.05L15.17 9.8a1.62 1.62 0 11-1 1l-2.2-2.2V16a1.62 1.62 0 11-1.33 0V8.49a1.62 1.62 0 01-.88-2.13L7.4 4l-6.53 6.53a1.37 1.37 0 000 1.93l10.7 10.7a1.37 1.37 0 001.93 0l9.63-9.63a1.37 1.37 0 000-1.96z"/>
    </svg>
  ),
  Figma: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2a3 3 0 000 6h3V2H8zm3 0h3a3 3 0 010 6h-3V2zm0 7h3a3 3 0 010 6h-3V9zm0 7h3a3 3 0 010 6H8a3 3 0 010-6h3zm-3-7a3 3 0 000 6h3V9H8z"/>
    </svg>
  ),
  REST: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12H3M3 12l4-4M3 12l4 4M21 6l-4 4M21 6l-4-4M21 18l-4-4M21 18l-4 4"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   DATA  (icon keys match ICONS map)
═══════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'frontend', label: 'Frontend',
    skills: [
      { name: 'React',        pct: 88, tag: 'Expert',       iconKey: 'React',      note: 'My primary weapon — I think in components.' },
      { name: 'Next.js',      pct: 75, tag: 'Proficient',   iconKey: 'NextJS',     note: 'SSR, SSG, App Router — all covered.' },
      { name: 'Tailwind CSS', pct: 85, tag: 'Expert',       iconKey: 'Tailwind',   note: 'Utility-first CSS is my second language.' },
      { name: 'TypeScript',   pct: 70, tag: 'Proficient',   iconKey: 'TypeScript', note: 'Type-safe codebases, fewer bugs.' },
      { name: 'HTML & CSS',   pct: 92, tag: 'Expert',       iconKey: 'HTML',       note: 'The foundation — solid as rock.' },
    ],
  },
  {
    id: 'backend', label: 'Backend',
    skills: [
      { name: 'Node.js',    pct: 82, tag: 'Expert',       iconKey: 'NodeJS',     note: 'Full async, event-loop, everything.' },
      { name: 'Express.js', pct: 80, tag: 'Expert',       iconKey: 'Express',    note: 'REST APIs, middleware — daily driver.' },
      { name: 'MongoDB',    pct: 75, tag: 'Proficient',   iconKey: 'MongoDB',    note: 'NoSQL schemas, aggregation pipelines.' },
      { name: 'PostgreSQL', pct: 60, tag: 'Intermediate', iconKey: 'PostgreSQL', note: 'Relational DB when structure matters.' },
      { name: 'REST APIs',  pct: 85, tag: 'Expert',       iconKey: 'REST',       note: 'Designing clean, versioned API contracts.' },
    ],
  },
  {
    id: 'languages', label: 'Languages',
    skills: [
      { name: 'JavaScript', pct: 90, tag: 'Expert',       iconKey: 'JavaScript', note: 'The language I dream in. ES2024+.' },
      { name: 'TypeScript', pct: 70, tag: 'Proficient',   iconKey: 'TypeScript', note: 'Adding safety to JS — love it.' },
      { name: 'Python',     pct: 55, tag: 'Intermediate', iconKey: 'Python',     note: 'Scripting, ML exploration, automation.' },
      { name: 'SQL',        pct: 62, tag: 'Intermediate', iconKey: 'SQL',        note: 'Queries, joins, stored procedures.' },
      { name: 'Bash',       pct: 50, tag: 'Learning',     iconKey: 'Bash',       note: 'Shell scripting for dev workflows.' },
    ],
  },
  {
    id: 'tools', label: 'AI & Tools',
    skills: [
      { name: 'LLM APIs',     pct: 75, tag: 'Proficient', iconKey: 'OpenAI',  note: 'OpenAI, Gemini, Claude — production apps.' },
      { name: 'AI Chatbots',  pct: 78, tag: 'Proficient', iconKey: 'Chatbot', note: 'Built "Hear Me Out" — full AI chat system.' },
      { name: 'Prompt Eng.',  pct: 72, tag: 'Proficient', iconKey: 'Prompt',  note: 'Crafting prompts for reliable AI outputs.' },
      { name: 'Git & GitHub', pct: 85, tag: 'Expert',     iconKey: 'Git',     note: 'Branching strategies, PRs, GitHub Actions.' },
      { name: 'Figma',        pct: 70, tag: 'Proficient', iconKey: 'Figma',   note: 'UI design & prototyping, component libs.' },
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
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
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
      <WireBox pos={[ 2.8,  1.2, -1]}    size={0.7} speed={0.3} opacity={0.2} />
      <WireBox pos={[-2.5, -1.0, -1]}    size={0.5} speed={0.5} opacity={0.15} />
      <WireBox pos={[ 2.0, -1.8, -2]}    size={0.9} speed={0.2} opacity={0.1} />
      <WireBox pos={[-2.2,  1.5, -1.5]}  size={0.4} speed={0.4} opacity={0.13} />
      <Particles />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED BAR
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
        style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${w}%`,
          background: 'linear-gradient(90deg, #8b1a1a, #c0392b, #ff5540)',
          boxShadow: '0 0 6px rgba(192,57,43,0.6)',
          borderRadius: '999px',
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
  const IconComp = ICONS[skill.iconKey] || ICONS.REST;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-3 sm:gap-4 px-5 py-3.5 border-b border-[#111] last:border-b-0 transition-colors duration-200"
      style={{ background: hovered ? 'rgba(192,57,43,0.025)' : 'transparent' }}
    >
      {/* Icon — real SVG, tinted with portfolio colors */}
      <div
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center border transition-all duration-300"
        style={{
          border:     `1px solid ${hovered ? 'rgba(192,57,43,0.5)' : '#1a1a1a'}`,
          color:      hovered ? '#c0392b' : '#2e2e2e',
          background: hovered ? 'rgba(192,57,43,0.07)' : '#0a0a0a',
          boxShadow:  hovered ? '0 0 12px rgba(192,57,43,0.15)' : 'none',
        }}
      >
        <IconComp size={18} />
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
        style={{ width: '2.5rem', color: hovered ? '#ff5540' : '#c0392b', letterSpacing: '0.04em' }}
      >
        {skill.pct}%
      </span>

      {/* Tag */}
      <div className="hidden sm:block flex-shrink-0" style={{ width: '6.2rem' }}>
        <span
          className="font-body text-[9px] tracking-[0.16em] uppercase px-2 py-1 block text-center"
          style={{ color: tm.color, background: tm.bg, border: `1px solid ${tm.border}` }}
        >
          {skill.tag}
        </span>
      </div>

      {/* Note */}
      <span
        className="hidden lg:block font-body text-[10px] leading-relaxed flex-1 transition-all duration-300"
        style={{ color: hovered ? '#444' : '#1e1e1e', fontStyle: 'italic' }}
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

  const panelRef = useScrollReveal({ delay: 0.12 });
  const titleRef = useScrollReveal({ delay: 0.04, from: 'translateX(-40px)' });

  const active = CATEGORIES.find(c => c.id === activeTab);
  const avg    = Math.round(active.skills.reduce((s, x) => s + x.pct, 0) / active.skills.length);

  const switchTab = (id) => {
    if (id === activeTab) return;
    setAnimate(false);
    setTimeout(() => { setActiveTab(id); setAnimate(true); }, 60);
  };

  return (
    <section className="relative z-10 py-28 px-[6vw] bg-[#0d0d0d] border-t border-[#1e1e1e] overflow-hidden">
      {/* bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(192,57,43,0.04) 0%, transparent 70%)' }} />

      <SectionLabel>02 — Skills & Stack</SectionLabel>

      {/* ── Title + 3D Canvas ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div ref={titleRef}>
          <h2 className="font-display leading-none uppercase text-white"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)' }}>
            Skills &amp;<br />
            <em className="font-serif" style={{ color:'#c0392b', fontSize:'0.6em', fontStyle:'italic', display:'block' }}>
              Strengths
            </em>
          </h2>
          <p className="font-body text-xs text-[#3a3a3a] font-light mt-3 max-w-xs leading-relaxed">
            Every tool sharpened. Click a category — see the depth.
          </p>
        </div>

        {/* 3D box */}
        <div className="w-full lg:w-60 h-52 lg:h-56 flex-shrink-0 relative"
          style={{ border:'1px solid #1a1a1a', background:'#070707' }}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#c0392b44]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#c0392b44]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#c0392b44]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c0392b44]" />
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-[10px] tracking-widest text-[#222]">LOADING 3D…</span>
            </div>
          }>
            <Scene3D />
          </Suspense>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-t border-b border-[#111] py-4 mb-10">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {MARQUEE.map((item, i) => (
            <span key={i}
              className="font-display text-[10px] tracking-[0.28em] uppercase flex-shrink-0"
              style={{ color: item === '·' ? '#1e1e1e' : '#2a2a2a' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          BIG PANEL
      ══════════════════════════════ */}
      <div ref={panelRef} className="relative w-full overflow-hidden"
        style={{ border:'1px solid #1e1e1e', background:'#090909' }}>

        {/* Top bar */}
        <div className="h-[2px] w-full"
          style={{ background:'linear-gradient(90deg,#c0392b,#8b1a1a 40%,transparent)' }} />

        <div className="flex flex-col lg:flex-row min-h-[420px]">

          {/* ── SIDEBAR ── */}
          <div className="flex flex-row lg:flex-col flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#111]"
            style={{ minWidth: '10rem' }}>

            <div className="hidden lg:flex items-center px-5 py-4 border-b border-[#111]">
              <span className="font-display text-[9px] tracking-[0.45em] uppercase text-[#282828]">Category</span>
            </div>

            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button key={cat.id} data-hover onClick={() => switchTab(cat.id)}
                  className="relative flex-1 lg:flex-none text-left px-5 py-4 flex items-center gap-2.5 transition-all duration-200"
                  style={{ background: isActive ? 'rgba(192,57,43,0.05)' : 'transparent' }}>
                  <span className="hidden lg:block absolute left-0 top-0 w-[2px] h-full transition-all duration-300"
                    style={{ background: isActive ? '#c0392b' : 'transparent' }} />
                  <span className="lg:hidden absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300"
                    style={{ background: isActive ? '#c0392b' : 'transparent' }} />
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200"
                    style={{ background: isActive ? '#c0392b' : '#222' }} />
                  <span className="font-display text-[12px] tracking-[0.14em] uppercase transition-colors duration-200 whitespace-nowrap"
                    style={{ color: isActive ? '#fff' : '#383838' }}>
                    {cat.label}
                  </span>
                  <span className="hidden lg:block ml-auto font-body text-[10px] transition-colors duration-200"
                    style={{ color: isActive ? '#c0392b' : '#252525' }}>
                    {cat.skills.length}
                  </span>
                </button>
              );
            })}

            {/* Avg mastery */}
            <div className="hidden lg:flex flex-col px-5 py-5 mt-auto border-t border-[#111] gap-0.5">
              <span className="font-display text-[9px] tracking-[0.38em] uppercase text-[#242424]">Avg Mastery</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-3xl leading-none" style={{ color:'#c0392b' }}>{avg}</span>
                <span className="font-display text-sm" style={{ color:'#8b1a1a' }}>%</span>
              </div>
            </div>
          </div>

          {/* ── SKILL PANEL ── */}
          <div className="flex-1 flex flex-col">

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#111] flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-base tracking-[0.12em] uppercase text-white">{active.label}</span>
                <span className="font-body text-[9px] tracking-[0.22em] uppercase px-2.5 py-1"
                  style={{ color:'#c0392b', border:'1px solid rgba(192,57,43,0.3)', background:'rgba(192,57,43,0.06)' }}>
                  {active.skills.length} skills
                </span>
              </div>
              {/* Col labels */}
              <div className="hidden lg:flex items-center gap-4 pr-1 text-[9px] tracking-[0.28em] uppercase"
                style={{ color: '#1e1e1e' }}>
                <span style={{ width:'2.25rem' }}>Icon</span>
                <span style={{ width:'7.5rem' }}>Skill</span>
                <span className="flex-1 text-center">Mastery</span>
                <span style={{ width:'2.5rem' }}>%</span>
                <span style={{ width:'6.2rem', textAlign:'center' }}>Level</span>
                <span className="flex-1">Note</span>
              </div>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
              {active.skills.map((skill, i) => (
                <SkillRow key={`${activeTab}-${skill.name}`} skill={skill} animate={animate} i={i} />
              ))}
            </div>

            {/* Bottom stat bar */}
            <div className="flex items-center gap-5 px-5 py-3.5 border-t border-[#111] mt-auto flex-wrap">
              {Object.entries(
                active.skills.reduce((acc, s) => { acc[s.tag] = (acc[s.tag]||0)+1; return acc; }, {})
              ).map(([tag, count]) => {
                const tm = TAG_META[tag] || TAG_META.Intermediate;
                return (
                  <div key={tag} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: tm.color }} />
                    <span className="font-body text-[9px] tracking-[0.18em] uppercase" style={{ color: tm.color }}>
                      {count} {tag}
                    </span>
                  </div>
                );
              })}
              <span className="ml-auto font-display text-[9px] tracking-[0.2em] uppercase text-[#252525]">
                Hover a skill for details
              </span>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="h-[1px] w-full"
          style={{ background:'linear-gradient(90deg,transparent,#c0392b44)' }} />
      </div>
    </section>
  );
}
