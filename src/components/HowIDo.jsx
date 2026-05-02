import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel, SectionTitle } from './SectionHelpers';

const MARQUEE_ITEMS = [
  'React', '·', 'Node.js', '·', 'TypeScript', '·', 'MongoDB', '·',
  'Next.js', '·', 'PostgreSQL', '·', 'Tailwind CSS', '·', 'Express.js', '·',
  'Figma', '·', 'Vercel', '·', 'Git', '·', 'REST APIs', '·',
  'React', '·', 'Node.js', '·', 'TypeScript', '·', 'MongoDB', '·',
  'Next.js', '·', 'PostgreSQL', '·', 'Tailwind CSS', '·', 'Express.js', '·',
  'Figma', '·', 'Vercel', '·', 'Git', '·', 'REST APIs', '·',
];

const STACKS = [
  {
    icon: '⚡',
    title: 'Frontend',
    items: ['React & Next.js', 'TypeScript / JavaScript', 'Tailwind CSS', 'HTML5 & CSS3'],
    accent: true,
  },
  {
    icon: '🛠',
    title: 'Backend',
    items: ['Node.js & Express', 'REST APIs', 'MongoDB', 'PostgreSQL'],
    accent: false,
  },
  {
    icon: '🤖',
    title: 'AI & Cloud',
    items: ['LLM Integration', 'Intelligent Chatbots', 'Vercel Deployment', 'Cloud Architecture'],
    accent: false,
  },
  {
    icon: '🎨',
    title: 'Design',
    items: ['Figma', 'Pixel-Perfect UI', 'Motion & Animation', 'Clean UX Patterns'],
    accent: false,
  },
  {
    icon: '🔧',
    title: 'DevOps',
    items: ['Git & GitHub', 'VS Code', 'CI/CD Pipelines', 'Open Source'],
    accent: false,
  },
  {
    icon: '🚀',
    title: 'Mindset',
    items: ['Always Learning', 'Scalable Architecture', 'Clean Code Culture', 'Open Source Advocate'],
    accent: false,
  },
];

function StackCard({ card, delay }) {
  const ref = useScrollReveal({ delay });
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      rx: ((e.clientY - cy) / (rect.height / 2)) * -8,
      ry: ((e.clientX - cx) / (rect.width / 2)) * 8,
    });
  };

  return (
    <div ref={ref}>
      <div
        data-hover
        onMouseMove={onMove}
        onMouseLeave={() => { setTilt({ rx: 0, ry: 0 }); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        className="relative bg-coal-card border border-grey-border p-7 h-full transition-all duration-300"
        style={{
          transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovered ? '12px' : '0'})`,
          transition: 'transform 0.25s ease',
          boxShadow: hovered ? '0 24px 50px rgba(192,57,43,0.12), 0 0 0 1px #8b1a1a' : 'none',
        }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-red-dark/30 transition-all duration-300"
          style={{ borderColor: hovered ? 'rgba(192,57,43,0.6)' : 'rgba(139,26,26,0.3)' }}
        />

        <div className="text-3xl mb-4">{card.icon}</div>
        <h3 className="font-display text-2xl tracking-widest uppercase text-white mb-4">{card.title}</h3>
        <ul className="space-y-2">
          {card.items.map(item => (
            <li key={item} className="flex items-center gap-2 text-sm text-grey-muted font-light">
              <span className="w-4 h-px bg-red-dark flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HowIDo() {
  return (
    <section className="relative z-10 py-32 px-[6vw] bg-coal-mid border-t border-grey-border">
      <SectionLabel>02 — Process & Stack</SectionLabel>
      <SectionTitle>
        How<br />
        <em className="font-serif" style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}>
          I Do It
        </em>
      </SectionTitle>

      {/* Marquee */}
      <div className="overflow-hidden border-t border-b border-grey-border py-5 mb-16">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="font-display text-sm tracking-[0.2em] uppercase flex-shrink-0 transition-colors duration-200"
              style={{ color: item === '·' ? '#333' : '#555' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STACKS.map((card, i) => (
          <StackCard key={i} card={card} delay={i * 0.07} />
        ))}
      </div>
    </section>
  );
}
