import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export default function Page() {
  const supportMethods = [
    {
      title: '寄付でのサポート',
      description:
        '皆様からのご寄付は、子供たちの活動費や施設運営費として大切に使わせていただきます。',
      color: 'primary' as const,
    },
    {
      title: 'ボランティア',
      description:
        '活動のサポートや子供たちとの交流など、様々な形でボランティアを募集しています。',
      color: 'secondary' as const,
    },
    {
      title: '企業パートナーシップ',
      description:
        '企業の皆様と協力し、子供たちに多様な学びの機会を提供しています。',
      color: 'tertiary' as const,
    },
    {
      title: '物品寄贈',
      description:
        '遊び道具や学習教材など、子供たちの活動に必要な物品のご寄贈をお待ちしています。',
      color: 'accent' as const,
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>サポート</h1>
        <p className={styles.description}>
          PLDLの活動は、多くの方々のご支援によって支えられています。
          <br />
          様々な形でのサポートをお待ちしています。
        </p>
      </section>

      <section className={styles.methods}>
        <h2 className={styles.sectionTitle}>サポート方法</h2>
        <div className={styles.methodGrid}>
          {supportMethods.map((method, index) => (
            <div key={index} className={`${styles.methodCard} ${styles[method.color]}`}>
              <h3 className={styles.methodTitle}>{method.title}</h3>
              <p className={styles.methodDescription}>{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <h2 className={styles.contactTitle}>サポートに関するお問い合わせ</h2>
        <p className={styles.contactDescription}>
          サポートに関するご質問やご相談は、お気軽にお問い合わせください。
        </p>
        <div className={styles.contactButton}>
          <ButtonLink href="/contact">お問い合わせ</ButtonLink>
        </div>
      </section>
    </div>
  );
}
