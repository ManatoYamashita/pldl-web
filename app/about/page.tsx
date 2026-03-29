import { Metadata } from 'next';
import Image from 'next/image';
import { FileText } from 'lucide-react';

import { getMembersList, type Member } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import ScrollReveal from '@/app/_components/ScrollReveal';
import MemberCarousel from '@/app/_components/MemberCarousel';
import MessageSection from '@/app/_components/MessageSection';
import IntroSection from '@/app/_components/IntroSection';
import RecruitSection from '@/app/_components/RecruitSection';
import PlaceSection from '@/app/_components/PlaceSection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '私たちについて',
  description:
    'NPO法人PLDLのVision・Mission・メンバー紹介。すべてのこどもたちの個性を活かし、未来をより良くする社会の実現を目指します。',
  openGraph: {
    title: '私たちについて',
    description:
      'NPO法人PLDLのVision・Mission・メンバー紹介。すべてのこどもたちの個性を活かし、未来をより良くする社会の実現を目指します。',
  },
  alternates: { canonical: '/about' },
};

const REPORT_YEARS = [
  {
    fiscalYear: '令和5年度',
    calendarYear: '2023年',
    documents: [
      { label: '活動報告書', href: '/documents/reports/report-2023.pdf' },
      { label: '活動計算書', href: '/documents/statements/statement-2023.pdf' },
    ],
  },
  {
    fiscalYear: '令和4年度',
    calendarYear: '2022年',
    documents: [
      { label: '活動報告書', href: '/documents/reports/report-2022.pdf' },
      { label: '活動計算書', href: '/documents/statements/statement-2022.pdf' },
    ],
  },
] as const;

export default async function Page() {
  let members: Member[] = [];
  try {
    const membersData = await getMembersList();
    members = membersData.contents;
  } catch {
    // メンバー取得に失敗してもページは表示する
  }

  return (
    <>
      <Hero
        title="私たちについて"
        sub="About Us"
        imageSrc="/photos/children-walking-outdoor-sunny.webp"
      />

      {/* 紹介セクション */}
      <IntroSection />

      <VisionSection />
      <MissionSection />

      {/* メンバーセクション */}
      {members.length > 0 && (
        <MemberCarousel members={members} />
      )}

      {/* 代表のメッセージセクション */}
      <MessageSection />

      {/* スタッフ募集中セクション */}
      <RecruitSection />

      {/* PLDLの場所セクション */}
      <PlaceSection />

      {/* 決算・活動報告書セクション */}
      <ScrollReveal delay={100}>
        <section className={styles.reportSection}>
          <div className={styles.reportContainer}>
            <div className={styles.reportImageWrap}>
              <Image
                src="/photos/kids-floor-plan-design.webp"
                alt="こどもたちが計画を立てる様子"
                width={560}
                height={420}
                className={styles.reportImage}
                sizes="(max-width: 920px) 100vw, 50vw"
              />
            </div>
            <div className={styles.reportText}>
              <div className={styles.reportAccent} />
              <p className={styles.reportSubEn}>Reports</p>
              <h2 className={styles.reportHeading}>決算・活動報告書</h2>
              <p className={styles.sectionDescription}>
                NPO法人PLDLの活動報告書・活動計算書を公開しています。
              </p>
              <div className={styles.reportYears}>
                {REPORT_YEARS.map((year) => (
                  <div key={year.calendarYear} className={styles.reportYearGroup}>
                    <h3 className={styles.reportYearLabel}>
                      {year.fiscalYear}
                      <span className={styles.reportCalendarYear}>{year.calendarYear}</span>
                    </h3>
                    <div className={styles.reportLinks}>
                      {year.documents.map((doc) => (
                        <a
                          key={doc.href}
                          href={doc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.reportLinkItem}
                        >
                          <FileText size={18} aria-hidden="true" />
                          <span>{doc.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
