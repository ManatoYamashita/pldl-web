import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './index.module.css';

export default function MissionSection() {
  return (
    <section className={styles.section} id="mission">
      <div className={styles.container}>
        <div className={styles.horizontal}>
          <Image
            src="/mission.jpg"
            alt="すべての子供に学びの場を提供するミッション"
            width={960}
            height={960}
            className={styles.image}
          />
          <div className={styles.textArea}>
            <h2 className={styles.headingEn}>Mission</h2>
            <p className={styles.headingJa}>ミッション</p>
            <p className={styles.description}>
              放課後の時間を活用し、子供たちが安心して遊び、学べる環境を提供します。
              一人ひとりの個性を尊重し、多様な体験を通じて成長をサポートします。
            </p>
            <ButtonLink href="#activities">もっとみる</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
