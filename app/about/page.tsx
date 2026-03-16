import { Metadata } from 'next';
import Image from 'next/image';
import { FileText } from 'lucide-react';

import { getMembersList } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import MemberCarousel from '@/app/_components/MemberCarousel';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '私たちについて',
  description:
    'NPO法人PLDLのVision・Mission・メンバー紹介。すべてのこどもたちの個性を活かし、未来をより良くする社会の実現を目指します。',
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

const ORG_INFO_ITEMS = [
  { term: '名称', description: 'NPO法人 Playful Learning Design Lab.' },
  { term: '設立', description: '2022年10月' },
  { term: '代表理事', description: '尾池咲季子（松島）' },
  { term: '理事', description: '近藤隼人　浦田充起' },
  { term: '監事', description: '新井雄一　アライ商会株式会社 代表取締役' },
  { term: '所在地', description: '〒379-2313 群馬県みどり市笠懸町鹿3616-1' },
] as const;

export default async function Page() {
  const membersData = await getMembersList();

  return (
    <>
      <Hero
        title="私たちについて"
        sub="About Us"
        imageSrc="/photos/children-walking-outdoor-sunny.webp"
      />

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
              sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 360px"
            />
          </div>
        </div>
      </section>

      <VisionSection />
      <MissionSection />

      {/* メンバーセクション */}
      {membersData.contents.length > 0 && (
        <ScrollReveal>
          <MemberCarousel members={membersData.contents} />
        </ScrollReveal>
      )}

      {/* 代表のメッセージセクション */}
      <ScrollReveal delay={100}>
        <section className={styles.messageSection}>
          <div className={styles.messageContainer}>
            <div className={styles.messageText}>
              <div className={styles.messageAccent} />
              <p className={styles.messageSubEn}>Message</p>
              <h2 className={styles.messageHeading}>代表のメッセージ</h2>
              <div className={styles.messageImageMobile}>
                <Image
                  src="/photos/kids-floor-plan-design.webp"
                  alt="こどもたちが自ら計画し活動する様子"
                  width={280}
                  height={280}
                  className={styles.messageImageCircle}
                  sizes="200px"
                />
              </div>
              <div className={styles.messageBody}>
                <p>
                  はじめてこどもたちとワークショップをした日、こどもたちは
                  想像をはるかに超える創造力と好奇心で私を圧倒してくれました。
                </p>
                <p>
                  成長していく中で環境や一部の評価などを理由に
                  学びからドロップアウトしてしまうこどもが多いのが現状です。
                  しかし、私はあの日、すべてのこどもたちは平等に素晴らしい力を持っていて
                  その力さえ引き出せれば、創造力と好奇心と、そして強い意志をもって
                  未来を切り開いていくことができると実感しました。
                </p>
                <p>
                  私たちは、学ぶことは楽しい、知らないことを知ることは面白いことというポジティブな
                  マインドをもったこどもを一人でも増やしたいという思いでこの事業を立ち上げました。
                </p>
                <p>
                  環境や経済状況に関わらず自らの力と意志で自分の未来を切り開いてくれるこどもが
                  増えることを目指して私たちはこどもたちの「したい！」「知りたい！」を全力でサポートし続けます。
                </p>
              </div>
              <div className={styles.messageSignature}>
                <span className={styles.signatureRole}>代表理事</span>
                <span className={styles.signatureName}>松島咲季子</span>
              </div>
            </div>
            <div className={styles.messageImageWrap}>
              <Image
                src="/photos/kids-floor-plan-design.webp"
                alt="こどもたちが自ら計画し活動する様子"
                width={560}
                height={420}
                className={styles.messageImage}
                sizes="(max-width: 920px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* スタッフ募集中セクション */}
      <ScrollReveal delay={100}>
        <section className={styles.recruitSection}>
          <div className={styles.recruitContainer}>
            <div className={styles.recruitImageWrap}>
              <Image
                src="/photos/group-photo-cardboard-craft.webp"
                alt="スタッフの活動風景"
                width={560}
                height={420}
                className={styles.recruitImage}
                sizes="(max-width: 920px) 100vw, 50vw"
              />
            </div>
            <div className={styles.recruitText}>
              <div className={styles.recruitAccent} />
              <p className={styles.recruitSubEn}>Join us</p>
              <h2 className={styles.recruitHeading}>
                私たちと一緒に
                <br />
                働きませんか？
              </h2>
              <p className={styles.sectionDescription}>
                PLDLでは、こどもたちの学びの場を一緒に創るスタッフを募集しています。
                教育に興味がある方、こどもたちと関わることが好きな方、
                私たちと一緒にワクワクする学びの場をデザインしませんか？
              </p>
              <ButtonLink href="/contact">
                VIEW MORE
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* PLDLの場所セクション */}
      <ScrollReveal delay={100}>
        <section className={styles.placeSection}>
          <div className={styles.placeContainer}>
            <div className={styles.placeText}>
              <div className={styles.placeAccent} />
              <p className={styles.placeSubEn}>Place</p>
              <h2 className={styles.placeHeading}>PLDLの場所</h2>
              <p className={styles.sectionDescription}>
                NPO法人PLDLの基本情報をご紹介します。
              </p>
              <dl className={styles.orgInfo}>
                {ORG_INFO_ITEMS.map((item) => (
                  <div key={item.term} className={styles.orgInfoRow}>
                    <dt className={styles.orgInfoTerm}>{item.term}</dt>
                    <dd className={styles.orgInfoDesc}>{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={styles.placeImageWrap}>
              <Image
                src="/photos/children-sitting-class-gathering.webp"
                alt="活動拠点の様子"
                width={560}
                height={420}
                className={styles.placeImage}
                sizes="(max-width: 920px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 決算・活動報告書セクション */}
      <ScrollReveal delay={100}>
        <section className={styles.reportSection}>
          <div className={styles.reportContainer}>
            <div className={styles.reportImageWrap}>
              <Image
                src="/photos/children-sitting-class-gathering.webp"
                alt="活動の様子"
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
