import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React',        pct: 88, tag: 'Expert',       icon: 'RE', note: 'My primary weapon — I think in components.' },
      { name: 'Next.js',      pct: 75, tag: 'Proficient',   icon: 'NX', note: 'SSR, SSG, App Router — all covered.' },
      { name: 'Tailwind CSS', pct: 85, tag: 'Expert',       icon: 'TW', note: 'Utility-first CSS is my second language.' },
      { name: 'TypeScript',   pct: 70, tag: 'Proficient',   icon: 'TS', note: 'Type-safe codebases, fewer bugs.' },
      { name: 'HTML & CSS',   pct: 92, tag: 'Expert',       icon: 'HT', note: 'The foundation — solid as rock.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js',    pct: 82, tag: 'Expert',       icon: 'ND', note: 'Full async, event-loop, everything.' },
      { name: 'Express.js', pct: 80, tag: 'Expert',       icon: 'EX', note: 'REST APIs, middleware — daily driver.' },
      { name: 'MongoDB',    pct: 75, tag: 'Proficient',   icon: 'MG', note: 'NoSQL schemas, aggregation pipelines.' },
      { name: 'PostgreSQL', pct: 60, tag: 'Intermediate', icon: 'PG', note: 'Relational DB when structure matters.' },
      { name: 'REST APIs',  pct: 85, tag: 'Expert',       icon: 'AP', note: 'Designing clean, versioned API contracts.' },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'JavaScript', pct: 90, tag: 'Expert',       icon: 'JS', note: 'The language I dream in. ES2024+.' },
      { name: 'TypeScript', pct: 70, tag: 'Proficient',   icon: 'TS', note: 'Adding safety to JS — love it.' },
      { name: 'Python',     pct: 55, tag: 'Intermediate', icon: 'PY', note: 'Scripting, ML exploration, automation.' },
      { name: 'SQL',        pct: 62, tag: 'Intermediate', icon: 'SQ', note: 'Queries, joins, stored procedures.' },
      { name: 'Bash',       pct: 50, tag: 'Learning',     icon: 'SH', note: 'Shell scripting for dev workflows.' },
    ],
  },
  {
    id: 'tools',
    label: 'AI & Tools',
    skills: [
      { name: 'LLM APIs',     pct: 75, tag: 'Proficient', icon: 'AI', note: 'OpenAI, Gemini, Claude — production apps.' },
      { name: 'AI Chatbots',  pct: 78, tag: 'Proficient', icon: 'CB', note: 'Built "Hear Me Out" — full AI chat system.' },
      { name: 'Prompt Eng.',  pct: 72, tag: 'Proficient', icon: 'PR', note: 'Crafting prompts for reliable AI outputs.' },
      { name: 'Git & GitHub', pct: 85, tag: 'Expert',     icon: 'GH', note: 'Branching strategies, PRs, GitHub Actions.' },
      { name: 'Figma',        pct: 70, tag: 'Proficient', icon: 'FG', note: 'UI design & prototyping, component libs.' },
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
        {skill.icon}
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
                Avg Mastery
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
