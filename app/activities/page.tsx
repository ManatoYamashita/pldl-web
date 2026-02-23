import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT } from '@/app/_constants';
import ReportsList from '@/app/_components/ReportsList';
import ActivityCard from '@/app/_components/ActivityCard';
import Pagination from '@/app/_components/Pagination';
import styles from './page.module.css';

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const query = await searchParams;
  const page = query?.page ? parseInt(query.page) : 1;
  const offset = (page - 1) * REPORTS_LIST_LIMIT;

  const [reportsData, categoriesData] = await Promise.all([
    getReportsList({ limit: REPORTS_LIST_LIMIT, offset }),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;
  const colorVariants: Array<'primary' | 'secondary' | 'tertiary' | 'accent'> = [
    'primary',
    'secondary',
    'tertiary',
    'accent',
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>活動内容</h1>
        <p className={styles.description}>
          PLDLでは、子供たちが遊びを通じて学ぶ様々な活動を行っています。
        </p>
      </section>

      {categories.length > 0 && (
        <section className={styles.categories}>
          <h2 className={styles.sectionTitle}>活動カテゴリー</h2>
          <div className={styles.categoryGrid}>
            {categories.slice(0, 4).map((category, index) => (
              <ActivityCard
                key={category.id}
                category={category}
                colorVariant={colorVariants[index % colorVariants.length]}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.reports}>
        <h2 className={styles.sectionTitle}>活動レポート</h2>
        <ReportsList reports={reportsData.contents} />
        <Pagination totalCount={reportsData.totalCount} basePath="/activities" />
      </section>
    </div>
  );
}
