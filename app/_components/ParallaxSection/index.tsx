'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './index.module.css';

gsap.registerPlugin(ScrollTrigger);

const SPEED_MAP: Record<string, number> = {
  heading: -60,
  image: -80,
  decoration: -50,
  text: -20,
  list: -10,
};

type Props = {
  children: React.ReactNode;
};

export default function ParallaxSection({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const targets = el.querySelectorAll<HTMLElement>('[data-parallax]');

      targets.forEach((target) => {
        const key = target.dataset.parallax ?? '';
        const custom = target.dataset.parallaxSpeed;
        const yValue = custom ? Number(custom) : (SPEED_MAP[key] ?? -20);

        gsap.to(target, {
          y: yValue,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={ref} className={styles.wrapper}>
      {children}
    </div>
  );
}
