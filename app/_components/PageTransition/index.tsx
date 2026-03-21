'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './index.module.css';

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // reduced-motion check without gsap.matchMedia scope
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layers = el.querySelectorAll<HTMLElement>('[data-transition-layer]');
    if (layers.length === 0) return;

    // Set initial state explicitly (not relying on CSS)
    gsap.set(layers, { xPercent: -100 });

    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = 'none';
      },
    });

    // Enter: layers wipe in from left
    tl.to(layers, {
      xPercent: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.inOut',
    });

    // Exit: layers wipe out to right
    tl.to(layers, {
      xPercent: 100,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <div data-transition-layer className={`${styles.layer} ${styles.layer1}`} />
      <div data-transition-layer className={`${styles.layer} ${styles.layer2}`} />
      <div data-transition-layer className={`${styles.layer} ${styles.layer3}`} />
      <div data-transition-layer className={`${styles.layer} ${styles.layer4}`} />
    </div>
  );
}
