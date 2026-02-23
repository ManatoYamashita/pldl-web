import { Metadata } from 'next';
import { getReportsDetail } from '@/app/_libs/microcms';
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
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url || ''],
    },
    alternates: {
      canonical: `/activities/${params.slug}`,
    },
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getReportsDetail(params.slug, {
    draftKey: searchParams.dk,
  });
  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/activities">活動レポート一覧へ</ButtonLink>
      </div>
    </>
  );
}
