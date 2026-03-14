import { Metadata } from 'next';
import { getReportsDetail } from '@/app/_libs/microcms';
import { DEFAULT_OG_IMAGE } from '@/app/_constants';
import Article from '@/app/_components/Article';
import styles from './page.module.css';
import ButtonLink from '@/app/_components/ButtonLink';

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

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      type: 'article',
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url || DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: `/activities/${params.slug}`,
    },
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const data = await getReportsDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.thumbnail?.url,
    datePublished: data.publishedAt || data.createdAt,
    dateModified: data.updatedAt,
    author: { '@id': `${baseUrl}/#organization` },
    publisher: { '@id': `${baseUrl}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/activities">活動レポート一覧へ</ButtonLink>
      </div>
    </>
  );
}
