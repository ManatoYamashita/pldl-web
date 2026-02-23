import Link from 'next/link';
import Image from 'next/image';
import { Report } from '@/app/_libs/microcms';
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
        {report.thumbnail ? (
          <Image
            src={report.thumbnail?.url}
            alt=""
            className={styles.image}
            width={report.thumbnail?.width}
            height={report.thumbnail?.height}
          />
        ) : (
          <Image
            className={styles.image}
            src="/no-image.png"
            alt="No Image"
            width={1200}
            height={630}
          />
        )}
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
