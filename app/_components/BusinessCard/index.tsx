import Image from 'next/image';
import type { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
};

export default function BusinessCard({ category }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {category.thumbnail ? (
          <Image
            src={category.thumbnail.url}
            alt={category.name}
            width={category.thumbnail.width ?? 400}
            height={category.thumbnail.height ?? 300}
            className={styles.image}
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 920px) calc(50vw - 28px), 335px"
          />
        ) : (
          <Image
            src="/ogp.webp"
            alt="No Image"
            width={400}
            height={300}
            className={styles.image}
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 920px) calc(50vw - 28px), 335px"
          />
        )}
      </div>
      <h3 className={styles.title}>{category.name}</h3>
      {category.description && <p className={styles.description}>{category.description}</p>}
    </article>
  );
}
