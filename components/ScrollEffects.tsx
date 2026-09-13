'use client';

import { useEffect } from 'react';

export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateProgress = () => {
      const maximum = Math.max(root.scrollHeight - window.innerHeight, 1);
      root.style.setProperty('--site-scroll-progress', String(Math.min(window.scrollY / maximum, 1)));
    };

    updateProgress();

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-revealed'));
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
      return () => {
        window.removeEventListener('scroll', updateProgress);
        window.removeEventListener('resize', updateProgress);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      // A small viewport may never show 10% of a long section/card.
      // Any intersection is enough: motion must not gate access to content.
      { rootMargin: '0px 0px -24px 0px', threshold: 0 },
    );

    targets.forEach((target) => {
      // This only opts into a finite entrance animation. Pending targets stay
      // visible, even if an observer callback is delayed or never arrives.
      if (target.getBoundingClientRect().top >= window.innerHeight) target.classList.add('reveal-ready');
      observer.observe(target);
    });
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.classList.remove('reveal-ready'));
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return <div className="site-scroll-progress" aria-hidden="true" />;
}
