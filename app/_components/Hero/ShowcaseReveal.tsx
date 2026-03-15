'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function ShowcaseReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const image = el.querySelector('[data-showcase-image]');
      const content = el.querySelector('[data-showcase-content]');
      const bottom = el.querySelector('[data-showcase-bottom]');

      const tl = gsap.timeline();

      if (image) {
        tl.fromTo(
          image,
          { scale: 1.05, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0,
        );
      }

      if (content) {
        tl.fromTo(
          content,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          0.4,
        );
      }

      if (bottom) {
        tl.fromTo(
          bottom,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.8,
        );
      }
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll(
        '[data-showcase-image], [data-showcase-content], [data-showcase-bottom]',
      );
      targets.forEach((target) => {
        (target as HTMLElement).style.opacity = '1';
        (target as HTMLElement).style.transform = 'none';
      });
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
