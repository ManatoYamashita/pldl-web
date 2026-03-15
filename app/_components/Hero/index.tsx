import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ButtonLink from '@/app/_components/ButtonLink';
import { formatDateDot } from '@/app/_libs/utils';
import BlobReveal from './BlobReveal';
import ShowcaseReveal from './ShowcaseReveal';
import styles from './index.module.css';

type HighlightedSegment = { text: string; highlighted?: boolean };
type LatestReport = { title: string; publishedAt: string; slug: string };

type HeroBaseProps = {
  title: string;
  sub: string;
  ctaText?: string;
  ctaLink?: string;
};

type DefaultHeroProps = HeroBaseProps & {
  variant?: 'default';
  imageSrc?: string;
  compact?: boolean;
};

type ShowcaseHeroProps = HeroBaseProps & {
  variant: 'showcase';
  imageSrc: string;
  highlights?: HighlightedSegment[];
  latestReport?: LatestReport;
};

type Props = DefaultHeroProps | ShowcaseHeroProps;

export default function Hero(props: Props) {
  const { title, sub, ctaText, ctaLink } = props;

  // Showcase variant
  if (props.variant === 'showcase') {
    const { imageSrc, highlights, latestReport } = props;
    return (
      <>
      <section className={styles.showcaseContainer} aria-label={title}>
        <ShowcaseReveal>
          <div className={styles.showcaseImageWrapper} data-showcase-image>
            <Image
              src={imageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={80}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.showcaseOverlay} aria-hidden="true" />
          <div className={styles.showcaseContent} data-showcase-content>
            <h1 className={styles.showcaseTitle} data-showcase-title>
              {(highlights
                ? highlights.map((seg, i) =>
                    seg.highlighted ? (
                      <span key={i} className={styles.highlight}>
                        {seg.text}
                      </span>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )
                : [<span key={0}>{title}</span>]
              ).flatMap((node, i) => {
                const text = (node as React.ReactElement<{ children: string }>).props.children;
                const cls = (node as React.ReactElement<{ className?: string }>).props.className;
                return text.split('').map((char: string, j: number) =>
                  char === '\n' ? (
                    '\n'
                  ) : (
                    <span
                      key={`${i}-${j}`}
                      className={`${styles.showcaseChar}${cls ? ` ${cls}` : ''}`}
                      data-showcase-char
                    >
                      {char}
                    </span>
                  ),
                );
              })}
            </h1>
            <div className={styles.showcaseSub} data-showcase-sub>
              <Image
                src="/images/brand/favicon.webp"
                alt="PLDL"
                width={24}
                height={24}
                className={styles.showcaseLogoIcon}
              />
              <span>{sub}</span>
            </div>
          </div>
          <div className={styles.showcaseBottomBar} data-showcase-bottom>
            {ctaText && ctaLink && (
              <Link href={ctaLink} className={styles.showcaseCta}>
                <span>{ctaText}</span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            )}
            {latestReport && (
              <Link href={`/activities/${latestReport.slug}`} className={styles.showcaseNewsArea}>
                <span className={styles.newsDate}>{formatDateDot(latestReport.publishedAt)}</span>
                <span className={styles.newsDivider} aria-hidden="true" />
                <span className={styles.newsTitle}>{latestReport.title}</span>
              </Link>
            )}
          </div>
        </ShowcaseReveal>
      </section>
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
      </>
    );
  }

  // Default variant
  const { imageSrc, compact } = props;
  return (
    <section
      className={`${styles.container} ${compact ? styles.compact : ''} ${imageSrc ? styles.withBlob : ''}`}
    >
      {imageSrc && (
        <div className={styles.blobWrapper}>
          <BlobReveal className={styles.blob}>
            <Image
              className={styles.blobImage}
              src={imageSrc}
              alt=""
              width={4000}
              height={1200}
              priority
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 1300px"
              quality={70}
            />
          </BlobReveal>
        </div>
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>
          {imageSrc
            ? title.split('').map((char, i) => (
                <span
                  key={i}
                  className={styles.char}
                  style={{ animationDelay: `${200 + i * 40}ms` }}
                >
                  {char}
                </span>
              ))
            : title}
        </h1>
        <p className={styles.sub}>
          {imageSrc ? (
            <span>
              {sub.split('').map((char, i) => (
                <span
                  key={i}
                  className={styles.char}
                  style={{ animationDelay: `${750 + i * 40}ms` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ) : (
            <span>{sub}</span>
          )}
        </p>
        {ctaText && ctaLink && (
          <div className={styles.cta}>
            <ButtonLink href={ctaLink}>{ctaText}</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
