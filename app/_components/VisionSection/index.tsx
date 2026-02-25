import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './index.module.css';

export default function VisionSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.horizontal}>
          <div className={styles.textArea}>
            <h2 className={styles.headingEn}>Vision</h2>
            <p className={styles.headingJa}>ビジョン</p>
            <p className={styles.description}>
              PLDLは、子供たちが遊びを通じて自ら学び、成長する環境を提供します。
              創造性と好奇心を育み、未来を切り拓く力を身につけることを目指しています。
            </p>
            <ButtonLink href="#mission">もっとみる</ButtonLink>
          </div>
          <Image
            src="/vision.jpg"
            alt="遊びを通じて未来をつくるビジョン"
            width={960}
            height={960}
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
