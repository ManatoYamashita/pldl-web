'use client';

import { useRef, useEffect } from 'react';
import styles from '../../support/page.module.css';

export default function SupportIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lead = el.querySelector<HTMLElement>('[data-support-lead]');
        const number = el.querySelector<HTMLElement>('[data-support-number]');
        const text = el.querySelector<HTMLElement>('[data-support-text]');

        if (lead) gsap.set(lead, { y: 20, opacity: 0 });
        if (number) gsap.set(number, { scale: 0.5, opacity: 0 });
        if (text) gsap.set(text, { y: 15, opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const tl = gsap.timeline();

            if (lead) {
              tl.to(lead, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
            }
            if (number) {
              tl.to(
                number,
                { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
                0.25,
              );
            }
            if (text) {
              tl.to(text, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.4);
            }
          },
          { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = el.querySelectorAll<HTMLElement>(
          '[data-support-lead], [data-support-number], [data-support-text]',
        );
        targets.forEach((target) => {
          target.style.opacity = '1';
          target.style.transform = 'none';
        });
      });

      cleanup = () => mm.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className={styles.intro}>
      <div className={styles.introContainer}>
        <p className={styles.introLead} data-support-lead>
          PLDLの活動は、多くの方々のご支援によって支えられています。
          <br />
          あなたの力を、こどもたちの未来に届けてください。
        </p>
        <h2 className={styles.introHeading}>
          <span className={styles.introNumber} data-support-number>
            4
          </span>
          <span className={styles.introText} data-support-text>
            つのサポート
          </span>
        </h2>
      </div>
    </section>
  );
}
