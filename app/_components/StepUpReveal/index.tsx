'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function StepUpReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const accent = el.querySelector<HTMLElement>('[data-stepup-accent]');
      const sub = el.querySelector<HTMLElement>('[data-stepup-sub]');
      const heading = el.querySelector<HTMLElement>('[data-stepup-heading]');
      const desc = el.querySelector<HTMLElement>('[data-stepup-desc]');
      const cards = el.querySelectorAll<HTMLElement>('[data-stepup-card]');
      const connectors = el.querySelectorAll<HTMLElement>('[data-stepup-connector]');
      const note = el.querySelector<HTMLElement>('[data-stepup-note]');

      // Initial hidden state
      if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'center center', opacity: 1 });
      const headerTargets = [sub, heading, desc].filter(Boolean) as HTMLElement[];
      gsap.set(headerTargets, { y: 20, opacity: 0 });
      if (cards.length > 0) gsap.set(cards, { y: 30, opacity: 0 });
      if (connectors.length > 0) gsap.set(connectors, { opacity: 0 });
      if (note) gsap.set(note, { y: 15, opacity: 0 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          // Phase 1: Header
          if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
          if (sub) tl.to(sub, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.1);
          if (heading)
            tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.2);
          if (desc) tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.35);

          // Phase 2: Card → Connector → Card → Connector → Card
          if (cards.length > 0) {
            tl.to(cards[0], { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.55);
          }
          if (connectors.length > 0) {
            tl.to(connectors[0], { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.7);
          }
          if (cards.length > 1) {
            tl.to(cards[1], { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.85);
          }
          if (connectors.length > 1) {
            tl.to(connectors[1], { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.0);
          }
          if (cards.length > 2) {
            tl.to(cards[2], { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.15);
          }

          // Phase 3: Note
          if (note) tl.to(note, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.35);
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
        '[data-stepup-accent], [data-stepup-sub], [data-stepup-heading], [data-stepup-desc], [data-stepup-card], [data-stepup-connector], [data-stepup-note]',
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
