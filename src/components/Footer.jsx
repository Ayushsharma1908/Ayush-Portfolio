export function PhilosophyBar() {
  return (
    <div className="relative z-10 bg-red-DEFAULT py-10 px-[6vw] overflow-hidden flex items-center">
      {/* Diagonal stripe pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(0,0,0,0.5) 20px, rgba(0,0,0,0.5) 21px)',
        }}
      />
      <blockquote className="relative z-10 font-serif italic text-white text-xl md:text-3xl max-w-3xl">
        "First, solve the problem. Then, write the code."
      </blockquote>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 bg-black border-t border-grey-border px-[6vw] pt-16 pb-8">
      {/* Big ghost name */}
      <div
        className="font-display leading-none uppercase mb-12 select-none"
        style={{
          fontSize: 'clamp(3rem, 9vw, 9rem)',
          color: 'transparent',
          WebkitTextStroke: '1px #1a1a1a',
        }}
      >
        Ayush Kumar Sharma
      </div>

      {/* Links */}
      <div className="flex gap-6 flex-wrap mb-12">
        {[
          { label: 'GitHub', url: 'https://github.com/Ayushsharma1908' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ayushkrsharma19' },
        ].map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            data-hover
            className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-grey-muted hover:text-red-DEFAULT transition-colors duration-300"
          >
            ↗ {link.label}
          </a>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between border-t border-grey-border pt-5 flex-wrap gap-3">
        <span className="text-[11px] tracking-[0.1em] text-grey-border">© 2025 Ayush Kumar Sharma — Jharkhand, India</span>
        <span className="text-[11px] tracking-[0.1em] text-grey-border">Built with React · Three.js · Tailwind CSS</span>
      </div>
    </footer>
  );
}
