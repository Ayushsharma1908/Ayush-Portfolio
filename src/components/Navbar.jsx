import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'What', href: '#what' },
  { label: 'How', href: '#how' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] py-4 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1e1e1e' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a href="#" data-hover className="font-display text-xl tracking-[0.25em] uppercase text-white hover:text-red-DEFAULT transition-colors duration-300">
        AKS
      </a>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            data-hover
            className="font-body text-[11px] tracking-[0.3em] uppercase text-grey-muted hover:text-white transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href="https://github.com/Ayushsharma1908"
        target="_blank"
        rel="noreferrer"
        data-hover
        className="text-[10px] tracking-[0.25em] uppercase border border-red-DEFAULT text-red-DEFAULT px-4 py-2 hover:bg-red-DEFAULT hover:text-white transition-all duration-300"
      >
        GitHub ↗
      </a>
    </nav>
  );
}
