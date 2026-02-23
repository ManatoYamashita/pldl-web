import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <ul className={styles.items}>
          <li className={styles.item}>
            <Link href="/activities">活動内容</Link>
          </li>
          <li className={styles.item}>
            <Link href="/support">サポート</Link>
          </li>
          <li className={styles.item}>
            <Link href="/recruit">採用情報</Link>
          </li>
          <li className={styles.item}>
            <Link href="/#members">メンバー</Link>
          </li>
          <li className={styles.item}>
            <Link href="/contact">お問い合わせ</Link>
          </li>
        </ul>
      </nav>
      <p>© PLDL. All Rights Reserved 2026</p>
    </footer>
  );
}
