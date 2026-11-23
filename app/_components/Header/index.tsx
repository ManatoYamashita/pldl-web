import ButtonLink from '@/app/_components/ButtonLink';
import Menu from '@/app/_components/Menu';
import { CONTACT_NAV_ITEM } from '@/app/_constants/navigation';
import Link from 'next/link';
import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="ホームに戻る">
          <HeaderLogo />
        </Link>

        <HeaderNav />

        <div className={styles.contactButton}>
          <ButtonLink href={CONTACT_NAV_ITEM.href} variant="primary">
            {CONTACT_NAV_ITEM.label}
          </ButtonLink>
        </div>

        <div className={styles.mobileMenu}>
          <Menu />
        </div>
      </div>
    </header>
  );
}
