import { useScrollReveal } from '../hooks/useScrollReveal';

export function SectionLabel({ children }) {
  const ref = useScrollReveal({ from: 'translateX(-30px)', delay: 0 });
  return (
    <p
      ref={ref}
      className="font-body text-[11px] tracking-[0.5em] text-red-DEFAULT uppercase mb-4 flex items-center gap-3"
    >
      {children}
      <span className="flex-1 max-w-[60px] h-px bg-red-dark" />
    </p>
  );
}

export function SectionTitle({ children, className = '' }) {
  const ref = useScrollReveal({ from: 'translateX(-50px)', delay: 0.08 });
  return (
    <h2
      ref={ref}
      className={`font-display leading-none uppercase text-white mb-14 ${className}`}
      style={{ fontSize: 'clamp(2.8rem, 6vw, 6.5rem)' }}
    >
      {children}
    </h2>
  );
}
