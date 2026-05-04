import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel, SectionTitle } from './SectionHelpers';

const STATS = [
  { num: '15', sup: '+', label: 'Repositories' },
  { num: '2', sup: '★', label: 'Featured Projects' },
  { num: '8', sup: '★', label: 'Stars Earned' },
  { num: '∞', sup: '', label: 'Always Learning' },
];

function StatBox({ stat, delay }) {
  const ref = useScrollReveal({ delay, from: 'translateY(30px)' });
  return (
    <div ref={ref}>
      <div
        data-hover
        className="group relative border border-grey-border p-6 overflow-hidden transition-all duration-300 hover:border-grey"
      >
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-DEFAULT scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        <div className="font-display text-5xl text-white leading-none flex items-baseline gap-1">
          {stat.num}
          {stat.sup && <sup className="text-2xl text-red-DEFAULT">{stat.sup}</sup>}
        </div>
        <div className="mt-2 text-[11px] tracking-[0.25em] uppercase text-grey-muted">{stat.label}</div>
      </div>
    </div>
  );
}

export default function About() {
  const p1 = useScrollReveal({ delay: 0.1 });
  const p2 = useScrollReveal({ delay: 0.2 });
  const p3 = useScrollReveal({ delay: 0.3 });

  return (
    <section className="relative z-10 py-32 px-[6vw] bg-coal-mid border-t border-grey-border">
      <SectionLabel>04 — About</SectionLabel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Text */}
        <div>
          <SectionTitle>
            The<br />
            <em className="font-serif" style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}>
              Developer
            </em>
          </SectionTitle>

          <div className="space-y-5">
            <p ref={p1} className="text-base leading-[1.9] text-grey-muted font-light">
              <strong className="text-white font-normal">I am</strong> a Full-Stack Developer from Jharkhand, India, obsessively building at the intersection of clean design and intelligent software.
            </p>
            <p ref={p2} className="text-base leading-[1.9] text-grey-muted font-light">
              With a focus on <strong className="text-white font-normal">React, Node.js, and AI-powered applications</strong>, I turn ideas into scalable, production-ready products that real users love. Every line of code is written with intent.
            </p>
            <p ref={p3} className="text-base leading-[1.9] text-grey-muted font-light">
              When not building, obsessing over <strong className="text-white font-normal">pixel-perfect design</strong> and the craft of clean, maintainable code. Always learning — always shipping.
            </p>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-red-DEFAULT to-transparent w-3/5" />

          <div className="mt-8 flex gap-4 flex-wrap">
            <a
              href="https://github.com/Ayushsharma1908"
              target="_blank"
              rel="noreferrer"
              data-hover
              className="inline-flex items-center gap-2 border border-grey-border text-grey-muted text-[11px] tracking-[0.25em] uppercase px-5 py-3 hover:border-red-DEFAULT hover:text-white transition-all duration-300"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/ayushkrsharma19"
              target="_blank"
              rel="noreferrer"
              data-hover
              className="inline-flex items-center gap-2 border border-grey-border text-grey-muted text-[11px] tracking-[0.25em] uppercase px-5 py-3 hover:border-red-DEFAULT hover:text-white transition-all duration-300"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <StatBox key={i} stat={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
