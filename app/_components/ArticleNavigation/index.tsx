import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Report } from '@/app/_libs/microcms';
import styles from './index.module.css';

type NavReport = Pick<Report, 'id' | 'title'>;

type Props = {
  prevReport: NavReport | null;
  nextReport: NavReport | null;
};

export default function ArticleNavigation({ prevReport, nextReport }: Props) {
  if (!prevReport && !nextReport) return null;

  return (
    <nav className={styles.nav} aria-label="前後の記事">
      <div className={styles.grid}>
        {prevReport ? (
          <Link href={`/activities/${prevReport.id}`} className={styles.link}>
            <ChevronLeft size={20} aria-hidden="true" />
            <div className={styles.linkContent}>
              <span className={styles.label}>前の記事</span>
              <span className={styles.title}>{prevReport.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextReport ? (
          <Link href={`/activities/${nextReport.id}`} className={`${styles.link} ${styles.next}`}>
            <div className={styles.linkContent}>
              <span className={styles.label}>次の記事</span>
              <span className={styles.title}>{nextReport.title}</span>
            </div>
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
