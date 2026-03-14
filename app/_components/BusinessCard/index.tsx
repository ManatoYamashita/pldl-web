import Image from 'next/image';
import { Dela_Gothic_One } from 'next/font/google';
import type { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

const delaGothicOne = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

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
          />
        ) : (
          <Image
            src="/no-image.png"
            alt="No Image"
            width={400}
            height={300}
            className={styles.image}
          />
        )}
      </div>
      <h3 className={`${styles.title} ${delaGothicOne.className}`}>{category.name}</h3>
    </article>
  );
}
