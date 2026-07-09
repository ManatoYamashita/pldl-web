import type { Metadata } from 'next';
import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT, TOP_CATEGORY_NAMES } from '@/app/_constants';
import type { Category } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import Sheet from '@/app/_components/Sheet';
import ReportsList from '@/app/_components/ReportsList';
import Pagination from '@/app/_components/Pagination';
import BusinessCard from '@/app/_components/BusinessCard';
import BusinessIntro from '@/app/_components/BusinessIntro';
import CategoryFilter from '@/app/_components/CategoryFilter';
import ReportsReveal from '@/app/_components/ReportsReveal';
import ScrollReveal from '@/app/_components/ScrollReveal';
import { BUSINESS_DETAILS } from '@/app/_constants/businesses';
import styles from './page.module.css';

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category: categoryParam } = await searchParams;
  const selectedIds = categoryParam ? categoryParam.split(',').filter(Boolean) : [];

  if (selectedIds.length > 0) {
    try {
      const categoriesData = await getCategoryList();
      const activeNames = categoriesData.contents
        .filter((cat) => selectedIds.includes(cat.id))
        .map((cat) => cat.name);

      // 単一事業カテゴリ選択時は、事業紹介向けのメタデータを出力
      if (activeNames.length === 1) {
        const detail = BUSINESS_DETAILS[activeNames[0]];
        if (detail) {
          const bizTitle = `${detail.name}｜${detail.tagline}`;
          return {
            title: bizTitle,
            description: detail.lead[0],
            openGraph: {
              title: bizTitle,
              description: detail.lead[0],
            },
            alternates: { canonical: '/activities' },
          };
        }
      }

      if (activeNames.length > 0) {
        const joined = activeNames.join('・');
        const catTitle = `${joined}の活動レポート`;
        const catDescription = `放課後こどもラボの「${joined}」に関する活動レポート一覧です。`;
        return {
          title: catTitle,
          description: catDescription,
          openGraph: {
            title: catTitle,
            description: catDescription,
          },
          alternates: { canonical: '/activities' },
        };
      }
    } catch {
      // カテゴリが見つからない場合はデフォルト
    }
  }

  return {
    title: '活動内容',
    description:
      '放課後こどもラボの活動レポート一覧。ものづくり・実験・プログラミング・自然活動など、こどもたちの創造的な学びの記録です。',
    openGraph: {
      title: '活動内容',
      description:
        '放課後こどもラボの活動レポート一覧。ものづくり・実験・プログラミング・自然活動など、こどもたちの創造的な学びの記録です。',
    },
    alternates: { canonical: '/activities' },
  };
}

export default async function Page({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams;
  const selectedIds = categoryParam ? categoryParam.split(',').filter(Boolean) : [];

  const queries: Parameters<typeof getReportsList>[0] = {
    limit: REPORTS_LIST_LIMIT,
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

  // 単一事業カテゴリ選択時のみ、その事業の紹介セクションを表示する
  const singleBusiness =
    activeCategories.length === 1
      ? (BUSINESS_DETAILS[activeCategories[0].name] ?? null)
      : null;

  return (
    <>
      <Hero title="活動内容" sub="Activities" imageSrc="/photos/kids-craft-activity-table.webp" />

      {singleBusiness && (
        <ScrollReveal>
          <BusinessIntro business={singleBusiness} />
        </ScrollReveal>
      )}

      <Sheet id="reports">
        <ReportsReveal>
          <h2 className={styles.sectionTitle} data-reports-title>{title}</h2>
          <div data-reports-filter>
            <CategoryFilter categories={categories} selectedIds={selectedIds} scrollTargetId="reports" />
          </div>
          <ReportsList reports={reportsData.contents} />
          <div data-reports-pagination>
            <Pagination
              totalCount={reportsData.totalCount}
              current={1}
              basePath="/activities"
              q={selectedIds.length > 0 ? `category=${selectedIds.join(',')}` : undefined}
            />
          </div>
        </ReportsReveal>
      </Sheet>

      {topCategories.length > 0 && (
        <section className={styles.activities}>
          <div className={styles.activitiesContainer}>
            <h2 className={styles.sectionTitle}>事業内容について</h2>
            <p className={styles.activitiesDescription}>
              遊びや体験を通じて、子供たちの好奇心と創造力を育む多彩なプログラムを提供しています。
            </p>
            <div className={styles.activitiesGrid}>
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
  );
}
