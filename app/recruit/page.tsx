import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export default function Page() {
  const positions = [
    {
      title: '正社員スタッフ',
      description:
        '子供たちの活動をサポートし、プログラムの企画・運営を担当していただきます。教育や保育に関心のある方を歓迎します。',
      requirements: ['大卒以上', '子供との関わりに興味がある方', 'チームワークを大切にできる方'],
      color: 'primary' as const,
    },
    {
      title: 'インターン',
      description:
        '実務経験を積みながら、子供たちとの関わり方や教育プログラムの企画について学べます。',
      requirements: ['大学生・大学院生', '週2日以上勤務可能な方', '子供が好きな方'],
      color: 'secondary' as const,
    },
    {
      title: 'ボランティアスタッフ',
      description:
        '活動のサポートや子供たちとの交流など、できる範囲でお手伝いいただけます。',
      requirements: ['18歳以上', '月1回以上参加可能な方', '責任感のある方'],
      color: 'tertiary' as const,
    },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>採用情報</h1>
        <p className={styles.description}>
          PLDLでは、子供たちの成長をサポートする仲間を募集しています。
          <br />
          一緒に未来をつくりませんか。
        </p>
      </section>

      <section className={styles.positions}>
        <h2 className={styles.sectionTitle}>募集職種</h2>
        <div className={styles.positionGrid}>
          {positions.map((position, index) => (
            <div key={index} className={`${styles.positionCard} ${styles[position.color]}`}>
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
      </section>

      <section className={styles.apply}>
        <h2 className={styles.applyTitle}>応募方法</h2>
        <p className={styles.applyDescription}>
          ご応募を希望される方は、お問い合わせフォームよりご連絡ください。
          <br />
          追って、詳細な募集要項と選考フローをお送りいたします。
        </p>
        <div className={styles.applyButton}>
          <ButtonLink href="/contact">応募・お問い合わせ</ButtonLink>
        </div>
      </section>
    </div>
  );
}
