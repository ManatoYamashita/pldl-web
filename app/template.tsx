import dynamic from 'next/dynamic';
import styles from './template.module.css';

const PageTransition = dynamic(() => import('@/app/_components/PageTransition'));

type Props = { children: React.ReactNode };

export default function Template({ children }: Props) {
  return (
    <>
      <PageTransition />
      <div className={styles.wrapper}>{children}</div>
    </>
  );
}
