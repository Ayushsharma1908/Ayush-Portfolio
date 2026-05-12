import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SectionLabel } from './SectionHelpers';

const SOCIAL_LINKS = [
  {
    label: 'Email',
    value: 'ayushsharma192004@gmail.com',
    href: 'mailto:ayushsharma192004@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m2 7 10 7 10-7"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/Ayushsharma1908',
    href: 'https://github.com/Ayushsharma1908',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ayushkrsharma19',
    href: 'https://www.linkedin.com/in/ayushkrsharma19',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [focused, setFocused] = useState('');

  const titleRef = useScrollReveal({ from: 'translateX(-50px)', delay: 0.05 });
  const leftRef  = useScrollReveal({ delay: 0.1 });
  const rightRef = useScrollReveal({ delay: 0.2 });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const to      = 'ayushsharma192004@gmail.com';
    const subject = encodeURIComponent(form.subject || `Portfolio enquiry from ${form.name}`);
    const body    = encodeURIComponent(
      `Hi Ayush,\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}\n\n— Sent via your portfolio contact form.`
    );
    setStatus('sending');
    setTimeout(() => {
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 700);
  };

  const inputStyle = (field) => ({
    background: 'transparent',
    outline: 'none',
    width: '100%',
    color: '#f0f0f0',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
    padding: '0.85rem 1rem',
    border: `1px solid ${focused === field ? '#c0392b' : '#1e1e1e'}`,
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: focused === field ? '0 0 0 3px rgba(192,57,43,0.07)' : 'none',
    display: 'block',
  });

  return (
    <section className="relative z-10 py-32 px-[6vw] bg-[#0a0a0a] border-t border-[#1e1e1e] overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(192,57,43,0.08) 0%, transparent 65%)' }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(192,57,43,0.05) 0%, transparent 65%)' }} />

      <SectionLabel>05 — Contact</SectionLabel>

      {/* Title */}
      <h2 ref={titleRef} className="font-display leading-none uppercase text-white mb-16"
        style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)' }}>
        Get In<br />
        <em className="font-serif" style={{ color: '#c0392b', fontSize: '0.6em', fontStyle: 'italic', display: 'block' }}>
          Touch
        </em>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

        {/* ─── LEFT: Info + Socials ─── */}
        <div ref={leftRef} className="flex flex-col gap-10">

          <p className="font-body text-base leading-[1.9] text-[#888] font-light max-w-md">
            Have a project in mind, a collaboration idea, or just want to say hello?
            Fill out the form or reach me directly — I read every message and reply within{' '}
            <span style={{ color: '#c0392b' }}>24 hours.</span>
          </p>

          {/* Social cards */}
          <div className="flex flex-col gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label}
                href={s.href}
                target={s.label !== 'Email' ? '_blank' : undefined}
                rel="noreferrer"
                data-hover
                className="group relative flex items-center gap-4 border border-[#1e1e1e] p-4 overflow-hidden transition-all duration-300 hover:border-[#c0392b]"
              >
                {/* sweep */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: 'linear-gradient(90deg, rgba(192,57,43,0.07), transparent)' }} />

                {/* Icon */}
                <div className="relative z-10 w-10 h-10 flex items-center justify-center border border-[#1e1e1e] text-[#666] group-hover:border-[#c0392b] group-hover:text-[#c0392b] transition-all duration-300 flex-shrink-0">
                  {s.icon}
                </div>

                <div className="relative z-10 flex flex-col min-w-0">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-0.5 font-body">{s.label}</span>
                  <span className="text-sm text-white font-light truncate group-hover:text-[#c0392b] transition-colors duration-300 font-body">
                    {s.value}
                  </span>
                </div>

                <span className="relative z-10 ml-auto text-[#333] group-hover:text-[#c0392b] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">↗</span>
              </a>
            ))}
          </div>

          {/* Availability pill */}
          <div className="inline-flex items-center gap-3 border border-[#1e1e1e] px-5 py-3 self-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#666] font-body">
              Open to freelance &amp; collaborations
            </span>
          </div>
        </div>

        {/* ─── RIGHT: Form ─── */}
        <div ref={rightRef}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#555] font-body">Your Name *</label>
                <input type="text" name="name" required
                  placeholder="Your Name"
                  value={form.name} onChange={handleChange}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  style={inputStyle('name')} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#555] font-body">Your Email *</label>
                <input type="email" name="email" required
                  placeholder="your@gmail.com"
                  value={form.email} onChange={handleChange}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  style={inputStyle('email')} />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#555] font-body">Subject</label>
              <input type="text" name="subject"
                placeholder="Project enquiry · Collaboration · Just saying hi"
                value={form.subject} onChange={handleChange}
                onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                style={inputStyle('subject')} />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#555] font-body">Message *</label>
              <textarea name="message" required rows={6}
                placeholder="Tell me about your project, idea, or just say hello..."
                value={form.message} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                style={{ ...inputStyle('message'), resize: 'none' }} />
            </div>

            {/* Submit button */}
            <button type="submit" data-hover disabled={status === 'sending'}
              className="relative overflow-hidden group mt-1"
              style={{
                background:   status === 'sent' ? '#0d2b0d' : '#c0392b',
                border:       `1px solid ${status === 'sent' ? '#1a5c1a' : '#c0392b'}`,
                color:        '#fff',
                padding:      '1rem 2rem',
                fontFamily:   "'Bebas Neue', sans-serif",
                fontSize:     '1.1rem',
                letterSpacing:'0.2em',
                textTransform:'uppercase',
                cursor:        status === 'sending' ? 'wait' : 'pointer',
                transition:   'all 0.3s ease',
                display:      'flex',
                alignItems:   'center',
                justifyContent:'center',
                gap:          '0.75rem',
              }}>
              {/* shine sweep on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)' }} />

              {status === 'idle' && (
                <><SendIcon /> Send Message</>
              )}
              {status === 'sending' && (
                <><SpinnerIcon /> Opening email client...</>
              )}
              {status === 'sent' && (
                <><CheckIcon /> Email client opened! ✓</>
              )}
            </button>

            <p className="text-[10px] tracking-[0.12em] text-[#444] font-light font-body leading-relaxed">
              * Clicking send will open your default email app pre-filled with your message — so it goes directly from <em>your</em> email to mine.
            </p>

          </form>
        </div>
      </div>
    </section>
  );
}

/* ── Inline SVG icons ── */
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ width:16, height:16, flexShrink:0 }}>
      <path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width:16, height:16, flexShrink:0, animation:'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" style={{ width:16, height:16, flexShrink:0 }}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
