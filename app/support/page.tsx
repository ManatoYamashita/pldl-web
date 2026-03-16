import { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'サポートのお願い',
  description:
    'NPO法人PLDLへのサポート方法のご案内。スキル・素材・ボランティア・寄付の4つの方法で、こどもたちの学びの場を支えてください。',
  alternates: { canonical: '/support' },
};

const supportMethods = [
  {
    number: '01',
    title: 'スキルで支援する',
    description:
      '放課後こどもラボや出張ワークショップでは、こどもたちが様々なプロジェクトを立ち上げます。貴方、御社が持っているスキルやノウハウをこどもたちに伝えてもらえませんか？',
    image: '/photos/child-presenting-paper-group.webp',
    imageAlt: 'こどもがグループの前で発表している様子',
    color: 'primary' as const,
    slug: 'skill',
    ctaType: 'dual' as const,
  },
  {
    number: '02',
    title: '素材で支援する',
    description:
      'たくさんの素材に触れることは、子どもたちの想像力を刺激します。貴方や御社が持っている材料や素材で、PLDLにご提供いただけるものはございませんか？',
    image: '/photos/kids-craft-activity-table.webp',
    imageAlt: 'こどもたちがテーブルで工作している様子',
    color: 'secondary' as const,
    slug: 'material',
    ctaType: 'dual' as const,
  },
  {
    number: '03',
    title: 'ボランティアで支援する',
    description:
      '『教育問題に関心がある』『地域貢献をしたい』『非営利組織に興味がある』など、様々な動機でボランティアに参加できます。ぜひ、ボランティアに参加しませんか。',
    image: '/photos/group-photo-mountain-campsite.webp',
    imageAlt: 'キャンプ場での集合写真',
    color: 'tertiary' as const,
    slug: 'volunteer',
    ctaType: 'single' as const,
  },
  {
    number: '04',
    title: '寄付で支援する',
    description:
      '皆様のご寄付で、多くの子どもたちが本来持っている力を伸ばし、より良い未来に進むことができます。ぜひ、ご協力のほど、よろしくお願いいたします。',
    image: '/photos/children-walking-outdoor-sunny.webp',
    imageAlt: 'こどもたちが屋外を歩いている様子',
    color: 'accent' as const,
    slug: 'donation',
    ctaType: 'dual' as const,
  },
];

export default function Page() {
  return (
    <>
      <Hero
        title="サポートのお願い"
        sub="Support"
        imageSrc="/photos/group-photo-cardboard-craft.webp"
        compact
      />

      <section className={styles.intro}>
        <div className={styles.introContainer}>
          <ScrollReveal>
            <p className={styles.introLead}>
              PLDLの活動は、多くの方々のご支援によって支えられています。
              <br />
              あなたの力を、こどもたちの未来に届けてください。
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h2 className={styles.introHeading}>
              <span className={styles.introNumber}>4</span>
              <span className={styles.introText}>つのサポート</span>
            </h2>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.methods}>
        <div className={styles.methodsContainer}>
          {supportMethods.map((method, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div
                className={`${styles.card} ${styles[method.color]} ${index % 2 !== 0 ? styles.reverse : ''}`}
              >
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={method.image}
                    alt={method.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    quality={75}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <span className={styles.cardNumber}>{method.number}</span>
                  <h3 className={styles.cardTitle}>{method.title}</h3>
                  <p className={styles.cardDescription}>{method.description}</p>
                  <div className={styles.cardCta}>
                    {method.ctaType === 'single' ? (
                      <ButtonLink href={`/support/${method.slug}`} variant="outline">
                        ボランティアに参加する
                      </ButtonLink>
                    ) : (
                      <>
                        <ButtonLink href={`/support/${method.slug}`} variant="outline">
                          個人の方はこちら
                        </ButtonLink>
                        <ButtonLink href={`/support/${method.slug}`} variant="outline">
                          法人・団体の方はこちら
                        </ButtonLink>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
