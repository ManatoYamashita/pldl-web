import Image from 'next/image';
import styles from './index.module.css';

export default function VisionSection() {
  return (
    <>
      <div className={styles.waveTop} aria-hidden="true">
        <svg className={styles.waveBg} viewBox="0 0 2160 80" preserveAspectRatio="none">
          <path d="M0,50 C160,60 320,20 540,50 C760,75 940,25 1080,50 C1240,60 1400,20 1620,50 C1840,75 2020,25 2160,50 L2160,80 L0,80 Z" />
        </svg>
        <svg className={styles.waveMain} viewBox="0 0 2160 80" preserveAspectRatio="none">
          <path d="M0,40 C180,65 360,5 540,30 C720,55 900,15 1080,40 C1260,65 1440,5 1620,30 C1800,55 1980,15 2160,40 L2160,80 L0,80 Z" />
        </svg>
      </div>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.horizontal}>
            <div className={styles.textArea}>
              <h2 className={styles.headingEn}>Vision</h2>
              <p className={styles.headingJa}>ビジョン</p>
              <p className={styles.description}>
                すべてのこどもたちが本来もっている素晴らしい力<br />
                それぞれのこどもが持っている個性を活かし、伸ばし<br />
                こどもたちの未来がより良いものになっていく<br />
                社会の実現を目指します
              </p>
            </div>
            <Image
              src="/photos/children-desk-writing-group.webp"
              alt="遊びを通じて未来をつくるビジョン"
              width={960}
              height={960}
              className={styles.image}
              sizes="(max-width: 640px) 100vw, 420px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
