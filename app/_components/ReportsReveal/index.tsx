'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
};

export default function ReportsReveal({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const title = el.querySelector<HTMLElement>('[data-reports-title]');
      const filter = el.querySelector<HTMLElement>('[data-reports-filter]');
      const list = el.querySelector<HTMLElement>('[data-reports-list]');
      const items = list ? list.querySelectorAll<HTMLElement>(':scope > li') : [];
      const pagination = el.querySelector<HTMLElement>('[data-reports-pagination]');

      // Initial state
      if (title) gsap.set(title, { y: 30, opacity: 0 });
      if (filter) gsap.set(filter, { y: 20, opacity: 0 });
      if (items.length > 0) gsap.set(items, { y: 30, opacity: 0 });
      if (pagination) gsap.set(pagination, { y: 15, opacity: 0 });

      // IntersectionObserver — fire once
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();
          const stagger = items.length <= 6 ? 0.1 : 0.08;

          if (title) {
            tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
          }
          if (filter) {
            tl.to(filter, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.15);
          }
          if (items.length > 0) {
            tl.to(
              items,
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger },
              0.3,
            );
          }
          if (pagination) {
            const paginationStart = 0.3 + items.length * stagger + 0.15;
            tl.to(
              pagination,
              { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
              paginationStart,
            );
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
        '[data-reports-title], [data-reports-filter], [data-reports-list] > li, [data-reports-pagination]',
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
