import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'ボランティアで支援する',
  description:
    'NPO法人PLDLのボランティア活動に参加しませんか。教育問題に関心がある方、地域貢献をしたい方、非営利組織に興味がある方を歓迎します。',
  openGraph: {
    title: 'ボランティアで支援する',
    description:
      'NPO法人PLDLのボランティア活動に参加しませんか。教育問題に関心がある方、地域貢献をしたい方、非営利組織に興味がある方を歓迎します。',
  },
  alternates: { canonical: '/support/volunteer' },
};

const steps = [
  {
    number: '1',
    title: 'ボランティア登録',
    description: 'お問い合わせフォームからボランティア参加希望の旨をご連絡ください。',
  },
  {
    number: '2',
    title: 'ご連絡',
    description: 'PLDLスタッフから折り返しご連絡し、活動内容やスケジュールをご説明します。',
  },
  {
    number: '3',
    title: '面談・見学',
    description: '実際の活動場所を見学いただき、雰囲気を感じていただきます。',
  },
  {
    number: '4',
    title: '活動開始',
    description: 'あなたのペースで、できることから活動をスタートします。',
  },
];

const volunteerTypes = [
  {
    title: 'PLDLスタッフ',
    description:
      '放課後こどもラボの運営スタッフとして、こどもたちと一緒に過ごし、プロジェクト活動をサポートします。週1回から参加可能です。',
  },
  {
    title: '出張ワークショップスタッフ',
    description:
      '学校や地域のイベントでの出張ワークショップに同行し、準備や運営をサポートします。単発での参加も歓迎です。',
  },
];

export default function Page() {
  return (
    <>
      <Hero
        title="ボランティアで支援する"
        sub="Support — Volunteer"
        imageSrc="/photos/group-photo-mountain-campsite.webp"
        compact
      />

      {/* ボランティアで支援するとは？ */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>What is Volunteer Support?</p>
              <h2 className={styles.sectionHeading}>ボランティアで支援するとは？</h2>
              <p className={styles.sectionBody}>
                PLDLは「こどもたちにとって、人との関わりが最も大切な学び」だと考えています。
                様々な大人と出会い、一緒に過ごすことで、
                こどもたちは多様な価値観や生き方を知ることができます。
              </p>
              <p className={styles.sectionBody}>
                『教育問題に関心がある』『地域貢献をしたい』『非営利組織に興味がある』など、
                様々な動機でボランティアに参加できます。
                特別な資格や経験は必要ありません。
              </p>
            </div>
            <div className={`${styles.sectionImageWrap} ${styles.imageFrameTertiary}`}>
              <Image
                src="/photos/group-photo-mountain-campsite.webp"
                alt="キャンプ場での集合写真"
                width={560}
                height={400}
                className={styles.sectionImage}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 参加資格 */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.qualContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Qualification
            </p>
            <h2 className={styles.qualHeading}>参加資格</h2>
            <div className={styles.qualCard}>
              <p className={styles.qualText}>
                群馬県みどり市の活動拠点に、<strong>1時間以内で通える方</strong>
                であれば、どなたでもご参加いただけます。
              </p>
              <p className={styles.qualNote}>
                年齢・性別・経験不問。高校生以上の方を対象としています。
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 参加方法 */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.flowContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              How to Join
            </p>
            <h2 className={styles.flowHeading}>参加方法</h2>

            <div className={styles.stepFlow}>
              {steps.map((step, index) => (
                <div key={step.number}>
                  <div className={styles.stepCard}>
                    <div className={styles.stepBadge}>{step.number}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepBody}>{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={styles.stepConnector} aria-hidden="true">
                      <div className={styles.stepDots}>
                        <span className={styles.stepDot} />
                        <span className={styles.stepDot} />
                        <span className={styles.stepDotArrow} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ボランティア例 */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.typeContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Volunteer Roles
            </p>
            <h2 className={styles.typeHeading}>ボランティア例</h2>

            <div className={styles.typeCards}>
              {volunteerTypes.map((type) => (
                <div key={type.title} className={styles.typeCard}>
                  <h3 className={styles.typeTitle}>{type.title}</h3>
                  <p className={styles.typeBody}>{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ボランティアの声 */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.testimonialContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Volunteer Voice
            </p>
            <h2 className={styles.testimonialHeading}>ボランティアの声</h2>

            <blockquote className={styles.testimonial}>
              <p className={styles.testimonialText}>
                PLDLの活動に参加して、こどもたちのエネルギーに驚かされました。
                自分が教えるというよりも、一緒に学び、一緒に成長している感覚です。
                こどもたちの純粋な好奇心に触れることで、
                自分自身も新しい視点を得ることができています。
              </p>
              <footer className={styles.testimonialFooter}>
                <cite className={styles.testimonialAuthor}>野村 元信さん</cite>
                <span className={styles.testimonialRole}>ボランティアスタッフ</span>
              </footer>
            </blockquote>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaHeading}>ボランティア登録をする</h2>
            <p className={styles.ctaDescription}>
              まずはお気軽にお問い合わせください。活動内容やスケジュールについてご説明いたします。
            </p>
            <div className={styles.ctaButtons}>
              <ButtonLink href="/contact" variant="primary">
                ボランティア登録をする
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
