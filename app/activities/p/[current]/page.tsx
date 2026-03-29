import type { Metadata } from 'next';
import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT, TOP_CATEGORY_NAMES } from '@/app/_constants';
import type { Category } from '@/app/_libs/microcms';
import ReportsList from '@/app/_components/ReportsList';
import ActivityCard from '@/app/_components/ActivityCard';
import Pagination from '@/app/_components/Pagination';
import CategoryFilter from '@/app/_components/CategoryFilter';
import BusinessCard from '@/app/_components/BusinessCard';
import ReportsReveal from '@/app/_components/ReportsReveal';
import styles from './page.module.css';
import activitiesStyles from '../../page.module.css';

type Props = {
  params: Promise<{
    current: string;
  }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const current = parseInt(params.current, 10);
  const categoryParam = searchParams.category;
  const selectedIds = categoryParam ? categoryParam.split(',').filter(Boolean) : [];

  let categoryLabel = '';
  if (selectedIds.length > 0) {
    try {
      const categoriesData = await getCategoryList();
      const activeNames = categoriesData.contents
        .filter((cat) => selectedIds.includes(cat.id))
        .map((cat) => cat.name);
      if (activeNames.length > 0) {
        categoryLabel = activeNames.join('・');
      }
    } catch {
      // fallthrough to default
    }
  }

  const pageTitle = categoryLabel
    ? `${categoryLabel}の活動レポート（${current}ページ目）`
    : `活動レポート（${current}ページ目）`;
  const pageDescription = categoryLabel
    ? `放課後こどもラボの「${categoryLabel}」に関する活動レポート一覧の${current}ページ目です。`
    : `放課後こどもラボの活動レポート一覧の${current}ページ目です。`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: current === 1 ? '/activities' : `/activities/p/${current}`,
    },
  };
}

export default async function Page(props: Props) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
  const current = parseInt(params.current as string, 10);
  const categoryParam = searchParams.category;
  const selectedIds = categoryParam ? categoryParam.split(',').filter(Boolean) : [];

  const queries: Parameters<typeof getReportsList>[0] = {
    limit: REPORTS_LIST_LIMIT,
    offset: REPORTS_LIST_LIMIT * (current - 1),
  };
  if (selectedIds.length > 0) {
    queries.filters = selectedIds.map((id) => `category[equals]${id}`).join('[or]');
  }

  const [reportsData, categoriesData] = await Promise.all([
    getReportsList(queries),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;
  const topCategories = TOP_CATEGORY_NAMES.map((name) =>
    categories.find((cat) => cat.name === name),
  ).filter((cat): cat is Category => cat !== undefined);

  const activeCategories = categories.filter((cat) => selectedIds.includes(cat.id));
  const title =
    activeCategories.length > 0
      ? `「${activeCategories.map((c) => c.name).join('・')}」の活動レポート`
      : '活動レポート';

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>活動内容</h1>
        <p className={styles.description}>
          PLDLでは、子供たちが遊びを通じて学ぶ様々な活動を行っています。
        </p>
      </section>

      {selectedIds.length > 0 ? (
        <>
          <section id="reports" className={styles.reports}>
            <ReportsReveal>
              <h2 className={styles.sectionTitle} data-reports-title>{title}</h2>
              <div data-reports-filter>
                <CategoryFilter categories={categories} selectedIds={selectedIds} scrollTargetId="reports" />
              </div>
              <ReportsList reports={reportsData.contents} />
              <div data-reports-pagination>
                <Pagination
                  totalCount={reportsData.totalCount}
                  current={current}
                  basePath="/activities"
                  q={`category=${selectedIds.join(',')}`}
                />
              </div>
            </ReportsReveal>
          </section>

          {topCategories.length > 0 && (
            <section className={activitiesStyles.activities}>
              <div className={activitiesStyles.activitiesContainer}>
                <h2 className={activitiesStyles.sectionTitle}>事業内容について</h2>
                <p className={activitiesStyles.activitiesDescription}>
                  遊びや体験を通じて、子供たちの好奇心と創造力を育む多彩なプログラムを提供しています。
                </p>
                <div className={activitiesStyles.activitiesGrid}>
                  {topCategories.map((category) => (
                    <BusinessCard
                      key={category.id}
                      category={category}
                      href={`/activities?category=${category.id}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          {categories.length > 0 && (
            <section className={styles.categories}>
              <h2 className={styles.sectionTitle}>活動カテゴリー</h2>
              {categories.slice(0, 4).map((category: Category, index: number) => (
                <ActivityCard key={category.id} category={category} reverse={index % 2 === 1} />
              ))}
            </section>
          )}

          <section id="reports" className={styles.reports}>
            <ReportsReveal>
              <h2 className={styles.sectionTitle} data-reports-title>活動レポート</h2>
              <div data-reports-filter>
                <CategoryFilter categories={categories} selectedIds={selectedIds} scrollTargetId="reports" />
              </div>
              <ReportsList reports={reportsData.contents} />
              <div data-reports-pagination>
                <Pagination totalCount={reportsData.totalCount} current={current} basePath="/activities" />
              </div>
            </ReportsReveal>
          </section>
        </>
      )}
    </div>
  );
}
