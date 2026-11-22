'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, isCurrentPath } from '@/app/_constants/navigation';
import styles from './index.module.css';

export default function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="メインナビゲーション">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={styles.navLink}
          aria-current={isCurrentPath(pathname, href) ? 'page' : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
