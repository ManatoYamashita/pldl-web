'use client';

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function CtaReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const bg = el.querySelector<HTMLElement>('[data-cta-bg]');
      const heading = el.querySelector<HTMLElement>('[data-cta-heading]');
      const text = el.querySelector<HTMLElement>('[data-cta-text]');
      const button = el.querySelector<HTMLElement>('[data-cta-button]');

      // Initial state — background collapsed, content hidden
      if (bg) gsap.set(bg, { clipPath: 'inset(0% 50% 0% 50%)', opacity: 1 });
      if (heading) gsap.set(heading, { y: 30, opacity: 0 });
      if (text) gsap.set(text, { y: 20, opacity: 0 });
      if (button) gsap.set(button, { y: 15, opacity: 0 });

      // IntersectionObserver — fire once
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          // Phase 1: Background reveal
          if (bg) {
            tl.to(bg, {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.8,
              ease: 'power3.inOut',
            }, 0);
          }

          // Phase 2: Content fade-in (starts while bg is still finishing)
          if (heading) {
            tl.to(heading, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5);
          }
          if (text) {
            tl.to(text, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7);
          }
          if (button) {
            tl.to(button, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.9);
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-cta-bg], [data-cta-heading], [data-cta-text], [data-cta-button]',
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
        target.style.clipPath = 'none';
      });
    });

    return () => mm.revert();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
