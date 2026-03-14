import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export default function Page() {
  const supportMethods = [
    {
      title: '寄付でのサポート',
      icon: '\u{1F9E1}',
      description:
        '皆様からのご寄付は、子供たちの活動費や施設運営費として大切に使わせていただきます。',
      color: 'primary' as const,
    },
    {
      title: 'ボランティア',
      icon: '\u{1F91D}',
      description:
        '活動のサポートや子供たちとの交流など、様々な形でボランティアを募集しています。',
      color: 'secondary' as const,
    },
    {
      title: '企業パートナーシップ',
      icon: '\u{1F3E2}',
      description:
        '企業の皆様と協力し、子供たちに多様な学びの機会を提供しています。',
      color: 'tertiary' as const,
    },
    {
      title: '物品寄贈',
      icon: '\u{1F381}',
      description:
        '遊び道具や学習教材など、子供たちの活動に必要な物品のご寄贈をお待ちしています。',
      color: 'accent' as const,
    },
  ];

  return (
    <>
      <Hero title="サポート" sub="Support" compact />

      <section className={styles.methods}>
        <div className={styles.methodsContainer}>
          <h2 className={styles.sectionTitle}>サポート方法</h2>
          <p className={styles.sectionDescription}>
            PLDLの活動は、多くの方々のご支援によって支えられています。
            <br />
            様々な形でのサポートをお待ちしています。
          </p>
          <div className={styles.methodGrid}>
            {supportMethods.map((method, index) => (
              <div key={index} className={`${styles.methodCard} ${styles[method.color]}`}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {method.icon}
                </div>
                <h3 className={styles.methodTitle}>{method.title}</h3>
                <p className={styles.methodDescription}>{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 C240,70 480,0 720,30 C960,60 1200,10 1440,25 L1440,80 L0,80 Z" />
        </svg>
      </div>
      <section className={styles.contact}>
        <div className={styles.contactContainer}>
          <h2 className={styles.contactTitle}>サポートに関するお問い合わせ</h2>
          <p className={styles.contactDescription}>
            サポートに関するご質問やご相談は、お気軽にお問い合わせください。
          </p>
          <div className={styles.contactButton}>
            <ButtonLink href="/contact">お問い合わせ</ButtonLink>
          </div>
        </div>
      </section>
      <div className={styles.waveBottom} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,0 C240,10 480,80 720,50 C960,20 1200,70 1440,55 L1440,0 L0,0 Z" />
        </svg>
      </div>
    </>
  );
}
