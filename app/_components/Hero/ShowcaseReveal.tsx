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

      const tl = gsap.timeline({ delay: 0.5 });

      if (image) {
        tl.fromTo(
          image,
          { scale: 1.05, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
          0,
        );
      }

      if (content) {
        tl.set(content, { opacity: 1, y: 0 }, 0.4);
      }

      const titleEl = el.querySelector('[data-showcase-title]');
      const chars = el.querySelectorAll('[data-showcase-char]');
      const sub = el.querySelector('[data-showcase-sub]');

      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { opacity: 0 },
          { opacity: 1, duration: 0.05, stagger: 0.03, ease: 'none' },
          0.5,
        );
      }

      if (titleEl) {
        tl.fromTo(
          titleEl,
          { backgroundSize: '0% 100%' },
          { backgroundSize: '100% 100%', duration: 0.8, ease: 'power2.out' },
          0.8,
        );
      }

      if (sub) {
        tl.fromTo(
          sub,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          1.3,
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
        '[data-showcase-image], [data-showcase-content], [data-showcase-bottom], [data-showcase-sub]',
      );
      targets.forEach((target) => {
        (target as HTMLElement).style.opacity = '1';
        (target as HTMLElement).style.transform = 'none';
      });
      el.querySelectorAll('[data-showcase-char]').forEach((c) => {
        (c as HTMLElement).style.opacity = '1';
      });
    });

    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
