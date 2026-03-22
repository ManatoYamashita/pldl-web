import { Metadata } from 'next';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '寄付で支援する',
  description:
    'NPO法人PLDLへの寄付のご案内。個人・法人どちらからもご寄付いただけます。皆様のご支援が、こどもたちの学びの場を支えます。',
  openGraph: {
    title: '寄付で支援する',
    description:
      'NPO法人PLDLへの寄付のご案内。個人・法人どちらからもご寄付いただけます。皆様のご支援が、こどもたちの学びの場を支えます。',
  },
  alternates: { canonical: '/support/donation' },
};

export default function Page() {
  return (
    <>
      <Hero
        title="寄付で支援する"
        sub="Support — Donation"
        imageSrc="/photos/children-walking-outdoor-sunny.webp"
        compact
      />

      {/* 寄付で支援するとは？ */}
      <ScrollReveal>
        <section className={styles.section}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionText}>
              <div className={styles.accent} />
              <p className={styles.subEn}>What is Donation Support?</p>
              <h2 className={styles.sectionHeading}>寄付で支援するとは？</h2>
              <p className={styles.sectionBody}>
                皆様のご寄付で、多くの子どもたちが本来持っている力を伸ばし、より良い未来に進むことができます。
              </p>
              <p className={styles.sectionBody}>
                PLDLの活動は、放課後こどもラボや出張ワークショップの運営、教材・素材の購入、
                活動場所の維持管理など、多くの費用を必要としています。
                皆様からいただく寄付は、これらの活動を継続し、
                より多くのこどもたちに学びと体験の機会を届けるために大切に活用させていただきます。
              </p>
              <p className={styles.sectionBody}>
                個人の方も法人・団体の方も、それぞれの方法でご支援いただけます。
                金額の大小に関わらず、すべてのご寄付がこどもたちの未来につながります。
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaHeading}>ご寄付のお申し込み</h2>
            <p className={styles.ctaDescription}>
              以下のリンクから、個人・法人それぞれの寄付ページへお進みいただけます。
            </p>
            <div className={styles.ctaButtons}>
              <ButtonLink
                href="https://ldl.cocotte.jp/wordpress/do-individual/"
                variant="primary"
                isExternal
              >
                個人の方はこちら
              </ButtonLink>
              <ButtonLink
                href="https://ldl.cocotte.jp/wordpress/do-organization/"
                variant="secondary"
                isExternal
              >
                法人・団体の方はこちら
              </ButtonLink>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
