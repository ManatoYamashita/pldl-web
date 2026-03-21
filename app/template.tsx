import PageTransition from '@/app/_components/PageTransition';
import styles from './template.module.css';

type Props = { children: React.ReactNode };

export default function Template({ children }: Props) {
  return (
    <>
      <PageTransition />
      <div className={styles.wrapper}>{children}</div>
    </>
  );
}
