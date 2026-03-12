import Image from 'next/image';
import { Category } from '@/app/_libs/microcms';
import ButtonLink from '@/app/_components/ButtonLink';
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
        <div className={styles.separator} />
        <p className={styles.description}>{category.description}</p>
        <ButtonLink href={`/activities?category=${category.id}`}>
          詳しく見る
        </ButtonLink>
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
          width={400}
          height={300}
          className={styles.image}
        />
      )}
    </div>
  );
}
