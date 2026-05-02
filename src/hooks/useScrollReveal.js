import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = options.from || 'translateY(48px)';
    el.style.transition = `opacity ${options.duration || 0.85}s ease ${options.delay || 0}s, transform ${options.duration || 0.85}s cubic-bezier(0.16,1,0.3,1) ${options.delay || 0}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0)';
          observer.unobserve(el);
        }
      },
      { threshold: options.threshold || 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
