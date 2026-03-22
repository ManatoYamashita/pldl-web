import Link from 'next/link';
import Image from 'next/image';
import { Report, optimizeImageUrl } from '@/app/_libs/microcms';
import styles from './index.module.css';
import PublishedDate from '../Date';
import Category from '../Category';

type Props = {
  report: Report;
};

export default function ReportsListItem({ report }: Props) {
  return (
    <li className={styles.list}>
      <Link href={`/activities/${report.id}`} className={styles.link}>
        <div className={styles.imageContainer}>
          {report.thumbnail ? (
            <Image
              src={optimizeImageUrl(report.thumbnail.url, 400)}
              alt=""
              className={styles.image}
              fill
              sizes="(max-width: 768px) 120px, 200px"
            />
          ) : (
            <Image
              className={styles.image}
              src="/ogp.webp"
              alt="No Image"
              fill
              sizes="(max-width: 768px) 120px, 200px"
            />
          )}
        </div>
        <dl className={styles.content}>
          <dt className={styles.title}>{report.title}</dt>
          <dd className={styles.meta}>
            <Category category={report.category} />
            <PublishedDate date={report.publishedAt || report.createdAt} />
          </dd>
        </dl>
      </Link>
    </li>
  );
}
