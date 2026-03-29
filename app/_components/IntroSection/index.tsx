'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from '../../about/page.module.css';

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = el.querySelector<HTMLElement>('[data-intro-title]');
        const descriptions = el.querySelectorAll<HTMLElement>('[data-intro-desc]');
        const button = el.querySelector<HTMLElement>('[data-intro-button]');
        const image = el.querySelector<HTMLElement>('[data-intro-image]');

        // Initial hidden state
        if (title) gsap.set(title, { y: 30, opacity: 0 });
        if (descriptions.length > 0) gsap.set(descriptions, { y: 20, opacity: 0 });
        if (button) gsap.set(button, { y: 20, opacity: 0 });
        if (image) gsap.set(image, { scale: 0.85, opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const tl = gsap.timeline();
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            if (isMobile) {
              // Mobile: image first (column-reverse layout)
              if (image) {
                tl.to(image, { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0);
              }
              if (title) {
                tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.3);
              }
              if (descriptions.length > 0) {
                tl.to(
                  descriptions,
                  { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
                  0.5,
                );
              }
              if (button) {
                const descEnd = 0.5 + 0.5 + (descriptions.length - 1) * 0.12;
                tl.to(
                  button,
                  { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
                  descEnd + 0.1,
                );
              }
            } else {
              // Desktop: text left + image right simultaneously
              if (title) {
                tl.to(title, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
              }
              if (descriptions.length > 0) {
                tl.to(
                  descriptions,
                  { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
                  0.2,
                );
              }
              if (button) {
                const descEnd = 0.2 + 0.5 + (descriptions.length - 1) * 0.12;
                tl.to(
                  button,
                  { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
                  descEnd + 0.1,
                );
              }
              if (image) {
                tl.to(
                  image,
                  { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' },
                  0.15,
                );
              }
            }
          },
          { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = el.querySelectorAll<HTMLElement>(
          '[data-intro-title], [data-intro-desc], [data-intro-button], [data-intro-image]',
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
        <div className={styles.introText}>
          <h2 className={styles.introTitle} data-intro-title>
            ワクワクする学びが
            <br />
            こどもたちの未来を創る
          </h2>
          <p className={styles.introDescription} data-intro-desc>
            「知らないことを知ることは楽しい」
            <br />
            学びとは本来ワクワクするものです。
            <br />
            私たちは「学びのワクワク」を様々なプロジェクトを
            <br />
            通じて、こどもたちに伝えていきます。
          </p>
          <p className={styles.introDescription} data-intro-desc>
            学ぶことの楽しさを知った子どもたちは
            <br />
            自分で考え、行動し、自分の未来を切り拓くことが
            <br />
            できると信じています。
          </p>
          <p className={styles.introDescription} data-intro-desc>
            NPO法人PLDLでは、様々なワクワクの場を
            <br />
            デザインしていきます。
          </p>
          <div data-intro-button>
            <ButtonLink href="/activities">PLDLについて</ButtonLink>
          </div>
        </div>
        <div className={styles.introImageWrap} data-intro-image>
          <Image
            src="/photos/boys-sawing-branch-outdoor.webp"
            alt="活動の様子"
            width={480}
            height={480}
            className={styles.introImage}
            sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 360px"
          />
        </div>
      </div>
    </section>
  );
}
