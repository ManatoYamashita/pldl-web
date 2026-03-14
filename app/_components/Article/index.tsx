import Image from 'next/image';
import { formatRichText } from '@/app/_libs/utils';
import { type Report } from '@/app/_libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import Category from '../Category';

type Props = {
  data: Report;
};

export default function Article({ data }: Props) {
  return (
    <article>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <div className={styles.meta}>
        <Category category={data.category} />
        <PublishedDate date={data.publishedAt || data.createdAt} />
      </div>
      {data.thumbnail && (
        <Image
          src={data.thumbnail?.url}
          alt={data.title}
          className={styles.thumbnail}
          width={data.thumbnail?.width}
          height={data.thumbnail?.height}
          sizes="100vw"
          priority
        />
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: `${formatRichText(data.content)}`,
        }}
      />
    </article>
  );
}
