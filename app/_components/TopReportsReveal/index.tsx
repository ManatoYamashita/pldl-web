'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function TopReportsReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const title = el.querySelector<HTMLElement>('[data-tr-title]');
      const sheet = el.querySelector<HTMLElement>('[data-tr-sheet]');
      const items = el.querySelectorAll<HTMLElement>('[data-reports-list] > li');
      const link = el.querySelector<HTMLElement>('[data-tr-link]');

      // Initial state
      if (title) gsap.set(title, { y: 30, opacity: 0 });
      if (sheet) gsap.set(sheet, { y: 30, opacity: 0 });
      if (items.length > 0) gsap.set(items, { y: 30, opacity: 0 });
      if (link) gsap.set(link, { y: 15, opacity: 0 });

      // IntersectionObserver — fire once
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          if (title) {
            tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
          }
          if (sheet) {
            tl.to(sheet, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.15);
          }
          if (items.length > 0) {
            tl.to(
              items,
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
              0.35,
            );
          }
          if (link) {
            const linkDelay = 0.35 + items.length * 0.1 + 0.15;
            tl.to(link, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, linkDelay);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-tr-title], [data-tr-sheet], [data-reports-list] > li, [data-tr-link]',
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
