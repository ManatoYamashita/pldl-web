import Image from 'next/image';
import Link from 'next/link';
import { getReportsList, getMembersList, getCategoryList } from '@/app/_libs/microcms';
import { TOP_REPORTS_LIMIT } from '@/app/_constants';
import Hero from '@/app/_components/Hero';
import ReportsList from '@/app/_components/ReportsList';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import BusinessCard from '@/app/_components/BusinessCard';
import ButtonLink from '@/app/_components/ButtonLink';
import Sheet from '@/app/_components/Sheet';
import styles from './page.module.css';

export default async function Page() {
  const [reportsData, membersData, categoriesData] = await Promise.all([
    getReportsList({ limit: TOP_REPORTS_LIMIT }),
    getMembersList(),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="遊びを通じて、未来をつくる"
        sub="放課後こどもラボ PLDL"
        ctaText="活動内容を見る"
        ctaLink="/activities"
        imageSrc="/img-mv.jpg"
      />

      {/* Activity Reports Section */}
      <section className={styles.reports}>
        <div className={styles.reportsInner}>
          <div className={styles.reportsDecoration} aria-hidden="true" />
          <h2 className={styles.reportsVerticalTitle}>活動レポート</h2>
          <Sheet className={styles.reportsSheet}>
            <ReportsList reports={reportsData.contents} />
            <div className={styles.reportsLink}>
              <ButtonLink href="/activities">もっと見る</ButtonLink>
            </div>
          </Sheet>
        </div>
      </section>

      {/* VISION Section */}
      <VisionSection />

      {/* MISSION Section */}
      <MissionSection />

      {/* Activities Section */}
      {categories.length > 0 && (
        <section className={styles.activities}>
          <div className={styles.activitiesContainer}>
            <h2 className={styles.sectionTitle}>活動内容</h2>
            <p className={styles.activitiesDescription}>
              遊びや体験を通じて、子供たちの好奇心と創造力を育む多彩なプログラムを提供しています。
            </p>
            <div className={styles.activitiesGrid}>
              {categories.slice(0, 3).map((category, index) => (
                <BusinessCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
            <div className={styles.activitiesLink}>
              <ButtonLink href="/activities">すべての活動を見る</ButtonLink>
            </div>
          </div>
        </section>
      )}

      {/* Members Section */}
      {membersData.contents.length > 0 && (
        <section className={styles.members} id="members">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>メンバー</h2>
            {membersData.contents.map((member, index) => (
              <div key={member.id} className={`${styles.memberItem} ${index % 2 === 1 ? styles.memberReverse : ''}`}>
                <div className={styles.memberText}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberDescription}>{member.description}</p>
                </div>
                {member.thumbnail ? (
                  <Image
                    src={member.thumbnail.url}
                    alt={member.name}
                    width={member.thumbnail.width}
                    height={member.thumbnail.height}
                    className={styles.memberImage}
                  />
                ) : (
                  <Image
                    src="/no-image.png"
                    alt="No Image"
                    width={240}
                    height={240}
                    className={styles.memberImage}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SNS Section */}
      <section className={styles.sns}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>SNS</h2>
          <p className={styles.snsDescription}>
            最新の活動情報をSNSで発信しています。ぜひフォローしてください。
          </p>
          <div className={styles.snsLinks}>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.snsLink}>
              Twitter
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.snsLink}>
              Facebook
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.snsLink}>
              Instagram
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
