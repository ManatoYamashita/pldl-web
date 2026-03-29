'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
  direction: 'left' | 'right';
};

export default function SectionReveal({ children, direction }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const image = el.querySelector<HTMLElement>('[data-section-image]');
      const headingEn = el.querySelector<HTMLElement>('[data-section-heading-en]');
      const headingJa = el.querySelector<HTMLElement>('[data-section-heading-ja]');
      const description = el.querySelector<HTMLElement>('[data-section-description]');
      const listItems = el.querySelectorAll<HTMLElement>('[data-section-list-item]');

      // Initial state
      const textTargets = [headingEn, headingJa, description].filter(Boolean) as HTMLElement[];
      gsap.set(textTargets, { y: 30, opacity: 0 });
      if (listItems.length > 0) {
        gsap.set(listItems, { y: 20, opacity: 0 });
      }

      if (image) {
        const clipFrom =
          direction === 'right' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
        gsap.set(image, { clipPath: clipFrom, scale: 1.05, opacity: 1 });
      }

      // IntersectionObserver — fire once
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          // Image mask reveal
          if (image) {
            tl.to(
              image,
              {
                clipPath: 'inset(0 0% 0 0%)',
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

          // Text stagger
          if (headingEn) {
            tl.to(headingEn, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.2);
          }
          if (headingJa) {
            tl.to(headingJa, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35);
          }
          if (description) {
            tl.to(description, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.5);
          }
          if (listItems.length > 0) {
            tl.to(
              listItems,
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
              0.65,
            );
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
      );

      observer.observe(el);

      // Cleanup for matchMedia revert
      return () => {
        observer.disconnect();
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-section-image], [data-section-heading-en], [data-section-heading-ja], [data-section-description], [data-section-list-item]',
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
