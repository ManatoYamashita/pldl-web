'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from '../../about/page.module.css';

export default function RecruitSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const image = el.querySelector<HTMLElement>('[data-recruit-image]');
        const accent = el.querySelector<HTMLElement>('[data-recruit-accent]');
        const subEn = el.querySelector<HTMLElement>('[data-recruit-sub-en]');
        const heading = el.querySelector<HTMLElement>('[data-recruit-heading]');
        const desc = el.querySelector<HTMLElement>('[data-recruit-desc]');
        const button = el.querySelector<HTMLElement>('[data-recruit-button]');

        // Initial hidden state
        if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });
        const fadeUpTargets = [subEn, heading, desc, button].filter(Boolean) as HTMLElement[];
        gsap.set(fadeUpTargets, { y: 20, opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const tl = gsap.timeline();
            const isDesktop = window.matchMedia('(min-width: 921px)').matches;

            if (isDesktop) {
              // Desktop: image left clipPath + text right stagger
              if (image) {
                gsap.set(image, { clipPath: 'inset(0 100% 0 0)', scale: 1.05, opacity: 1 });
                tl.to(
                  image,
                  {
                    clipPath: 'inset(0 0% 0 0)',
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    onComplete: () => { image.style.removeProperty('clip-path'); },
                  },
                  0,
                );
              }
              if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.2);
              if (subEn)
                tl.to(subEn, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.3);
              if (heading)
                tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.4);
              if (desc)
                tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.55);
              if (button)
                tl.to(button, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7);
            } else {
              // Mobile: image top clipPath → text bottom stagger
              if (image) {
                gsap.set(image, { clipPath: 'inset(0 0 100% 0)', scale: 1.05, opacity: 1 });
                tl.to(
                  image,
                  {
                    clipPath: 'inset(0 0 0% 0)',
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    onComplete: () => { image.style.removeProperty('clip-path'); },
                  },
                  0,
                );
              }
              if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0.35);
              if (subEn)
                tl.to(subEn, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.45);
              if (heading)
                tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.55);
              if (desc)
                tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.65);
              if (button)
                tl.to(button, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.8);
            }
          },
          { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = el.querySelectorAll<HTMLElement>(
          '[data-recruit-image], [data-recruit-accent], [data-recruit-sub-en], [data-recruit-heading], [data-recruit-desc], [data-recruit-button]',
        );
        targets.forEach((target) => {
          target.style.opacity = '1';
          target.style.transform = 'none';
          target.style.removeProperty('clip-path');
        });
      });

      cleanup = () => mm.revert();
    })();

    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className={styles.recruitSection}>
      <div className={styles.recruitContainer}>
        <div className={styles.recruitImageWrap} data-recruit-image>
          <Image
            src="/photos/group-photo-cardboard-craft.webp"
            alt="スタッフの活動風景"
            width={560}
            height={420}
            className={styles.recruitImage}
            sizes="(max-width: 920px) 100vw, 50vw"
          />
        </div>
        <div className={styles.recruitText}>
          <div className={styles.recruitAccent} data-recruit-accent />
          <p className={styles.recruitSubEn} data-recruit-sub-en>
            Join us
          </p>
          <h2 className={styles.recruitHeading} data-recruit-heading>
            私たちと一緒に
            <br />
            働きませんか？
          </h2>
          <p className={styles.sectionDescription} data-recruit-desc>
            PLDLでは、こどもたちの学びの場を一緒に創るスタッフを募集しています。
            教育に興味がある方、こどもたちと関わることが好きな方、
            私たちと一緒にワクワクする学びの場をデザインしませんか？
          </p>
          <div data-recruit-button>
            <ButtonLink href="/contact">VIEW MORE</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
