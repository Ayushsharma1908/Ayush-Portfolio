import { useEffect, useRef } from 'react';

const ROLES = ['Full-Stack Developer', 'AI Enthusiast', 'UI/UX Craftsman'];

export default function Hero() {
  const nameRef   = useRef(null);
  const eyebrowRef = useRef(null);
  const subRef    = useRef(null);
  const scrollRef = useRef(null);
  const roleRef   = useRef(null);

  useEffect(() => {
    // Staggered entrance
    setTimeout(() => {
      const words = nameRef.current?.querySelectorAll('.word');
      words?.forEach((w, i) => {
        setTimeout(() => {
          w.style.transform = 'translateY(0%)';
          w.style.opacity   = '1';
        }, i * 160);
      });
      setTimeout(() => {
        if (eyebrowRef.current) {
          eyebrowRef.current.style.opacity   = '1';
          eyebrowRef.current.style.transform = 'translateY(0)';
        }
        if (subRef.current) {
          subRef.current.style.opacity   = '1';
          subRef.current.style.transform = 'translateY(0)';
        }
        if (scrollRef.current) scrollRef.current.style.opacity = '1';
      }, 750);
    }, 200);

    // Typewriter
    let ri = 0, ci = 0;
    const startType = () => {
      const ti = setInterval(() => {
        if (!roleRef.current) return;
        const cur = ROLES[ri];
        roleRef.current.textContent = cur.slice(0, ci + 1);
        ci++;
        if (ci === cur.length) {
          clearInterval(ti);
          setTimeout(startDelete, 1800);
        }
      }, 80);
    };
    const startDelete = () => {
      const di = setInterval(() => {
        if (!roleRef.current) return;
        const cur = ROLES[ri];
        roleRef.current.textContent = cur.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          clearInterval(di);
          ri = (ri + 1) % ROLES.length;
          setTimeout(startType, 400);
        }
      }, 40);
    };
    startType();

    // Scroll parallax
    const onScroll = () => {
      if (!nameRef.current) return;
      const p = window.scrollY / window.innerHeight;
      nameRef.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(${1 - p * 0.12})`;
      nameRef.current.style.opacity   = Math.max(0, 1 - p * 1.6);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Layout:
     Two lines → "AYUSH KUMAR" on top, "SHARMA" below
     Push content down with pt-28 so it clears the ~80px navbar
  ─────────────────────────────────────────────────────────── */
  return (
    <section className="relative w-screen h-screen flex items-center justify-center overflow-hidden z-10">

      {/* Floating boxes */}
      {[
        { w:80,  h:80,  top:'14%', left:'7%',  delay:'0s',  dur:'9s'  },
        { w:44,  h:44,  top:'72%', left:'86%', delay:'2s',  dur:'7s'  },
        { w:120, h:120, top:'78%', left:'4%',  delay:'4s',  dur:'11s' },
        { w:60,  h:60,  top:'18%', left:'82%', delay:'1s',  dur:'8s'  },
        { w:30,  h:30,  top:'50%', left:'92%', delay:'3s',  dur:'10s' },
      ].map((f,i) => (
        <div key={i} className="absolute border border-red/10 float-anim pointer-events-none"
          style={{ width:f.w, height:f.h, top:f.top, left:f.left,
                   animationDelay:f.delay, animationDuration:f.dur }} />
      ))}

      {/* Left accent line */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#c0392b]" />
        <span className="text-[10px] tracking-[0.4em] rotate-90 text-grey-muted uppercase whitespace-nowrap">
          Portfolio 
        </span>
        <div className="w-px h-24 bg-gradient-to-t from-transparent to-[#c0392b]" />
      </div>

      {/* ── Main hero text ── */}
      <div className="relative z-10 text-center select-none pt-28">

        {/* Eyebrow */}
        <p ref={eyebrowRef}
          className="font-body text-xs tracking-[0.5em] text-[#c0392b] uppercase mb-6"
          style={{ opacity:0, transform:'translateY(-12px)', transition:'opacity 0.7s ease, transform 0.7s ease' }}>
          Full-Stack Developer &nbsp;/&nbsp; AI Enthusiast &nbsp;/&nbsp; India
        </p>

        {/* NAME */}
        <div ref={nameRef} className="font-display leading-none text-center"
          style={{ fontSize:'clamp(4rem, 13vw, 13rem)',
                   transition:'transform 0.1s linear, opacity 0.1s linear' }}>

          {/* Line 1: AYUSH KUMAR */}
          <div className="overflow-hidden block">
            <span className="word block"
              style={{
                transform:'translateY(110%)', opacity:0,
                transition:'transform 1.1s cubic-bezier(0.16,1,0.3,1) 0s, opacity 0.6s ease 0s',
                background:'linear-gradient(135deg,#f0f0f0 20%,#c0392b 120%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
              AYUSH KUMAR
            </span>
          </div>

          {/* Line 2: SHARMA */}
          <div className="overflow-hidden block">
            <span className="word block"
              style={{
                transform:'translateY(110%)', opacity:0,
                transition:'transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.18s, opacity 0.6s ease 0.18s',
                background:'linear-gradient(135deg,#f0f0f0 20%,#c0392b 120%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
              SHARMA
            </span>
          </div>
        </div>

        {/* Typewriter role */}
        <div ref={subRef}
          className="mt-6 flex items-center justify-center gap-2"
          style={{ opacity:0, transform:'translateY(16px)',
                   transition:'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s' }}>
          <span className="font-serif italic text-grey-muted text-lg md:text-2xl">—</span>
          <span ref={roleRef} className="font-serif italic text-grey-muted text-lg md:text-2xl tracking-wide" />
          <span className="w-0.5 h-6 bg-[#c0392b] animate-blink" />
        </div>

        
      </div>

      {/* Scroll hint */}
      <div ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ opacity:0, transition:'opacity 1s ease 1.4s' }}>
        <span className="text-[10px] tracking-[0.35em] uppercase text-grey-muted">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-[#c0392b] to-transparent animate-scroll-line" />
      </div>
    </section>
  );
}
