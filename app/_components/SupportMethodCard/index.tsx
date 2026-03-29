'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from '../../support/page.module.css';

type SupportMethod = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  color: 'primary' | 'secondary' | 'tertiary' | 'accent';
  slug: string;
  ctaType: 'single' | 'dual';
};

type Props = {
  method: SupportMethod;
  index: number;
};

export default function SupportMethodCard({ method, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isReverse = index % 2 !== 0;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const image = el.querySelector<HTMLElement>('[data-card-image]');
        const number = el.querySelector<HTMLElement>('[data-card-number]');
        const title = el.querySelector<HTMLElement>('[data-card-title]');
        const desc = el.querySelector<HTMLElement>('[data-card-desc]');
        const cta = el.querySelector<HTMLElement>('[data-card-cta]');

        const fadeUpTargets = [number, title, desc, cta].filter(Boolean) as HTMLElement[];
        gsap.set(fadeUpTargets, { y: 20, opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const tl = gsap.timeline();
            const isMobile = window.matchMedia('(max-width: 640px)').matches;

            if (isMobile) {
              // Mobile: image reveals from top
              if (image) {
                gsap.set(image, { clipPath: 'inset(0 0 100% 0)', scale: 1.05, opacity: 1 });
                tl.to(
                  image,
                  {
                    clipPath: 'inset(0 0 0% 0)',
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
              if (number)
                tl.to(number, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.3);
              if (title)
                tl.to(title, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.45);
              if (desc)
                tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.55);
              if (cta)
                tl.to(cta, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.7);
            } else {
              // Desktop: image reveals from left (normal) or right (reverse)
              if (image) {
                const clipFrom = isReverse
                  ? 'inset(0 0 0 100%)'
                  : 'inset(0 100% 0 0)';
                gsap.set(image, { clipPath: clipFrom, scale: 1.05, opacity: 1 });
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
              if (number)
                tl.to(number, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.15);
              if (title)
                tl.to(title, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.3);
              if (desc)
                tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.45);
              if (cta)
                tl.to(cta, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
            }
          },
          { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = el.querySelectorAll<HTMLElement>(
          '[data-card-image], [data-card-number], [data-card-title], [data-card-desc], [data-card-cta]',
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
  }, [isReverse]);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${styles[method.color]} ${isReverse ? styles.reverse : ''}`}
    >
      <div className={styles.cardImageWrapper} data-card-image>
        <Image
          src={method.image}
          alt={method.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          quality={75}
          className={styles.cardImage}
        />
      </div>
      <div className={styles.cardContent}>
        <span className={styles.cardNumber} data-card-number>
          {method.number}
        </span>
        <h3 className={styles.cardTitle} data-card-title>
          {method.title}
        </h3>
        <p className={styles.cardDescription} data-card-desc>
          {method.description}
        </p>
        <div className={styles.cardCta} data-card-cta>
          {method.ctaType === 'single' ? (
            <ButtonLink href={`/support/${method.slug}`} variant="outline">
              ボランティアに参加する
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href={`/support/${method.slug}`} variant="outline">
                個人の方はこちら
              </ButtonLink>
              <ButtonLink href={`/support/${method.slug}`} variant="outline">
                法人・団体の方はこちら
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
