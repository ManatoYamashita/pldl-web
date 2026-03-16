import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'PLDLではたらくということ',
  description:
    'NPO法人PLDLで働く意義。こどもたちの未来をより良くすること、自分のスキルを還元すること、教育における社会課題解決に寄与すること。ボランティアからスタッフへのステップアップ制度もあります。',
  alternates: { canonical: '/recruit' },
};

export default function Page() {
  return (
    <>
      <Hero
        title="PLDLではたらくということ"
        sub="Work with Us"
        imageSrc="/photos/child-presenting-paper-group.webp"
        compact
      />

      {/* Section 1: こどもたちの未来をより良くすること */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>01 — For Children</p>
              <h2 className={styles.sectionHeading}>
                こどもたちの未来を
                <br />
                より良くすること
              </h2>
              <p className={styles.sectionBody}>
                PLDLの活動は、すべて「こどもたちのために」という想いから始まっています。
              </p>
              <p className={styles.sectionBody}>
                学校でも家庭でもない「第三の居場所」で、こどもたちが安心して過ごせる環境をつくること。
                そこで出会う大人たちが、こどもたちにとって信頼できる存在であること。
              </p>
              <p className={styles.sectionBody}>
                わたしたちと一緒に活動するということは、こどもたちの日常に寄り添い、
                その成長を間近で見守る「並走する仲間」になるということです。
              </p>
            </div>
            <div className={`${styles.sectionImageWrap} ${styles.imageFramePrimary}`}>
              <Image
                src="/photos/children-stream-exploration.webp"
                alt="大人と一緒に川で探検するこどもたち"
                width={560}
                height={400}
                className={styles.sectionImage}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Section 2: 自分のスキルやノウハウを還元すること */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={`${styles.sectionContainer} ${styles.sectionReverse}`}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>02 — Your Skills Matter</p>
              <h2 className={styles.sectionHeading}>
                自分のスキルやノウハウを
                <br />
                還元すること
              </h2>
              <p className={styles.sectionBody}>
                PLDLでの活動には、特別な資格は必要ありません。
              </p>
              <p className={styles.sectionBody}>
                料理が得意な人は、こどもたちと一緒に調理体験を。
                スポーツが好きな人は、外遊びの企画を。
                ものづくりが好きな人は、工作やプログラミングのワークショップを。
              </p>
              <p className={styles.sectionBody}>
                あなたが持っている「好き」や「得意」は、
                こどもたちにとってかけがえのない体験になります。
                日常の中で培ってきたスキルやノウハウを、次の世代に届けてみませんか。
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

      {/* Section 3: 教育における社会課題解決に寄与すること */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>03 — Social Impact</p>
              <h2 className={styles.sectionHeading}>
                教育における社会課題解決に
                <br />
                寄与すること
              </h2>
              <p className={styles.sectionBody}>
                日本では、約7人に1人のこどもが相対的貧困の状態にあると言われています。
                経済的な理由で学びの機会や体験活動が制限されるこどもたちがいます。
              </p>
              <p className={styles.sectionBody}>
                PLDLは、すべてのこどもたちに等しく学びと体験の機会を届けるために活動しています。
                わたしたちの活動に参加することは、教育格差という社会課題に対して、
                あなた自身が直接アクションを起こすことにつながります。
              </p>
              <p className={styles.sectionBody}>
                一人ひとりの参加が、社会を変える力になります。
              </p>
            </div>
            <div className={`${styles.sectionImageWrap} ${styles.imageFrameTertiary}`}>
              <Image
                src="/photos/kids-reading-together.webp"
                alt="一緒に本を読むこどもたち"
                width={560}
                height={400}
                className={styles.sectionImage}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Section 4: ステップアップ制度 */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.stepUpContainer}>
            <div className={styles.accent} style={{ margin: '0 auto' }} />
            <p className={styles.subEn} style={{ textAlign: 'center' }}>
              Step-Up Program
            </p>
            <h2 className={styles.stepUpHeading}>ステップアップ制度</h2>
            <p className={styles.stepUpDescription}>
              PLDLでは、ボランティアスタッフからスタートして、
              経験を積みながらステップアップしていく仕組みがあります。
            </p>

            <div className={styles.stepFlow}>
              <div className={styles.stepCard}>
                <div className={styles.stepBadge}>1</div>
                <h3 className={styles.stepTitle}>ボランティア</h3>
                <p className={styles.stepBody}>
                  まずはボランティアスタッフとして活動に参加。
                  こどもたちとの関わり方や、PLDLの雰囲気を知ることから始めます。
                </p>
              </div>

              <div className={styles.stepConnector} aria-hidden="true">
                <div className={styles.stepDots}>
                  <span className={styles.stepDot} />
                  <span className={styles.stepDot} />
                  <span className={styles.stepDotArrow} />
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepBadge}>2</div>
                <h3 className={styles.stepTitle}>経験を積む</h3>
                <p className={styles.stepBody}>
                  〇か月の活動を通じて、プログラムの企画や運営にも携わっていきます。
                  研修やサポート体制も整っています。
                </p>
              </div>

              <div className={styles.stepConnector} aria-hidden="true">
                <div className={styles.stepDots}>
                  <span className={styles.stepDot} />
                  <span className={styles.stepDot} />
                  <span className={styles.stepDotArrow} />
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepBadge}>3</div>
                <h3 className={styles.stepTitle}>スタッフへ</h3>
                <p className={styles.stepBody}>
                  経験と実績を積んだら、有給スタッフとして活動することも可能です。
                  あなたのペースで、関わり方を広げていけます。
                </p>
              </div>
            </div>

            <div className={styles.stepNote}>
              <p>
                最初から大きな責任を負う必要はありません。
                あなたのペースで、できることから始めていただければ大丈夫です。
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <div className={styles.waveTop} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,80 C240,70 480,0 720,30 C960,60 1200,10 1440,25 L1440,80 L0,80 Z" />
        </svg>
      </div>
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <p className={styles.ctaLead}>週1からでも歓迎です。</p>
          <h2 className={styles.ctaHeading}>
            まずはボランティアスタッフとして
            <br />
            私たちと働きませんか？
          </h2>
          <div className={styles.ctaButton}>
            <ButtonLink href="/contact" variant="dark">
              お問い合わせ
            </ButtonLink>
          </div>
        </div>
      </section>
      <div className={styles.waveBottom} aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,0 C240,10 480,80 720,50 C960,20 1200,70 1440,55 L1440,0 L0,0 Z" />
        </svg>
      </div>
    </>
  );
}
