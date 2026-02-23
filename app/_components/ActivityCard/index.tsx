import Link from 'next/link';
import { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  category: Category;
  colorVariant?: 'primary' | 'secondary' | 'tertiary' | 'accent';
};

export default function ActivityCard({ category, colorVariant = 'primary' }: Props) {
  return (
    <Link href={`/activities?category=${category.id}`} className={`${styles.card} ${styles[colorVariant]}`}>
      <h3 className={styles.title}>{category.name}</h3>
      <p className={styles.description}>{category.description}</p>
    </Link>
  );
}
