import ButtonLink from '@/app/_components/ButtonLink';
import Menu from '@/app/_components/Menu';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

// Server Component
export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="ホームに戻る">
          <Image
            src="/logo.svg"
            alt="SIMPLE"
            className={styles.logo}
            width={348}
            height={133}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="メインナビゲーション">
          <Link href="/news" className={styles.navLink}>
            ニュース
          </Link>
          <Link href="/business" className={styles.navLink}>
            事業内容
          </Link>
          <Link href="/members" className={styles.navLink}>
            メンバー
          </Link>
          <Link href="#" className={styles.navLink}>
            採用情報
          </Link>
        </nav>

        <ButtonLink href="/contact" variant="primary">
          お問い合わせ
        </ButtonLink>

        <div className={styles.mobileMenu}>
          <Menu />
        </div>
      </div>
    </header>
  );
}
