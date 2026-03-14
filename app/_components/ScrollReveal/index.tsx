'use client';

import { useEffect, useRef } from 'react';
import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.visible);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => el.classList.add(styles.visible), delay);
          } else {
            el.classList.add(styles.visible);
          }
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`${styles.reveal} ${className || ''}`}>
      {children}
    </div>
  );
}
