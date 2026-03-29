'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function ActivitiesReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const title = el.querySelector<HTMLElement>('[data-activities-title]');
      const description = el.querySelector<HTMLElement>('[data-activities-description]');
      const cards = el.querySelectorAll<HTMLElement>('[data-activities-card]');
      const cta = el.querySelector<HTMLElement>('[data-activities-cta]');

      // Initial state
      if (title) gsap.set(title, { y: 30, opacity: 0 });
      if (description) gsap.set(description, { y: 30, opacity: 0 });
      if (cards.length > 0) gsap.set(cards, { y: 40, opacity: 0 });
      if (cta) gsap.set(cta, { y: 20, opacity: 0 });

      // IntersectionObserver — fire once
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          if (title) {
            tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
          }
          if (description) {
            tl.to(description, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.15);
          }
          if (cards.length > 0) {
            tl.to(
              cards,
              { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.15 },
              0.35,
            );
          }
          if (cta) {
            tl.to(cta, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7);
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-activities-title], [data-activities-description], [data-activities-card], [data-activities-cta]',
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
      });
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
