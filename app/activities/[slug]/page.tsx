import { Metadata } from 'next';
import Image from 'next/image';
import {
  getReportsDetail,
  getNextReport,
  getPrevReport,
  getRelatedReports,
} from '@/app/_libs/microcms';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/app/_constants';
import { buildPageMetadata } from '@/app/_libs/metadata';
import { serializeJsonLd, toDisplayImageUrl, toOgImageUrl } from '@/app/_libs/utils';
import Article from '@/app/_components/Article';
import ArticleNavigation from '@/app/_components/ArticleNavigation';
import RelatedReports from '@/app/_components/RelatedReports';
import ButtonLink from '@/app/_components/ButtonLink';
import ScrollReveal from '@/app/_components/ScrollReveal';
import styles from './page.module.css';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getReportsDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return buildPageMetadata({
    title: data.title,
    description: data.description,
    path: `/activities/${params.slug}`,
    openGraph: {
      type: 'article',
      ...(data.thumbnail && {
        images: [
          {
            url: toOgImageUrl(data.thumbnail.url),
            type: 'image/jpeg',
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
          },
        ],
      }),
    },
  });
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const data = await getReportsDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  const publishedAt = data.publishedAt || data.createdAt;

  const [nextReport, prevReport, relatedReports] = await Promise.all([
    getNextReport(publishedAt),
    getPrevReport(publishedAt),
    getRelatedReports(data.category.id, data.id),
  ]);

  const hasThumbnail = !!data.thumbnail;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.thumbnail ? toOgImageUrl(data.thumbnail.url) : undefined,
    datePublished: data.publishedAt || data.createdAt,
    dateModified: data.updatedAt,
    author: { '@id': `${baseUrl}/#organization` },
    publisher: { '@id': `${baseUrl}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      {hasThumbnail && (
        <div className={styles.heroImage}>
          <Image
            src={toDisplayImageUrl(data.thumbnail!.url)}
            alt={data.title}
            className={styles.heroImg}
            fill
            sizes="100vw"
            quality={80}
            priority
          />
        </div>
      )}
      <div className={`${styles.container} ${!hasThumbnail ? styles.noHero : ''}`}>
        <ScrollReveal threshold={0}>
          <Article data={data} />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <ArticleNavigation prevReport={prevReport} nextReport={nextReport} />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <RelatedReports reports={relatedReports} />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <div className={styles.footer}>
            <ButtonLink href="/activities">活動レポート一覧へ</ButtonLink>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
