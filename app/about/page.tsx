import { Metadata } from 'next';
import Image from 'next/image';
import { getMembersList } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '私たちについて',
  description:
    'NPO法人PLDLのVision・Mission・メンバー紹介。すべてのこどもたちの個性を活かし、未来をより良くする社会の実現を目指します。',
  alternates: { canonical: '/about' },
};

export default async function Page() {
  const membersData = await getMembersList();

  return (
    <>
      <Hero title="私たちについて" sub="About Us" imageSrc="/photos/children-walking-outdoor-sunny.webp" />

      {/* 紹介セクション */}
      <section className={styles.intro}>
        <div className={styles.introContainer}>
          <div className={styles.introText}>
            <h2 className={styles.introTitle}>
              ワクワクする学びが
              <br />
              こどもたちの未来を創る
            </h2>
            <p className={styles.introDescription}>
              「知らないことを知ることは楽しい」
              <br />
              学びとは本来ワクワクするものです。
              <br />
              私たちは「学びのワクワク」を様々なプロジェクトを
              <br />
              通じて、こどもたちに伝えていきます。
            </p>
            <p className={styles.introDescription}>
              学ぶことの楽しさを知った子どもたちは
              <br />
              自分で考え、行動し、自分の未来を切り拓くことが
              <br />
              できると信じています。
            </p>
            <p className={styles.introDescription}>
              NPO法人PLDLでは、様々なワクワクの場を
              <br />
              デザインしていきます。
            </p>
            <ButtonLink href="/activities">PLDLについて</ButtonLink>
          </div>
          <div className={styles.introImageWrap}>
            <Image
              src="/photos/boys-sawing-branch-outdoor.webp"
              alt="活動の様子"
              width={480}
              height={480}
              className={styles.introImage}
            />
          </div>
        </div>
      </section>

      <VisionSection />
      <MissionSection />

      {/* メンバーセクション */}
      {membersData.contents.length > 0 && (
        <section className={styles.members}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>メンバー</h2>
            <div className={styles.membersGrid}>
              {membersData.contents.map((member) => (
                <div key={member.id} className={styles.memberCard}>
                  <Image
                    src={member.thumbnail?.url || '/no-image.png'}
                    alt={member.name}
                    width={240}
                    height={240}
                    className={styles.memberImage}
                  />
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberDescription}>{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
