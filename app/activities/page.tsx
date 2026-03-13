import { getCategoryList } from '@/app/_libs/microcms';
import ActivityCard from '@/app/_components/ActivityCard';
import styles from './page.module.css';

export default async function Page() {
  const categoriesData = await getCategoryList();

  const categories = categoriesData.contents.filter(
    (category) => category.name !== 'その他',
  );

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
          {categories.map((category, index) => (
            <ActivityCard
              key={category.id}
              category={category}
              reverse={index % 2 === 1}
            />
          ))}
        </section>
      )}
    </div>
  );
}
