import Image from 'next/image';
import type { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  index: number;
};

const ACCENT_CLASSES = [
  styles.accentPrimary,
  styles.accentSecondary,
  styles.accentTertiary,
] as const;

export default function BusinessCard({ category, index }: Props) {
  const accent = ACCENT_CLASSES[index % ACCENT_CLASSES.length];
  const label = `BUSINESS ${index + 1}`;

  return (
    <article className={`${styles.card} ${accent}`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.imageWrapper}>
        {category.thumbnail ? (
          <Image
            src={category.thumbnail.url}
            alt={category.name}
            width={180}
            height={180}
            className={styles.image}
          />
        ) : (
          <Image
            src="/no-image.png"
            alt="No Image"
            width={180}
            height={180}
            className={styles.image}
          />
        )}
      </div>
      <h3 className={styles.title}>{category.name}</h3>
      <p className={styles.description}>{category.description}</p>
    </article>
  );
}
