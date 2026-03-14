import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export default function Page() {
  const positions = [
    {
      title: '正社員スタッフ',
      icon: '\u{1F4BC}',
      description:
        '子供たちの活動をサポートし、プログラムの企画・運営を担当していただきます。教育や保育に関心のある方を歓迎します。',
      requirements: ['大卒以上', '子供との関わりに興味がある方', 'チームワークを大切にできる方'],
      color: 'primary' as const,
    },
    {
      title: 'インターン',
      icon: '\u{1F393}',
      description:
        '実務経験を積みながら、子供たちとの関わり方や教育プログラムの企画について学べます。',
      requirements: ['大学生・大学院生', '週2日以上勤務可能な方', '子供が好きな方'],
      color: 'secondary' as const,
    },
    {
      title: 'ボランティアスタッフ',
      icon: '\u{1F64B}',
      description:
        '活動のサポートや子供たちとの交流など、できる範囲でお手伝いいただけます。',
      requirements: ['18歳以上', '月1回以上参加可能な方', '責任感のある方'],
      color: 'tertiary' as const,
    },
  ];

  return (
    <>
      <Hero title="採用情報" sub="Recruit" compact />

      <section className={styles.positions}>
        <div className={styles.positionsContainer}>
          <h2 className={styles.sectionTitle}>募集職種</h2>
          <p className={styles.sectionDescription}>
            PLDLでは、子供たちの成長をサポートする仲間を募集しています。
            <br />
            一緒に未来をつくりませんか。
          </p>
          <div className={styles.positionGrid}>
            {positions.map((position, index) => (
              <div key={index} className={`${styles.positionCard} ${styles[position.color]}`}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {position.icon}
                </div>
                <h3 className={styles.positionTitle}>{position.title}</h3>
                <p className={styles.positionDescription}>{position.description}</p>
                <div className={styles.requirements}>
                  <h4 className={styles.requirementsTitle}>応募条件</h4>
                  <ul className={styles.requirementsList}>
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
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
      <section className={styles.apply}>
        <div className={styles.applyContainer}>
          <h2 className={styles.applyTitle}>応募方法</h2>
          <p className={styles.applyDescription}>
            ご応募を希望される方は、お問い合わせフォームよりご連絡ください。
            <br />
            追って、詳細な募集要項と選考フローをお送りいたします。
          </p>
          <div className={styles.applyButton}>
            <ButtonLink href="/contact">応募・お問い合わせ</ButtonLink>
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
