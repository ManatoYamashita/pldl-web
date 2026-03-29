'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
  direction: 'left' | 'right';
};

export default function RecruitSectionReveal({ children, direction }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const image = el.querySelector<HTMLElement>('[data-recruit-image]');
      const accent = el.querySelector<HTMLElement>('[data-recruit-accent]');
      const sub = el.querySelector<HTMLElement>('[data-recruit-sub]');
      const heading = el.querySelector<HTMLElement>('[data-recruit-heading]');
      const bodies = el.querySelectorAll<HTMLElement>('[data-recruit-body]');

      // Initial hidden state
      if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });
      const fadeTargets = [sub, heading].filter(Boolean) as HTMLElement[];
      gsap.set(fadeTargets, { y: 20, opacity: 0 });
      if (bodies.length > 0) gsap.set(bodies, { y: 15, opacity: 0 });

      const isDesktop = window.matchMedia('(min-width: 921px)').matches;

      if (image) {
        const clipFrom = isDesktop
          ? direction === 'right'
            ? 'inset(0 100% 0 0)'
            : 'inset(0 0 0 100%)'
          : 'inset(0 0 100% 0)';
        gsap.set(image, { clipPath: clipFrom, scale: 1.05, opacity: 1 });
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          // Image clipPath reveal
          if (image) {
            tl.to(
              image,
              {
                clipPath: isDesktop ? 'inset(0 0% 0 0%)' : 'inset(0 0 0% 0)',
                scale: 1,
                duration: 0.9,
                ease: 'power3.out',
                onComplete: () => {
                  image.style.removeProperty('clip-path');
                },
              },
              0,
            );
          }

          if (isDesktop) {
            if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.15);
            if (sub) tl.to(sub, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.25);
            if (heading)
              tl.to(heading, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);
            if (bodies.length > 0) {
              tl.to(
                bodies,
                { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.08 },
                0.55,
              );
            }
          } else {
            if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.3);
            if (sub) tl.to(sub, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.4);
            if (heading)
              tl.to(heading, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5);
            if (bodies.length > 0) {
              tl.to(
                bodies,
                { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', stagger: 0.08 },
                0.6,
              );
            }
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
        '[data-recruit-image], [data-recruit-accent], [data-recruit-sub], [data-recruit-heading], [data-recruit-body]',
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
        target.style.removeProperty('clip-path');
      });
    });

    return () => mm.revert();
  }, [direction]);

  return <div ref={ref}>{children}</div>;
}
