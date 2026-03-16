'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function BlobReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.style.animationPlayState = 'paused';

      gsap.fromTo(
        el,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(100% at 50% 50%)',
          duration: 3.0,
          ease: 'expo.out',
          onComplete: () => {
            el.style.removeProperty('clip-path');
            el.style.animationPlayState = 'running';
          },
        },
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      el.style.removeProperty('clip-path');
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className} style={{ clipPath: 'circle(0% at 50% 50%)' }}>
      {children}
    </div>
  );
}
