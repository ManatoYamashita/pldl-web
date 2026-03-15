import { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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

const PLACE_ITEMS = [
  { label: 'アクセス', href: '#' },
  { label: '活動拠点', href: '#' },
  { label: '施設の様子', href: '#' },
  { label: '周辺環境', href: '#' },
  { label: '活動の雰囲気', href: '#' },
  { label: 'ギャラリー', href: '#' },
];

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

      {/* PIDLの場所セクション */}
      <ScrollReveal delay={100}>
        <section className={styles.placeSection}>
          <div className={styles.placeContainer}>
            <div className={styles.placeText}>
              <div className={styles.placeAccent} />
              <p className={styles.placeSubEn}>Place</p>
              <h2 className={styles.placeHeading}>PLDLの場所</h2>
              <p className={styles.sectionDescription}>
                PLDLの活動拠点をご紹介します。 こどもたちが安心して学び、遊べる環境を整えています。
              </p>
              <div className={styles.placeLinks}>
                {PLACE_ITEMS.map((item) => (
                  <a key={item.label} href={item.href} className={styles.placeLinkItem}>
                    <span>{item.label}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
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
    </>
  );
}
