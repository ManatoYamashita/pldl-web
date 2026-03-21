import Link from 'next/link';
import Image from 'next/image';
import { type Report } from '@/app/_libs/microcms';
import { formatDate } from '@/app/_libs/utils';
import styles from './index.module.css';

type Props = {
  reports: Report[];
};

export default function RelatedReports({ reports }: Props) {
  if (reports.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>関連する活動レポート</h2>
      <div className={styles.grid}>
        {reports.map((report) => (
          <Link key={report.id} href={`/activities/${report.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={report.thumbnail?.url || '/ogp.webp'}
                alt=""
                className={styles.image}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.title}>{report.title}</h3>
              <div className={styles.meta}>
                {report.category && (
                  <span className={styles.category}>{report.category.name}</span>
                )}
                <span className={styles.date}>{formatDate(report.publishedAt || report.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
