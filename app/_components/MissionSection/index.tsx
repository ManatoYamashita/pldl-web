import Image from 'next/image';
import styles from './index.module.css';

export default function MissionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>MISSION</h2>
        <div className={styles.content}>
          <div className={styles.textBlock}>
            <h3 className={styles.title}>すべての子供に、学びの場を</h3>
            <p className={styles.description}>
              放課後の時間を活用し、子供たちが安心して遊び、学べる環境を提供します。
              一人ひとりの個性を尊重し、多様な体験を通じて成長をサポートします。
            </p>
          </div>
          <Image
            src="/mission.jpg"
            alt="MISSION"
            width={240}
            height={180}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
