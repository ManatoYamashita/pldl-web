'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Member } from '@/app/_libs/microcms';
import { extractName } from '@/app/_libs/utils';
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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.accent} />
        <p className={styles.subEn}>Member</p>
        <h2 className={styles.heading}>メンバー紹介</h2>
        <p className={styles.description}>
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
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.carouselWrapper}>
          <div ref={trackRef} className={styles.track}>
            {members.map((member) => {
              const displayName = extractName(member.name);
              const comment = member.content ? stripHtml(member.content) : '';
              return (
                <article key={member.id} className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={member.thumbnail?.url || '/ogp.webp'}
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
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
