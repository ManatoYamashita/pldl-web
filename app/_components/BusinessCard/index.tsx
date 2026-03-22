import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/app/_libs/microcms';
import { CATEGORY_IMAGE_MAP } from '@/app/_constants';
import styles from './index.module.css';

type Props = {
  category: Category;
  href?: string;
};

export default function BusinessCard({ category, href }: Props) {
  const imageSrc =
    CATEGORY_IMAGE_MAP[category.name] ?? category.thumbnail?.url ?? '/ogp.webp';

  const card = (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={category.name}
          width={400}
          height={400}
          className={styles.image}
          sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 920px) calc(50vw - 28px), 335px"
        />
      </div>
      <h3 className={styles.title}>{category.name}</h3>
      {category.description && <p className={styles.description}>{category.description}</p>}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {card}
      </Link>
    );
  }

  return card;
}
