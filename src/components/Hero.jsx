import { useEffect, useRef } from 'react';

const ROLES = ['Full-Stack Developer', 'AI Enthusiast', 'UI/UX Craftsman'];

export default function Hero() {
  const nameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subRef = useRef(null);
  const scrollRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    // Staggered entrance
    const tl = setTimeout(() => {
      const words = nameRef.current?.querySelectorAll('.word');
      words?.forEach((w, i) => {
        setTimeout(() => {
          w.style.transform = 'translateY(0%)';
          w.style.opacity = '1';
        }, i * 150);
      });
      setTimeout(() => {
        if (eyebrowRef.current) { eyebrowRef.current.style.opacity = '1'; eyebrowRef.current.style.transform = 'translateY(0)'; }
        if (subRef.current) { subRef.current.style.opacity = '1'; subRef.current.style.transform = 'translateY(0)'; }
        if (scrollRef.current) { scrollRef.current.style.opacity = '1'; }
      }, 700);
    }, 200);

    // Role typewriter
    let ri = 0, ci = 0, deleting = false;
    const typeInterval = setInterval(() => {
      if (!roleRef.current) return;
      const current = ROLES[ri];
      if (!deleting) {
        roleRef.current.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) { deleting = true; clearInterval(typeInterval); setTimeout(() => startDelete(), 1800); }
      }
    }, 80);

    const startDelete = () => {
      const di = setInterval(() => {
        if (!roleRef.current) return;
        const current = ROLES[ri];
        roleRef.current.textContent = current.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          clearInterval(di);
          ri = (ri + 1) % ROLES.length;
          deleting = false;
          ci = 0;
          setTimeout(startType, 400);
        }
      }, 40);
    };

    const startType = () => {
      const ti = setInterval(() => {
        if (!roleRef.current) return;
        const current = ROLES[ri];
        roleRef.current.textContent = current.slice(0, ci + 1);
        ci++;
        if (ci === current.length) { clearInterval(ti); setTimeout(startDelete, 1800); }
      }, 80);
    };

    // Scroll parallax on name
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      if (!nameRef.current) return;
      const progress = sy / vh;
      nameRef.current.style.transform = `translateY(${sy * 0.4}px) scale(${1 - progress * 0.15})`;
      nameRef.current.style.opacity = Math.max(0, 1 - progress * 1.5);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      clearTimeout(tl);
      clearInterval(typeInterval);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="relative w-screen h-screen flex items-center justify-center overflow-hidden z-10">
      {/* Floating geometric decorations */}
      {[
        { w: 80, h: 80, top: '14%', left: '7%', delay: '0s', dur: '9s' },
        { w: 44, h: 44, top: '72%', left: '86%', delay: '2s', dur: '7s' },
        { w: 120, h: 120, top: '78%', left: '4%', delay: '4s', dur: '11s' },
        { w: 60, h: 60, top: '18%', left: '82%', delay: '1s', dur: '8s' },
        { w: 30, h: 30, top: '50%', left: '92%', delay: '3s', dur: '10s' },
      ].map((f, i) => (
        <div
          key={i}
          className="absolute border border-red/10 float-anim pointer-events-none"
          style={{ width: f.w, height: f.h, top: f.top, left: f.left, animationDelay: f.delay, animationDuration: f.dur }}
        />
      ))}

      {/* Red accent line left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-red-DEFAULT" />
        <span className="text-[10px] tracking-[0.4em] rotate-90 text-grey-muted uppercase whitespace-nowrap">Portfolio 2025</span>
        <div className="w-px h-24 bg-gradient-to-t from-transparent to-red-DEFAULT" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center select-none">
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="font-body text-xs tracking-[0.5em] text-red-DEFAULT uppercase mb-4"
          style={{ opacity: 0, transform: 'translateY(-12px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
        >
          Full-Stack Developer &nbsp;/&nbsp; AI Enthusiast &nbsp;/&nbsp; India
        </p>

        {/* NAME — giant display */}
        <div
          ref={nameRef}
          className="font-display leading-none text-center"
          style={{
            fontSize: 'clamp(4.5rem, 14vw, 14rem)',
            transition: 'transform 0.1s linear, opacity 0.1s linear',
          }}
        >
          {['AYUSH', 'KUMAR', 'SHARMA'].map((word, i) => (
            <div key={i} className="overflow-hidden block">
              <span
                className="word block"
                style={{
                  transform: 'translateY(110%)',
                  opacity: 0,
                  transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s, opacity 0.6s ease ${i * 0.15}s`,
                  background: 'linear-gradient(135deg, #f0f0f0 20%, #c0392b 120%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Typewriter role */}
        <div
          ref={subRef}
          className="mt-6 flex items-center justify-center gap-2"
          style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s' }}
        >
          <span className="font-serif italic text-grey-muted text-lg md:text-2xl">—</span>
          <span
            ref={roleRef}
            className="font-serif italic text-grey-muted text-lg md:text-2xl tracking-wide"
          />
          <span className="w-0.5 h-6 bg-red-DEFAULT animate-blink" />
        </div>

        {/* Location badge */}
        <div className="mt-6 inline-flex items-center gap-2 border border-grey-border px-4 py-2 text-[11px] tracking-[0.25em] uppercase text-grey-muted">
          <span>📍</span> Jharkhand, India · UTC +05:30
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0, transition: 'opacity 1s ease 1.4s' }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase text-grey-muted">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-red-DEFAULT to-transparent animate-scroll-line" />
      </div>
    </section>
  );
}
