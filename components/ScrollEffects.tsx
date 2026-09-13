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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    targets.forEach((target) => {
      // Content stays visible without JavaScript. Only animate off-screen
      // sections once the observer is installed, avoiding a first-paint flash.
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
