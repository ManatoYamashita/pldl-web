import styles from './index.module.css';

export default function VisionSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>VISION</h2>
      <div className={styles.card}>
        <h3 className={styles.title}>遊びを通じて、未来をつくる</h3>
        <p className={styles.description}>
          PLDLは、子供たちが遊びを通じて自ら学び、成長する環境を提供します。
          創造性と好奇心を育み、未来を切り拓く力を身につけることを目指しています。
        </p>
      </div>
    </section>
  );
}
