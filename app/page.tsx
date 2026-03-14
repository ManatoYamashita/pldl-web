import Link from 'next/link';
import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { TOP_REPORTS_LIMIT, TOP_CATEGORY_NAMES } from '@/app/_constants';
import type { Category } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import ReportsList from '@/app/_components/ReportsList';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import BusinessCard from '@/app/_components/BusinessCard';
import ButtonLink from '@/app/_components/ButtonLink';
import Sheet from '@/app/_components/Sheet';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export default async function Page() {
  const [reportsData, categoriesData] = await Promise.all([
    getReportsList({ limit: TOP_REPORTS_LIMIT }),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;

  const topCategories = TOP_CATEGORY_NAMES
    .map((name) => categories.find((cat) => cat.name === name))
    .filter((cat): cat is Category => cat !== undefined);

  return (
    <>
      {/* Hero Section */}
      <Hero
        title="遊びを通じて、未来をつくる"
        sub="放課後こどもラボ PLDL"
        ctaText="活動内容を見る"
        ctaLink="/activities"
        imageSrc="/photos/group-photo-mountain-campsite.webp"
      />

      {/* Activity Reports Section */}
      <ScrollReveal>
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
      </ScrollReveal>

      {/* VISION Section */}
      <VisionSection />

      {/* MISSION Section */}
      <MissionSection />

      {/* Activities Section */}
      {topCategories.length > 0 && (
        <ScrollReveal>
          <section className={styles.activities}>
            <div className={styles.activitiesContainer}>
              <h2 className={styles.sectionTitle}>活動内容について</h2>
              <p className={styles.activitiesDescription}>
                遊びや体験を通じて、子供たちの好奇心と創造力を育む多彩なプログラムを提供しています。
              </p>
              <div className={styles.activitiesGrid}>
                {topCategories.map((category) => (
                  <BusinessCard
                    key={category.id}
                    category={category}
                  />
                ))}
              </div>
              <div className={styles.activitiesLink}>
                <ButtonLink href="/activities">すべての活動を見る</ButtonLink>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* SNS Section */}
      <ScrollReveal>
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
      </ScrollReveal>
    </>
  );
}
