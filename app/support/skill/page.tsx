import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'スキルで支援する',
  description:
    'あなたのスキルやノウハウを、こどもたちの学びに活かしてみませんか。NPO法人PLDLでは個人・法人からのスキル支援を募集しています。',
  alternates: { canonical: '/support/skill' },
};

export default function Page() {
  return (
    <>
      <Hero
        title="スキルで支援する"
        sub="Support — Skill"
        imageSrc="/photos/child-presenting-paper-group.webp"
        compact
      />

      {/* スキルで支援するとは？ */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>What is Skill Support?</p>
              <h2 className={styles.sectionHeading}>スキルで支援するとは？</h2>
              <p className={styles.sectionBody}>
                PLDLの活動では、こどもたちが様々なプロジェクトに取り組みます。
                その過程で、プロジェクトを推進するための専門的な知識や体験が必要になることがあります。
              </p>
              <p className={styles.sectionBody}>
                例えば、ツリーハウスを作るプロジェクトでは、
                建築の知識、木材加工の技術、安全管理のノウハウなど、
                多岐にわたるスキルが求められます。
              </p>
              <p className={styles.sectionBody}>
                あなたや御社がお持ちの専門スキル・ノウハウを、
                こどもたちのプロジェクトに活かしていただけませんか。
              </p>
            </div>
            <div className={`${styles.sectionImageWrap} ${styles.imageFramePrimary}`}>
              <Image
                src="/photos/children-stream-exploration.webp"
                alt="大人と一緒に探検するこどもたち"
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
          <div className={styles.methodContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              How to Support
            </p>
            <h2 className={styles.methodHeading}>支援方法</h2>
            <p className={styles.methodDescription}>
              スキル支援には、大きく分けて2つの方法があります。
            </p>

            <div className={styles.methodCards}>
              <div className={styles.methodCard}>
                <span className={styles.methodNumber}>01</span>
                <h3 className={styles.methodTitle}>知見を提供する</h3>
                <p className={styles.methodBody}>
                  こどもたちのプロジェクトに対して、
                  あなたの専門知識や経験をアドバイスとして提供していただきます。
                  オンラインでの相談対応も可能です。
                </p>
              </div>
              <div className={styles.methodCard}>
                <span className={styles.methodNumber}>02</span>
                <h3 className={styles.methodTitle}>スキルを提案する</h3>
                <p className={styles.methodBody}>
                  あなたが持っているスキルを活かした
                  ワークショップや体験プログラムの企画・実施をご提案いただけます。
                  こどもたちに新しい体験を届けてください。
                </p>
              </div>
            </div>

            <div className={styles.methodCta}>
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
                  定期的に活動報告をお送りし、ご支援がどのように活かされているかをお伝えします。
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
    </>
  );
}
