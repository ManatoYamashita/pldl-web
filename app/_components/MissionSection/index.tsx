import Image from 'next/image';
import styles from './index.module.css';

export default function MissionSection() {
  return (
    <>
      <section className={styles.section} id="mission">
        <div className={styles.container}>
          <div className={styles.horizontal}>
            <Image
              src="/photos/children-sitting-class-gathering.webp"
              alt="すべての子供に学びの場を提供するミッション"
              width={960}
              height={960}
              className={styles.image}
              sizes="(max-width: 640px) 100vw, 420px"
            />
            <div className={styles.textArea}>
              <h2 className={styles.headingEn}>Mission</h2>
              <p className={styles.headingJa}>ミッション</p>
              <p className={styles.description}>
                PLDLはこどもたちのサードプレイスとなり<br />
                子供たちの学ぶ意欲を育む&ldquo;場&rdquo;をつくりだします。
              </p>
              <ol className={styles.missionList}>
                <li>学ぶこと＝楽しいことというマインドを育成します</li>
                <li>創造的な思考をもって、課題解決に取り組む力を育みます</li>
                <li>異年齢、多様な大人との関わりをプロデュースします</li>
                <li>こどもたちが自然体でいられる居場所づくりをします</li>
                <li>経済格差による教育格差を減らします</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.waveBottom} aria-hidden="true">
        <svg className={styles.waveBg} viewBox="0 0 2160 80" preserveAspectRatio="none">
          <path d="M0,30 C160,10 320,65 540,40 C760,15 940,60 1080,30 C1240,10 1400,65 1620,40 C1840,15 2020,60 2160,30 L2160,0 L0,0 Z" />
        </svg>
        <svg className={styles.waveMain} viewBox="0 0 2160 80" preserveAspectRatio="none">
          <path d="M0,40 C180,15 360,75 540,50 C720,25 900,65 1080,40 C1260,15 1440,75 1620,50 C1800,25 1980,65 2160,40 L2160,0 L0,0 Z" />
        </svg>
      </div>
    </>
  );
}
