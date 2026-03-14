import { Metadata } from 'next';
import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT, TOP_CATEGORY_NAMES } from '@/app/_constants';
import type { Category } from '@/app/_libs/microcms';
import Hero from '@/app/_components/Hero';
import Sheet from '@/app/_components/Sheet';
import ReportsList from '@/app/_components/ReportsList';
import BusinessCard from '@/app/_components/BusinessCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '活動内容',
  description:
    '放課後こどもラボの活動レポート一覧。ものづくり・実験・プログラミング・自然活動など、こどもたちの創造的な学びの記録です。',
  alternates: { canonical: '/activities' },
};

export default async function Page() {
  const [reportsData, categoriesData] = await Promise.all([
    getReportsList({ limit: REPORTS_LIST_LIMIT }),
    getCategoryList(),
  ]);

  const categories = categoriesData.contents;
  const topCategories = TOP_CATEGORY_NAMES
    .map((name) => categories.find((cat) => cat.name === name))
    .filter((cat): cat is Category => cat !== undefined);

  return (
    <>
      <Hero title="活動内容" sub="Activities" compact />

      <Sheet>
        <h2 className={styles.sectionTitle}>活動レポート</h2>
        <ReportsList reports={reportsData.contents} />
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
                <BusinessCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
