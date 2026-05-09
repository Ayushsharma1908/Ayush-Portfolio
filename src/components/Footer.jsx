export function PhilosophyBar() {
  return (
    <div className="relative z-10 bg-[#c0392b] py-10 px-[6vw] overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg,transparent,transparent 20px,rgba(0,0,0,0.5) 20px,rgba(0,0,0,0.5) 21px)' }} />
      <blockquote className="relative z-10 font-serif italic text-white text-xl md:text-3xl max-w-3xl">
        "First, solve the problem. Then, write the code."
      </blockquote>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#050505] border-t border-[#1a1a1a] px-[6vw] pt-16 pb-8 overflow-hidden">

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(192,57,43,0.08) 0%, transparent 70%)' }} />

      {/* Big ghost name */}
      <div className="font-display leading-none uppercase mb-12 select-none break-all"
        style={{ fontSize: 'clamp(2.5rem,8vw,8rem)', color: 'transparent', WebkitTextStroke: '1px #1e1e1e' }}>
        Ayush Kumar Sharma
      </div>

      {/* Tagline */}
      <p className="font-serif italic text-grey-muted text-lg mb-8 max-w-lg">
        Building AI-driven web apps &amp; cloud tech —{' '}
        <span style={{ color: '#c0392b' }}>one commit at a time.</span>
      </p>

      {/* Links */}
      <div className="flex gap-6 flex-wrap mb-12">
        {[
          { label: 'GitHub', url: 'https://github.com/Ayushsharma1908' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ayushkrsharma19' },
        ].map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noreferrer" data-hover
            className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase border border-[#1e1e1e] px-5 py-3 text-grey-muted hover:border-[#c0392b] hover:text-white transition-all duration-300">
            ↗ {link.label}
          </a>
        ))}
      </div>

      {/* Red divider */}
      <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,#c0392b,transparent)' }} />

      {/* Bottom */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[11px] tracking-[0.1em] text-[#333]">© Ayush Kumar Sharma — Jharkhand, India</span>
        <span className="text-[11px] tracking-[0.1em] text-[#333]">Build with - React · Three.js · Tailwind CSS</span>
      </div>
    </footer>
  );
}
