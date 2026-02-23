import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  reverse?: boolean;
};

export default function ActivityCard({ category, reverse = false }: Props) {
  return (
    <div className={`${styles.card} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.textBlock}>
        <h3 className={styles.title}>{category.name}</h3>
        <p className={styles.description}>{category.description}</p>
        <Link href={`/activities?category=${category.id}`} className={styles.link}>
          詳しく見る →
        </Link>
      </div>
      {category.thumbnail ? (
        <Image
          src={category.thumbnail.url}
          alt={category.name}
          width={category.thumbnail.width}
          height={category.thumbnail.height}
          className={styles.image}
        />
      ) : (
        <Image
          src="/no-image.png"
          alt="No Image"
          width={240}
          height={180}
          className={styles.image}
        />
      )}
    </div>
  );
}
