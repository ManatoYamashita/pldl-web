import ButtonLink from '@/app/_components/ButtonLink';
import Menu from '@/app/_components/Menu';
import Link from 'next/link';
import styles from './index.module.css';

// Server Component
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="ホームに戻る">
          <video
            className={styles.logo}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-label="放課後こどもラボ PLDL"
            role="img"
          >
            <source src="/images/brand/logo-animation.webm" type="video/webm" />
            <source src="/images/brand/logo-animation.mp4" type="video/mp4" />
            <picture>
              <source srcSet="/images/brand/favicon.webp" type="image/webp" />
              <img
                src="/images/brand/favicon.png"
                alt="放課後こどもラボ PLDL"
                className={styles.logoFallback}
              />
            </picture>
          </video>
          <picture className={styles.logoStatic}>
            <source srcSet="/images/brand/favicon.webp" type="image/webp" />
            <img
              src="/images/brand/favicon.png"
              alt="放課後こどもラボ PLDL"
              className={styles.logoFallback}
            />
          </picture>
        </Link>

        <nav className={styles.nav} aria-label="メインナビゲーション">
          <Link href="/about" className={styles.navLink}>
            私たちについて
          </Link>
          <Link href="/activities" className={styles.navLink}>
            活動内容
          </Link>
          <Link href="/support" className={styles.navLink}>
            サポート
          </Link>
          <Link href="/recruit" className={styles.navLink}>
            採用
          </Link>
        </nav>

        <div className={styles.contactButton}>
          <ButtonLink href="/contact" variant="primary">
            お問い合わせ
          </ButtonLink>
        </div>

        <div className={styles.mobileMenu}>
          <Menu />
        </div>
      </div>
    </header>
  );
}
