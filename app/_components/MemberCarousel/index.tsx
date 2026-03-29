'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import type { Member } from '@/app/_libs/microcms';
import { optimizeImageUrl, extractName } from '@/app/_libs/utils';
import styles from './index.module.css';

const CARD_SCROLL_UNIT = 280 + 24; // card width + gap
const SCROLL_EDGE_THRESHOLD = 4; // scroll端の判定閾値(px)

type Props = {
  members: Member[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function MemberCarousel({ members }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > SCROLL_EDGE_THRESHOLD);
    setCanScrollRight(
      track.scrollLeft < track.scrollWidth - track.clientWidth - SCROLL_EDGE_THRESHOLD,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // GSAP scroll-triggered animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const accent = el.querySelector<HTMLElement>('[data-member-accent]');
      const subEn = el.querySelector<HTMLElement>('[data-member-sub-en]');
      const heading = el.querySelector<HTMLElement>('[data-member-heading]');
      const description = el.querySelector<HTMLElement>('[data-member-description]');
      const cards = el.querySelectorAll<HTMLElement>('[data-member-card]');
      const navButtons = el.querySelectorAll<HTMLElement>('[data-member-nav]');

      // Initial hidden state
      if (accent) gsap.set(accent, { scaleX: 0, transformOrigin: 'left center' });
      const textTargets = [subEn, heading, description].filter(Boolean) as HTMLElement[];
      gsap.set(textTargets, { y: 20, opacity: 0 });
      if (cards.length > 0) gsap.set(cards, { y: 40, opacity: 0 });
      if (navButtons.length > 0) gsap.set(navButtons, { opacity: 0 });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();

          const tl = gsap.timeline();

          if (accent) {
            tl.to(accent, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
          }
          if (subEn) {
            tl.to(subEn, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.15);
          }
          if (heading) {
            tl.to(heading, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.25);
          }
          if (description) {
            tl.to(description, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.35);
          }
          if (cards.length > 0) {
            tl.to(
              cards,
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
              0.45,
            );
          }
          if (navButtons.length > 0) {
            tl.to(navButtons, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.7);
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
      );

      observer.observe(el);
      return () => observer.disconnect();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = el.querySelectorAll<HTMLElement>(
        '[data-member-accent], [data-member-sub-en], [data-member-heading], [data-member-description], [data-member-card], [data-member-nav]',
      );
      targets.forEach((target) => {
        target.style.opacity = '1';
        target.style.transform = 'none';
      });
    });

    return () => mm.revert();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction === 'left' ? -CARD_SCROLL_UNIT : CARD_SCROLL_UNIT,
      behavior: 'smooth',
    });
  };

  if (members.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.accent} data-member-accent />
        <p className={styles.subEn} data-member-sub-en>Member</p>
        <h2 className={styles.heading} data-member-heading>メンバー紹介</h2>
        <p className={styles.description} data-member-description>
          PLDLで活動するメンバーをご紹介します。
          <br />
          それぞれの専門性を活かし、こどもたちの学びの場を創っています。
        </p>
      </div>

      <div className={styles.carouselArea}>
        <button
          type="button"
          className={`${styles.sideNav} ${styles.sideNavLeft}`}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="前のメンバーへ"
          data-member-nav
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.carouselWrapper}>
          <div ref={trackRef} className={styles.track}>
            {members.map((member) => {
              const displayName = extractName(member.name);
              const comment = member.content ? stripHtml(member.content) : '';
              return (
                <article key={member.id} className={styles.card} data-member-card>
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={member.thumbnail ? optimizeImageUrl(member.thumbnail.url, 560) : '/ogp.webp'}
                      alt={member.name}
                      width={280}
                      height={373}
                      className={styles.cardImage}
                      sizes="280px"
                    />
                    <div className={styles.nameLabel}>
                      <h3 className={styles.cardName}>{displayName}</h3>
                      {member.description && (
                        <span className={styles.roleText}>{member.description}</span>
                      )}
                    </div>
                    {comment && (
                      <div className={styles.commentOverlay}>
                        <p className={styles.commentText}>
                          {comment.length > 120 ? `${comment.slice(0, 120)}...` : comment}
                        </p>
                      </div>
                    )}
                  </div>
                  {comment && (
                    <p className={styles.cardComment}>{comment}</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.sideNav} ${styles.sideNavRight}`}
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="次のメンバーへ"
          data-member-nav
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
