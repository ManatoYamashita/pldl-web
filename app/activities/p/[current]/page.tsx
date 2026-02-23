import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT } from '@/app/_constants';
import ReportsList from '@/app/_components/ReportsList';
import ActivityCard from '@/app/_components/ActivityCard';
import Pagination from '@/app/_components/Pagination';
import styles from './page.module.css';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const [reportsData, categoriesData] = await Promise.all([
    getReportsList({
      limit: REPORTS_LIST_LIMIT,
      offset: REPORTS_LIST_LIMIT * (current - 1),
    }),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;

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
          {categories.slice(0, 4).map((category, index) => (
            <ActivityCard
              key={category.id}
              category={category}
              reverse={index % 2 === 1}
            />
          ))}
        </section>
      )}

      <section className={styles.reports}>
        <h2 className={styles.sectionTitle}>活動レポート</h2>
        <ReportsList reports={reportsData.contents} />
        <Pagination totalCount={reportsData.totalCount} current={current} basePath="/activities" />
      </section>
    </div>
  );
}
