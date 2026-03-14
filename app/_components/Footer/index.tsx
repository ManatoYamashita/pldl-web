import Link from 'next/link';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import FooterLogo from './FooterLogo';
import styles from './index.module.css';

const NAV_GROUPS = [
  {
    title: '活動について',
    links: [
      { href: '/activities', label: '活動内容' },
      { href: '/#members', label: 'メンバー' },
      { href: '/news', label: 'ニュース' },
    ],
  },
  {
    title: 'サポート',
    links: [
      { href: '/support', label: 'サポート' },
      { href: '/recruit', label: '採用情報' },
      { href: '/contact', label: 'お問い合わせ' },
    ],
  },
];

const SOCIALS = [
  { href: 'https://x.com/', icon: Twitter, label: 'X' },
  { href: 'https://facebook.com/', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com/', icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* CTA セクション */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>
            こどもの未来を、
            <br />
            一緒につくりませんか？
          </h2>
          <div className={styles.ctaAction}>
            <p className={styles.ctaText}>
              活動への参加・ご支援・お仕事のご相談など、
              <br className={styles.brDesktop} />
              まずはお気軽にご連絡ください。
            </p>
            <Link href="/contact" className={styles.ctaButton}>
              お問い合わせはこちら
            </Link>
          </div>
        </div>
      </section>

      {/* Footer 本体 */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {/* 左カラム: ロゴ + 団体名 */}
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <FooterLogo />
              <span className={styles.brandName}>PLDL</span>
            </Link>
          </div>

          {/* 中央カラム: ナビゲーション */}
          <nav className={styles.nav}>
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className={styles.navGroup}>
                <p className={styles.navGroupTitle}>{group.title}</p>
                <ul className={styles.navList}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.navLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* 右カラム: SNS */}
          <div className={styles.social}>
            <p className={styles.socialTitle}>Follow us</p>
            <div className={styles.socialIcons}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  <s.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* コピーライトバー */}
      <div className={styles.copyright}>
        <div className={styles.copyrightInner}>
          <small>&copy; PLDL. All Rights Reserved 2026</small>
        </div>
      </div>
    </footer>
  );
}
