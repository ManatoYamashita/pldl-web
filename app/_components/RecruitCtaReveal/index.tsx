'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function RecruitCtaReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lead = el.querySelector<HTMLElement>('[data-rcta-lead]');
      const heading = el.querySelector<HTMLElement>('[data-rcta-heading]');
      const button = el.querySelector<HTMLElement>('[data-rcta-button]');

      // Initial hidden state
      if (lead) gsap.set(lead, { y: 20, opacity: 0 });
      if (heading) gsap.set(heading, { y: 20, opacity: 0 });
      if (button) gsap.set(button, { y: 15, opacity: 0 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          if (lead) tl.to(lead, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
          if (heading)
            tl.to(heading, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.15);
          if (button)
            tl.to(button, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, 0.35);
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
        '[data-rcta-lead], [data-rcta-heading], [data-rcta-button]',
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
