'use client';

import { useRouter } from 'next/navigation';
import classnames from 'classnames';
import type { Category } from '@/app/_libs/microcms';
import styles from './index.module.css';

type Props = {
  categories: Category[];
  selectedIds: string[];
  scrollTargetId?: string;
};

export default function CategoryFilter({ categories, selectedIds, scrollTargetId }: Props) {
  const router = useRouter();

  const navigateAndScroll = (url: string) => {
    router.push(url, { scroll: false });
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleCategory = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];

    const basePath = '/activities';
    const params = next.length > 0 ? `?category=${next.join(',')}` : '';
    navigateAndScroll(`${basePath}${params}`);
  };

  const clearAll = () => {
    navigateAndScroll('/activities');
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>カテゴリで絞り込み</span>
      <div className={styles.chipList}>
        {categories.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              className={classnames(styles.chip, isSelected && styles.chipSelected)}
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.name}
            </button>
          );
        })}
        {selectedIds.length > 0 && (
          <button type="button" className={styles.clearButton} onClick={clearAll}>
            すべて解除
          </button>
        )}
      </div>
    </div>
  );
}
