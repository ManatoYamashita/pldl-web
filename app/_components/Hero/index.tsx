import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './index.module.css';

type Props = {
  title: string;
  sub: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  compact?: boolean;
};

export default function Hero({ title, sub, ctaText, ctaLink, imageSrc, compact }: Props) {
  return (
    <section className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.sub}>{sub}</p>
        {ctaText && ctaLink && (
          <div className={styles.cta}>
            <ButtonLink href={ctaLink}>{ctaText}</ButtonLink>
          </div>
        )}
      </div>
      {imageSrc && (
        <Image
          className={styles.bgimg}
          src={imageSrc}
          alt=""
          width={4000}
          height={1200}
          priority
        />
      )}
    </section>
  );
}
