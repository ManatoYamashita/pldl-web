import { Clock } from 'lucide-react';
import { formatDate } from '@/app/_libs/utils';
import styles from './index.module.css';

type Props = {
  date: string;
};

export default function PublishedDate({ date }: Props) {
  return (
    <span className={styles.date}>
      <Clock size={16} aria-hidden="true" />
      {formatDate(date)}
    </span>
  );
}
