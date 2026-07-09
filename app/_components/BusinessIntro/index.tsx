import Image from 'next/image';
import type { BusinessDetail } from '@/app/_constants/businesses';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './index.module.css';

type Props = {
  business: BusinessDetail;
};

/**
 * 事業詳細ページ（/activities?category=<事業>）の先頭に表示する事業紹介セクション。
 * コンセプト・リード文・特徴カード・デザイン領域・実施フロー・CTA を描画する。
 * 各ブロックはデータの有無で出し分けるため、事業ごとに情報量が異なってもよい。
 */
export default function BusinessIntro({ business }: Props) {
  const { name, subEn, tagline, lead, image, featureGroups, scope, flow, cta } = business;

  return (
    <section className={styles.intro} aria-label={`${name}の紹介`}>
      <div className={styles.container}>
        {image ? (
          // 画像リード: テキスト＋画像の2カラム
          <div className={styles.leadGrid}>
            <div className={styles.leadText}>
              <div className={styles.accent} aria-hidden="true" />
              {subEn && <p className={styles.subEn}>{subEn}</p>}
              <h2 className={styles.tagline}>{tagline}</h2>
              {lead.map((paragraph, index) => (
                <p key={index} className={styles.lead}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className={styles.leadImageWrap}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={styles.leadImage}
                sizes="(max-width: 768px) calc(100vw - 32px), 460px"
              />
            </div>
          </div>
        ) : (
          // 従来の中央寄せヘッダー
          <header className={styles.header}>
            <div className={styles.accent} aria-hidden="true" />
            {subEn && <p className={styles.subEn}>{subEn}</p>}
            <h2 className={styles.tagline}>{tagline}</h2>
            {lead.map((paragraph, index) => (
              <p key={index} className={styles.lead}>
                {paragraph}
              </p>
            ))}
          </header>
        )}

        {featureGroups?.map((group) => (
          <div key={group.heading} className={styles.group}>
            <h3 className={styles.groupHeading}>{group.heading}</h3>
            <div className={styles.featureGrid}>
              {group.items.map((item, index) => (
                <article key={item.title} className={styles.featureCard}>
                  <span className={styles.featureNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className={styles.featureTitle}>{item.title}</h4>
                  <p className={styles.featureDesc}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        ))}

        {scope && (
          <div className={styles.group}>
            <h3 className={styles.groupHeading}>{scope.heading}</h3>
            <div className={styles.scopeGrid}>
              {scope.items.map((item) => (
                <article key={item.title} className={styles.scopeCard}>
                  {item.image && (
                    <div className={styles.scopeImageWrap}>
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className={styles.scopeImage}
                        sizes="(max-width: 768px) calc(100vw - 32px), 300px"
                      />
                    </div>
                  )}
                  <div className={styles.scopeBody}>
                    <h4 className={styles.scopeTitle}>{item.title}</h4>
                    <p className={styles.scopeDesc}>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {flow && (
          <div className={styles.group}>
            <h3 className={styles.groupHeading}>{flow.heading}</h3>
            <ol className={styles.flow}>
              {flow.steps.map((step, index) => (
                <li key={step.title} className={styles.flowStep}>
                  <span className={styles.flowNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h4 className={styles.flowTitle}>{step.title}</h4>
                  <p className={styles.flowDesc}>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {cta && (
          <div className={styles.ctaWrap}>
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
