import Link from 'next/link';
import { Twitter, Facebook, Instagram, ExternalLink } from 'lucide-react';
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

  const latestReportData = reportsData.contents[0];
  const latestReport = latestReportData
    ? {
        title: latestReportData.title,
        publishedAt: latestReportData.publishedAt ?? latestReportData.createdAt,
        slug: latestReportData.id,
      }
    : undefined;

  return (
    <>
      {/* Hero Section */}
      <Hero
        variant="showcase"
        title="創造する学びから、ワクワクする学びへ"
        highlights={[
          { text: '創造', highlighted: true },
          { text: 'する学びから、\n' },
          { text: 'ワクワク', highlighted: true },
          { text: 'する学びへ' },
        ]}
        sub="Playful Learning Design Lab. / 放課後こどもラボ"
        ctaText="PLDLについて"
        ctaLink="/about"
        imageSrc="/photos/group-photo-mountain-campsite.webp"
        latestReport={latestReport}
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
      {topCategories.length > 0 ? (
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
                    href={`/activities?category=${category.id}`}
                  />
                ))}
              </div>
              <div className={styles.activitiesLink}>
                <ButtonLink href="/activities">すべての活動を見る</ButtonLink>
              </div>
            </div>
          </section>
        </ScrollReveal>
      ) : null}

      {/* SNS Section */}
      <ScrollReveal>
        <section className={styles.sns}>
          <div className={styles.snsContainer}>
            <h2 className={styles.sectionTitle}>SNS</h2>
            <p className={styles.snsDescription}>
              最新の活動情報をSNSで発信しています。ぜひフォローしてください。
            </p>
            <div className={styles.snsCards}>
              <Link
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.snsCard} ${styles.snsCardX}`}
                aria-label="X（旧Twitter）を開く"
              >
                <span className={styles.snsCardIcon}>
                  <Twitter size={28} aria-hidden />
                </span>
                <span className={styles.snsCardLabel}>X</span>
                <ExternalLink size={16} className={styles.snsCardArrow} aria-hidden />
              </Link>
              <Link
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.snsCard} ${styles.snsCardFacebook}`}
                aria-label="Facebookを開く"
              >
                <span className={styles.snsCardIcon}>
                  <Facebook size={28} aria-hidden />
                </span>
                <span className={styles.snsCardLabel}>Facebook</span>
                <ExternalLink size={16} className={styles.snsCardArrow} aria-hidden />
              </Link>
              <Link
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.snsCard} ${styles.snsCardInstagram}`}
                aria-label="Instagramを開く"
              >
                <span className={styles.snsCardIcon}>
                  <Instagram size={28} aria-hidden />
                </span>
                <span className={styles.snsCardLabel}>Instagram</span>
                <ExternalLink size={16} className={styles.snsCardArrow} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
