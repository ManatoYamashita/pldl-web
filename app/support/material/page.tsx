import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '素材で支援する',
  description:
    'こどもたちの創作活動に必要な材料・素材のご提供をお願いしています。木材、布、紙、金属など、あなたの手元にある素材が学びの場を豊かにします。',
  alternates: { canonical: '/support/material' },
};

const materials = [
  {
    name: '木材',
    description: '端材・廃材・丸太など。ツリーハウスや工作に活用します。',
  },
  {
    name: '布・繊維',
    description: '端切れ・毛糸・ロープなど。手芸やものづくりに活用します。',
  },
  {
    name: '紙・段ボール',
    description: '画用紙・段ボール・包装紙など。工作や造形活動に活用します。',
  },
  {
    name: '金属・その他',
    description: 'ネジ・釘・金具・塗料など。本格的なものづくりに活用します。',
  },
];

export default function Page() {
  return (
    <>
      <Hero
        title="素材で支援する"
        sub="Support — Material"
        imageSrc="/photos/kids-craft-activity-table.webp"
        compact
      />

      {/* 材料・素材を支援するとは？ */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>What is Material Support?</p>
              <h2 className={styles.sectionHeading}>材料・素材を支援するとは？</h2>
              <p className={styles.sectionBody}>
                PLDLの活動では、こどもたちがさまざまな創作活動に取り組みます。
                ツリーハウスの建設、工作、手芸、アート制作など、
                多種多様なプロジェクトには多くの材料や素材が必要です。
              </p>
              <p className={styles.sectionBody}>
                たくさんの素材に触れることは、こどもたちの想像力を刺激し、
                創造性を育みます。
                ご家庭や企業で余っている素材があれば、ぜひPLDLにご提供ください。
              </p>
            </div>
            <div className={`${styles.sectionImageWrap} ${styles.imageFrameSecondary}`}>
              <Image
                src="/photos/kids-craft-activity-table.webp"
                alt="テーブルで工作活動をするこどもたち"
                width={560}
                height={400}
                className={styles.sectionImage}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 支援方法 */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.ctaContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              How to Support
            </p>
            <h2 className={styles.ctaHeading}>支援方法</h2>
            <p className={styles.ctaDescription}>
              ご提供いただける素材がございましたら、まずはお問い合わせフォームよりご連絡ください。
              素材の種類・量に応じて、受け取り方法をご相談させていただきます。
            </p>
            <div className={styles.ctaButtons}>
              <ButtonLink href="/contact" variant="primary">
                個人の方はこちら
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                法人・団体の方はこちら
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 支援していただくと */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.benefitContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Benefits
            </p>
            <h2 className={styles.benefitHeading}>支援していただくと</h2>

            <div className={styles.benefitCards}>
              <div className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>HPへの掲載</h3>
                <p className={styles.benefitBody}>
                  ご支援いただいた個人・法人様のお名前を、PLDLのホームページに掲載させていただきます。
                </p>
              </div>
              <div className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>活動報告の送付</h3>
                <p className={styles.benefitBody}>
                  定期的に活動報告をお送りし、ご提供いただいた素材がどのように活かされているかをお伝えします。
                </p>
              </div>
              <div className={styles.benefitCard}>
                <span className={styles.comingSoon}>Coming Soon</span>
                <h3 className={styles.benefitTitle}>その他の特典</h3>
                <p className={styles.benefitBody}>
                  今後、支援者様向けの特典やイベントを準備中です。詳細が決まり次第お知らせいたします。
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 募集している主な材料・素材 */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.materialContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Materials We Need
            </p>
            <h2 className={styles.materialHeading}>募集している主な材料・素材</h2>

            <div className={styles.materialGrid}>
              {materials.map((material) => (
                <div key={material.name} className={styles.materialCard}>
                  <h3 className={styles.materialName}>{material.name}</h3>
                  <p className={styles.materialDescription}>{material.description}</p>
                </div>
              ))}
            </div>

            <p className={styles.materialNote}>
              上記以外の素材も歓迎しております。まずはお気軽にお問い合わせください。
            </p>
            <div className={styles.materialCta}>
              <ButtonLink href="/contact" variant="outline">
                お問い合わせ
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
