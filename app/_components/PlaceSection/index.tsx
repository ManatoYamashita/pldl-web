'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../about/page.module.css';

const ORG_INFO_ITEMS = [
  { term: '名称', description: 'NPO法人 Playful Learning Design Lab.' },
  { term: '設立', description: '2022年10月' },
  { term: '代表理事', description: '尾池咲季子（松島）' },
  { term: '理事', description: '近藤隼人　浦田充起' },
  { term: '監事', description: '新井雄一　アライ商会株式会社 代表取締役' },
  { term: '所在地', description: '〒379-2313 群馬県みどり市笠懸町鹿3616-1' },
] as const;

export default function PlaceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import('gsap');
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const accent = el.querySelector<HTMLElement>('[data-place-accent]');
        const subEn = el.querySelector<HTMLElement>('[data-place-sub-en]');
        const heading = el.querySelector<HTMLElement>('[data-place-heading]');
        const desc = el.querySelector<HTMLElement>('[data-place-desc]');
        const infoRows = el.querySelectorAll<HTMLElement>('[data-place-info-row]');
        const image = el.querySelector<HTMLElement>('[data-place-image]');
        const map = el.querySelector<HTMLElement>('[data-place-map]');

        // Initial hidden state
        if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left center', opacity: 1 });
        const fadeUpTargets = [subEn, heading, desc].filter(Boolean) as HTMLElement[];
        gsap.set(fadeUpTargets, { y: 20, opacity: 0 });
        if (infoRows.length > 0) gsap.set(infoRows, { y: 15, opacity: 0 });
        if (map) gsap.set(map, { opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();

            const tl = gsap.timeline();
            const isDesktop = window.matchMedia('(min-width: 921px)').matches;

            // Text stagger (same for desktop and mobile)
            if (accent) tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
            if (subEn)
              tl.to(subEn, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.15);
            if (heading)
              tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.25);
            if (desc)
              tl.to(desc, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.35);

            // orgInfo rows stagger
            if (infoRows.length > 0) {
              tl.to(
                infoRows,
                { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.08 },
                0.45,
              );
            }

            // Desktop: image right clipPath reveal
            if (image && isDesktop) {
              gsap.set(image, { clipPath: 'inset(0 0 0 100%)', scale: 1.05, opacity: 1 });
              tl.to(
                image,
                {
                  clipPath: 'inset(0 0 0 0%)',
                  scale: 1,
                  duration: 0.9,
                  ease: 'power3.out',
                  onComplete: () => { image.style.removeProperty('clip-path'); },
                },
                0.15,
              );
            }

            // Map fade-in after orgInfo completes
            if (map) {
              const orgInfoEnd = 0.45 + 0.4 + (infoRows.length - 1) * 0.08;
              tl.to(map, { opacity: 1, duration: 0.6, ease: 'power2.out' }, orgInfoEnd + 0.2);
            }
          },
          { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = el.querySelectorAll<HTMLElement>(
          '[data-place-accent], [data-place-sub-en], [data-place-heading], [data-place-desc], [data-place-info-row], [data-place-image], [data-place-map]',
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
    <section ref={sectionRef} className={styles.placeSection}>
      <div className={styles.placeContainer}>
        <div className={styles.placeText}>
          <div className={styles.placeAccent} data-place-accent />
          <p className={styles.placeSubEn} data-place-sub-en>
            Place
          </p>
          <h2 className={styles.placeHeading} data-place-heading>
            PLDLの場所
          </h2>
          <p className={styles.sectionDescription} data-place-desc>
            NPO法人PLDLの基本情報をご紹介します。
          </p>
          <dl className={styles.orgInfo}>
            {ORG_INFO_ITEMS.map((item) => (
              <div key={item.term} className={styles.orgInfoRow} data-place-info-row>
                <dt className={styles.orgInfoTerm}>{item.term}</dt>
                <dd className={styles.orgInfoDesc}>{item.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.placeImageWrap} data-place-image>
          <Image
            src="/photos/children-walking-outdoor-sunny.webp"
            alt="晴れた日に歩くこどもたち"
            width={560}
            height={420}
            className={styles.placeImage}
            sizes="(max-width: 920px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className={styles.mapWrap} data-place-map>
        <iframe
          className={styles.mapIframe}
          src="https://www.google.com/maps?q=群馬県みどり市笠懸町鹿3616-1&output=embed"
          title="NPO法人PLDLの所在地"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
